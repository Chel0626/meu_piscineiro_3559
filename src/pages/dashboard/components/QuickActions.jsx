import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ onNavigate }) => {
  const quickActions = [
    {
      title: 'Nova Visita',
      description: 'Iniciar atendimento a cliente',
      icon: 'UserPlus',
      color: 'bg-blue-600 hover:bg-blue-700',
      route: '/service-visit-workflow'
    },
    {
      title: 'Gerenciar Clientes',
      description: 'Ver todos os clientes',
      icon: 'Users',
      color: 'bg-green-600 hover:bg-green-700',
      route: '/client-management'
    },
    {
      title: 'Estoque',
      description: 'Controlar produtos',
      icon: 'Package',
      color: 'bg-purple-600 hover:bg-purple-700',
      route: '/product-inventory'
    },
    {
      title: 'Histórico',
      description: 'Relatórios de serviços',
      icon: 'FileText',
      color: 'bg-orange-600 hover:bg-orange-700',
      route: '/client-service-history'
    },
    {
      title: 'Assistente IA',
      description: 'Ajuda com IA Gemini',
      icon: 'Brain',
      color: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
      route: '/ai-assistant'
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