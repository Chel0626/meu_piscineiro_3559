import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import ClientCard from './ClientCard';

const WeeklyCalendar = ({ clients, onCheckIn, selectedDay, onDayChange }) => {
  const weekDays = [
    { key: 'monday', label: 'Segunda', short: 'SEG' },
    { key: 'tuesday', label: 'Terça', short: 'TER' },
    { key: 'wednesday', label: 'Quarta', short: 'QUA' },
    { key: 'thursday', label: 'Quinta', short: 'QUI' },
    { key: 'friday', label: 'Sexta', short: 'SEX' },
    { key: 'saturday', label: 'Sábado', short: 'SAB' },
    { key: 'sunday', label: 'Domingo', short: 'DOM' }
  ];

  const getClientsForDay = (day) => {
    return clients?.filter(client => client?.scheduledDay === day);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-elevation-1 overflow-hidden">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays?.map((day) => {
            const dayClients = getClientsForDay(day?.key);
            const completedCount = dayClients?.filter(c => c?.status === 'completed')?.length;
            const totalCount = dayClients?.length;
            
            return (
              <div key={day?.key} className="p-4 border-r border-gray-200 last:border-r-0">
                <div className="text-center mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1">{day?.label}</h3>
                  <div className="text-sm text-gray-500">
                    {completedCount}/{totalCount} concluídas
                  </div>
                </div>
                <div className="space-y-2 min-h-[400px]">
                  {dayClients?.map((client) => (
                    <ClientCard
                      key={client?.id}
                      client={client}
                      onCheckIn={onCheckIn}
                      compact={true}
                    />
                  ))}
                  
                  {dayClients?.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Icon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma visita agendada</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Mobile/Tablet View */}
      <div className="lg:hidden">
        {/* Day Selector */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
          {weekDays?.map((day) => {
            const dayClients = getClientsForDay(day?.key);
            const isSelected = selectedDay === day?.key;
            
            return (
              <button
                key={day?.key}
                onClick={() => onDayChange(day?.key)}
                className={`flex-shrink-0 px-4 py-3 text-center border-b-2 transition-colors ${
                  isSelected
                    ? 'border-blue-600 bg-white text-blue-600' :'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="font-medium text-sm">{day?.short}</div>
                <div className="text-xs mt-1">
                  {dayClients?.length > 0 && (
                    <span className={`inline-block w-5 h-5 rounded-full text-xs leading-5 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      {dayClients?.length}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Content */}
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {weekDays?.find(d => d?.key === selectedDay)?.label}
            </h3>
            <div className="text-sm text-gray-500">
              {getClientsForDay(selectedDay)?.filter(c => c?.status === 'completed')?.length}/
              {getClientsForDay(selectedDay)?.length} visitas concluídas
            </div>
          </div>

          <div className="space-y-3">
            {getClientsForDay(selectedDay)?.map((client) => (
              <ClientCard
                key={client?.id}
                client={client}
                onCheckIn={onCheckIn}
                compact={false}
              />
            ))}
            
            {getClientsForDay(selectedDay)?.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Nenhuma visita agendada</p>
                <p className="text-sm">Aproveite para organizar outros dias da semana</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;