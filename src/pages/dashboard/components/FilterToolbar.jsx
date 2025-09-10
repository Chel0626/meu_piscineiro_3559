import React from 'react';

import Button from '../../../components/ui/Button';

const FilterToolbar = ({ 
  selectedStatus, 
  onStatusChange, 
  clients, 
  selectedDay, 
  onDayChange 
}) => {
  const statusFilters = [
    { key: 'all', label: 'Todas', icon: 'List' },
    { key: 'pending', label: 'Pendentes', icon: 'Clock' },
    { key: 'in-progress', label: 'Em Andamento', icon: 'Play' },
    { key: 'completed', label: 'Concluídas', icon: 'CheckCircle' }
  ];

  const getStatusCount = (status) => {
    if (status === 'all') return clients?.length;
    return clients?.filter(client => client?.status === status)?.length;
  };

  const weekDays = [
    { key: 'all', label: 'Todos os Dias' },
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-elevation-1 p-4 mb-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Status Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <h3 className="text-sm font-medium text-gray-700 flex-shrink-0">
            Filtrar por Status:
          </h3>
          <div className="flex flex-wrap gap-2">
            {statusFilters?.map((filter) => {
              const count = getStatusCount(filter?.key);
              const isSelected = selectedStatus === filter?.key;
              
              return (
                <Button
                  key={filter?.key}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange(filter?.key)}
                  iconName={filter?.icon}
                  iconPosition="left"
                  iconSize={14}
                  className="flex-shrink-0"
                >
                  {filter?.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    isSelected 
                      ? 'bg-white/20 text-white' :'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Users"
            iconPosition="left"
            iconSize={14}
            onClick={() => window.location.href = '/client-management'}
          >
            Gerenciar Clientes
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Package"
            iconPosition="left"
            iconSize={14}
            onClick={() => window.location.href = '/product-inventory'}
          >
            Produtos
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="History"
            iconPosition="left"
            iconSize={14}
            onClick={() => window.location.href = '/client-service-history'}
          >
            Histórico
          </Button>
        </div>
      </div>
      {/* Mobile Day Filter */}
      <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Filtrar por Dia:
        </h3>
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {weekDays?.map((day) => (
            <Button
              key={day?.key}
              variant={selectedDay === day?.key ? "default" : "outline"}
              size="sm"
              onClick={() => onDayChange(day?.key)}
              className="flex-shrink-0"
            >
              {day?.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;