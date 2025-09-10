import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ onNavigate }) => {
  const quickActions = [
    {
      title: 'Gerenciar Clientes',
      description: 'Adicionar, editar ou remover clientes',
      icon: 'Users',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600',
      route: '/client-management'
    },
    {
      title: 'Inventário de Produtos',
      description: 'Controlar estoque de produtos químicos',
      icon: 'Package',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600',
      route: '/product-inventory'
    },
    {
      title: 'Histórico de Serviços',
      description: 'Visualizar histórico completo de visitas',
      icon: 'History',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      iconColor: 'text-purple-600',
      route: '/client-service-history'
    },
    {
      title: 'Nova Visita',
      description: 'Iniciar uma visita de serviço',
      icon: 'Plus',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      iconColor: 'text-orange-600',
      route: '/service-visit-workflow'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-elevation-1 p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
        <Icon name="Zap" size={20} className="text-gray-400" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${action?.color}`}
            onClick={() => onNavigate(action?.route)}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-white shadow-sm ${action?.iconColor}`}>
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 mb-1">
                  {action?.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {action?.description}
                </p>
              </div>
              <Icon name="ArrowRight" size={16} className="text-gray-400 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;