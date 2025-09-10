import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClientCard = ({ client, onCheckIn, compact = false }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: 'CheckCircle',
          label: 'Concluída'
        };
      case 'in-progress':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: 'Clock',
          label: 'Em Andamento'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: 'Calendar',
          label: 'Pendente'
        };
    }
  };

  const statusConfig = getStatusConfig(client?.status);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp)?.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return '';
    const duration = Math.round((new Date(end) - new Date(start)) / (1000 * 60));
    return `${duration} min`;
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
      compact ? 'p-3' : 'p-4'
    }`}>
      {/* Client Info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-gray-900 truncate ${
            compact ? 'text-sm' : 'text-base'
          }`}>
            {client?.name}
          </h4>
          <div className="flex items-center mt-1 text-gray-500">
            <Icon name="MapPin" size={compact ? 12 : 14} className="mr-1 flex-shrink-0" />
            <p className={`truncate ${compact ? 'text-xs' : 'text-sm'}`}>
              {client?.address}
            </p>
          </div>
          {!compact && client?.phone && (
            <div className="flex items-center mt-1 text-gray-500">
              <Icon name="Phone" size={14} className="mr-1 flex-shrink-0" />
              <p className="text-sm">{client?.phone}</p>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig?.color}`}>
          <Icon name={statusConfig?.icon} size={12} className="mr-1" />
          {compact ? '' : statusConfig?.label}
        </span>
      </div>
      {/* Visit Details */}
      {client?.status !== 'pending' && (
        <div className={`mb-3 ${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
          {client?.status === 'in-progress' && client?.startTime && (
            <div className="flex items-center">
              <Icon name="Play" size={compact ? 12 : 14} className="mr-1 text-blue-600" />
              <span>Iniciado às {formatTime(client?.startTime)}</span>
            </div>
          )}
          
          {client?.status === 'completed' && client?.startTime && client?.endTime && (
            <div className="space-y-1">
              <div className="flex items-center">
                <Icon name="Clock" size={compact ? 12 : 14} className="mr-1 text-green-600" />
                <span>
                  {formatTime(client?.startTime)} - {formatTime(client?.endTime)}
                  {' '}({formatDuration(client?.startTime, client?.endTime)})
                </span>
              </div>
              {!compact && client?.servicesSummary && (
                <div className="flex items-center">
                  <Icon name="CheckSquare" size={14} className="mr-1 text-green-600" />
                  <span>{client?.servicesSummary}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {client?.estimatedDuration && (
          <div className="flex items-center text-gray-500">
            <Icon name="Timer" size={compact ? 12 : 14} className="mr-1" />
            <span className={compact ? 'text-xs' : 'text-sm'}>
              ~{client?.estimatedDuration} min
            </span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {client?.status === 'pending' && (
            <Button
              variant="default"
              size={compact ? "sm" : "default"}
              onClick={() => onCheckIn(client)}
              iconName="Play"
              iconPosition="left"
              iconSize={compact ? 14 : 16}
            >
              {compact ? 'Iniciar' : 'Check-in'}
            </Button>
          )}
          
          {client?.status === 'in-progress' && (
            <Button
              variant="outline"
              size={compact ? "sm" : "default"}
              onClick={() => onCheckIn(client)}
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={compact ? 14 : 16}
            >
              {compact ? 'Continuar' : 'Continuar Visita'}
            </Button>
          )}
          
          {client?.status === 'completed' && (
            <Button
              variant="ghost"
              size={compact ? "sm" : "default"}
              onClick={() => onCheckIn(client)}
              iconName="Eye"
              iconPosition="left"
              iconSize={compact ? 14 : 16}
            >
              {compact ? 'Ver' : 'Ver Detalhes'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientCard;