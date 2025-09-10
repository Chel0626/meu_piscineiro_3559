import React from 'react';
import Icon from '../../../components/AppIcon';

const ServiceSummaryPanel = ({ client, visits }) => {
  const calculateStats = () => {
    if (!visits || visits?.length === 0) {
      return {
        totalVisits: 0,
        avgDuration: 0,
        lastVisit: null,
        nextVisit: null,
        completedVisits: 0,
        avgParameterTrends: {}
      };
    }

    const completedVisits = visits?.filter(v => v?.status === 'Concluído');
    const totalDuration = completedVisits?.reduce((sum, v) => sum + v?.duration, 0);
    const avgDuration = completedVisits?.length > 0 ? Math.round(totalDuration / completedVisits?.length) : 0;

    // Calculate parameter trends
    const parameterTrends = {};
    const parameters = ['ph', 'chlorine', 'alkalinity', 'calcium', 'cyanuric'];
    
    parameters?.forEach(param => {
      const values = completedVisits?.map(v => parseFloat(v?.waterParameters?.[param]))?.filter(val => !isNaN(val));
      
      if (values?.length > 0) {
        parameterTrends[param] = {
          avg: (values?.reduce((sum, val) => sum + val, 0) / values?.length)?.toFixed(1),
          trend: values?.length > 1 ? 
            (values?.[values?.length - 1] > values?.[0] ? 'up' : 
             values?.[values?.length - 1] < values?.[0] ? 'down' : 'stable') : 'stable'
        };
      }
    });

    const sortedVisits = [...visits]?.sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastVisit = sortedVisits?.[0];
    
    // Calculate next visit based on client's scheduled day
    const nextVisit = calculateNextVisit(client?.scheduledDay);

    return {
      totalVisits: visits?.length,
      completedVisits: completedVisits?.length,
      avgDuration,
      lastVisit,
      nextVisit,
      avgParameterTrends: parameterTrends
    };
  };

  const calculateNextVisit = (scheduledDay) => {
    const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const dayIndex = days?.indexOf(scheduledDay?.toLowerCase());
    
    if (dayIndex === -1) return null;

    const today = new Date();
    const currentDay = today?.getDay();
    let daysUntilNext = dayIndex - currentDay;
    
    if (daysUntilNext <= 0) {
      daysUntilNext += 7;
    }

    const nextDate = new Date(today);
    nextDate?.setDate(today?.getDate() + daysUntilNext);
    
    return nextDate;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date)?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <Icon name="TrendingUp" size={16} className="text-green-600" />;
      case 'down':
        return <Icon name="TrendingDown" size={16} className="text-red-600" />;
      default:
        return <Icon name="Minus" size={16} className="text-gray-600" />;
    }
  };

  const getParameterLabel = (param) => {
    const labels = {
      ph: 'pH',
      chlorine: 'Cloro Livre',
      alkalinity: 'Alcalinidade',
      calcium: 'Dureza Cálcica',
      cyanuric: 'Ácido Cianúrico'
    };
    return labels?.[param] || param;
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Resumo do Cliente</h2>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="BarChart3" size={24} className="text-blue-600" />
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">{client?.name}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={14} />
              <span>{client?.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Phone" size={14} />
              <span>{client?.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={14} />
              <span>Visitas: {client?.scheduledDay}</span>
            </div>
          </div>
        </div>

        {/* Visit Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats?.totalVisits}</div>
            <div className="text-sm text-gray-600">Total de Visitas</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats?.completedVisits}</div>
            <div className="text-sm text-gray-600">Concluídas</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formatDuration(stats?.avgDuration)}</div>
            <div className="text-sm text-gray-600">Duração Média</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {stats?.nextVisit ? formatDate(stats?.nextVisit) : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Próxima Visita</div>
          </div>
        </div>

        {/* Parameter Trends */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Icon name="Activity" size={16} className="mr-2" />
            Tendências dos Parâmetros
          </h4>
          <div className="space-y-2">
            {Object.entries(stats?.avgParameterTrends)?.map(([param, data]) => (
              <div key={param} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{getParameterLabel(param)}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {data?.avg}
                  </span>
                  {getTrendIcon(data?.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Visit Info */}
        {stats?.lastVisit && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Icon name="Clock" size={16} className="mr-2" />
              Última Visita
            </h4>
            <div className="text-sm text-gray-600">
              <p>{formatDate(stats?.lastVisit?.date)} - {stats?.lastVisit?.technician}</p>
              <p className="mt-1">Duração: {formatDuration(stats?.lastVisit?.duration)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSummaryPanel;