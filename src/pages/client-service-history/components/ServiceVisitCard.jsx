import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceVisitCard = ({ visit, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString)?.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formatDate(visit?.date)}
              </h3>
              <p className="text-sm text-gray-500">
                {formatTime(visit?.startTime)} - {formatTime(visit?.endTime)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit?.status)}`}>
              {visit?.status}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              {isExpanded ? 'Ocultar' : 'Detalhes'}
            </Button>
          </div>
        </div>

        {/* Summary Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              Duração: {formatDuration(visit?.duration)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="User" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              Técnico: {visit?.technician}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Package" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {visit?.productsUsed?.length} produtos aplicados
            </span>
          </div>
        </div>

        {/* Quick Parameters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {Object.entries(visit?.waterParameters)?.map(([key, value]) => (
            <div key={key} className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {key === 'ph' ? 'pH' : 
                 key === 'chlorine' ? 'Cloro' :
                 key === 'alkalinity' ? 'Alcalinidade' :
                 key === 'calcium' ? 'Cálcio' :
                 key === 'cyanuric' ? 'Ácido Cianúrico' : key}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            {/* Products Used */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <Icon name="Package" size={16} className="mr-2" />
                Produtos Aplicados
              </h4>
              <div className="space-y-2">
                {visit?.productsUsed?.map((product, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{product?.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.quantity} {product?.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technician Notes */}
            {visit?.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <Icon name="FileText" size={16} className="mr-2" />
                  Observações do Técnico
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {visit?.notes}
                </p>
              </div>
            )}

            {/* Recommendations */}
            {visit?.recommendations && visit?.recommendations?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <Icon name="Lightbulb" size={16} className="mr-2" />
                  Recomendações
                </h4>
                <div className="space-y-2">
                  {visit?.recommendations?.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                      <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{rec?.description}</p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                          rec?.status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                          rec?.status === 'Pendente'? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {rec?.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(visit)}
                iconName="Eye"
                iconPosition="left"
                className="flex-1"
              >
                Ver Relatório Completo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconPosition="left"
                className="flex-1"
              >
                Exportar PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceVisitCard;