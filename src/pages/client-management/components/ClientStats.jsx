import React from 'react';
import Icon from '../../../components/AppIcon';

const ClientStats = ({ clients }) => {
  const stats = {
    total: clients?.length,
    active: clients?.filter(c => c?.status === 'Ativo')?.length,
    inactive: clients?.filter(c => c?.status === 'Inativo')?.length,
    pending: clients?.filter(c => c?.status === 'Pendente')?.length
  };

  const visitDayStats = clients?.reduce((acc, client) => {
    if (client?.visitDay) {
      acc[client.visitDay] = (acc?.[client?.visitDay] || 0) + 1;
    }
    return acc;
  }, {});

  const mostPopularDay = Object.entries(visitDayStats)?.reduce((a, b) => 
    visitDayStats?.[a?.[0]] > visitDayStats?.[b?.[0]] ? a : b, ['', 0]
  );

  const statCards = [
    {
      title: 'Total de Clientes',
      value: stats?.total,
      icon: 'Users',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Clientes Ativos',
      value: stats?.active,
      icon: 'CheckCircle',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Clientes Inativos',
      value: stats?.inactive,
      icon: 'XCircle',
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600'
    },
    {
      title: 'Pendentes',
      value: stats?.pending,
      icon: 'Clock',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-elevation-1 p-6">
          <div className="flex items-center">
            <div className={`${stat?.color} rounded-lg p-3`}>
              <Icon name={stat?.icon} size={24} color="white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat?.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat?.value}</p>
            </div>
          </div>
          
          {index === 0 && mostPopularDay?.[0] && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <Icon name="TrendingUp" size={16} className="mr-2" />
                <span>Dia mais popular: <strong>{mostPopularDay?.[0]}</strong> ({mostPopularDay?.[1]} clientes)</span>
              </div>
            </div>
          )}
          
          {index === 1 && stats?.total > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <Icon name="Percent" size={16} className="mr-2" />
                <span>{Math.round((stats?.active / stats?.total) * 100)}% dos clientes</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClientStats;