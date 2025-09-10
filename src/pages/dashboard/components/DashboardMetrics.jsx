import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardMetrics = ({ clients }) => {
  const calculateMetrics = () => {
    const today = new Date()?.toLocaleDateString('pt-BR', { weekday: 'long' })?.toLowerCase();
    const dayMapping = {
      'segunda-feira': 'monday',
      'terça-feira': 'tuesday',
      'quarta-feira': 'wednesday',
      'quinta-feira': 'thursday',
      'sexta-feira': 'friday',
      'sábado': 'saturday',
      'domingo': 'sunday'
    };
    
    const currentDay = dayMapping?.[today] || 'monday';
    const todayClients = clients?.filter(client => client?.scheduledDay === currentDay);
    
    const totalVisits = clients?.length;
    const todayVisits = todayClients?.length;
    const completedToday = todayClients?.filter(client => client?.status === 'completed')?.length;
    const inProgressToday = todayClients?.filter(client => client?.status === 'in-progress')?.length;
    const pendingToday = todayClients?.filter(client => client?.status === 'pending')?.length;
    
    const completionRate = todayVisits > 0 ? Math.round((completedToday / todayVisits) * 100) : 0;
    
    const totalCompleted = clients?.filter(client => client?.status === 'completed')?.length;
    const weeklyCompletionRate = totalVisits > 0 ? Math.round((totalCompleted / totalVisits) * 100) : 0;

    return {
      todayVisits,
      completedToday,
      inProgressToday,
      pendingToday,
      completionRate,
      totalVisits,
      weeklyCompletionRate
    };
  };

  const metrics = calculateMetrics();

  const metricCards = [
    {
      title: 'Visitas Hoje',
      value: metrics?.todayVisits,
      subtitle: `${metrics?.completedToday} concluídas`,
      icon: 'Calendar',
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Taxa de Conclusão',
      value: `${metrics?.completionRate}%`,
      subtitle: 'Hoje',
      icon: 'TrendingUp',
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Em Andamento',
      value: metrics?.inProgressToday,
      subtitle: 'Visitas ativas',
      icon: 'Clock',
      color: 'bg-orange-50 text-orange-600',
      iconBg: 'bg-orange-100'
    },
    {
      title: 'Pendentes',
      value: metrics?.pendingToday,
      subtitle: 'Para hoje',
      icon: 'AlertCircle',
      color: 'bg-gray-50 text-gray-600',
      iconBg: 'bg-gray-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricCards?.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg shadow-elevation-1 p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {metric?.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {metric?.value}
              </p>
              <p className="text-xs text-gray-500">
                {metric?.subtitle}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${metric?.iconBg}`}>
              <Icon 
                name={metric?.icon} 
                size={24} 
                className={metric?.color?.split(' ')?.[1]} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;