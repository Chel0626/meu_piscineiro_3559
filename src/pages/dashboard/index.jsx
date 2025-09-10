import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import WeeklyCalendar from './components/WeeklyCalendar';

import DashboardMetrics from './components/DashboardMetrics';
import FilterToolbar from './components/FilterToolbar';
import QuickActions from './components/QuickActions';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock client data
  const mockClients = [
    {
      id: 1,
      name: "Carlos Silva",
      address: "Rua das Flores, 123 - Jardim Paulista",
      phone: "(11) 99999-1234",
      scheduledDay: "monday",
      status: "completed",
      estimatedDuration: 45,
      startTime: new Date(2025, 8, 10, 8, 30),
      endTime: new Date(2025, 8, 10, 9, 15),
      servicesSummary: "Limpeza completa, ajuste pH e cloro"
    },
    {
      id: 2,
      name: "Maria Santos",
      address: "Av. Paulista, 456 - Bela Vista",
      phone: "(11) 98888-5678",
      scheduledDay: "monday",
      status: "in-progress",
      estimatedDuration: 60,
      startTime: new Date(2025, 8, 10, 10, 0)
    },
    {
      id: 3,
      name: "João Oliveira",
      address: "Rua Augusta, 789 - Consolação",
      phone: "(11) 97777-9012",
      scheduledDay: "monday",
      status: "pending",
      estimatedDuration: 50
    },
    {
      id: 4,
      name: "Ana Costa",
      address: "Rua Oscar Freire, 321 - Jardins",
      phone: "(11) 96666-3456",
      scheduledDay: "tuesday",
      status: "pending",
      estimatedDuration: 40
    },
    {
      id: 5,
      name: "Pedro Almeida",
      address: "Rua Haddock Lobo, 654 - Cerqueira César",
      phone: "(11) 95555-7890",
      scheduledDay: "tuesday",
      status: "completed",
      estimatedDuration: 55,
      startTime: new Date(2025, 8, 9, 14, 0),
      endTime: new Date(2025, 8, 9, 14, 55),
      servicesSummary: "Aspiração, escovação e tratamento químico"
    },
    {
      id: 6,
      name: "Lucia Ferreira",
      address: "Alameda Santos, 987 - Jardim Paulista",
      phone: "(11) 94444-2468",
      scheduledDay: "wednesday",
      status: "pending",
      estimatedDuration: 35
    },
    {
      id: 7,
      name: "Roberto Lima",
      address: "Rua Consolação, 147 - Centro",
      phone: "(11) 93333-1357",
      scheduledDay: "wednesday",
      status: "completed",
      estimatedDuration: 45,
      startTime: new Date(2025, 8, 8, 9, 0),
      endTime: new Date(2025, 8, 8, 9, 45),
      servicesSummary: "Manutenção preventiva completa"
    },
    {
      id: 8,
      name: "Fernanda Rocha",
      address: "Rua Bela Cintra, 258 - Consolação",
      phone: "(11) 92222-4680",
      scheduledDay: "thursday",
      status: "pending",
      estimatedDuration: 50
    },
    {
      id: 9,
      name: "Marcos Souza",
      address: "Av. Rebouças, 369 - Pinheiros",
      phone: "(11) 91111-5791",
      scheduledDay: "friday",
      status: "pending",
      estimatedDuration: 40
    },
    {
      id: 10,
      name: "Carla Mendes",
      address: "Rua Estados Unidos, 741 - Jardim América",
      phone: "(11) 90000-6802",
      scheduledDay: "saturday",
      status: "pending",
      estimatedDuration: 60
    }
  ];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Set initial selected day to current day
  useEffect(() => {
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
    setSelectedDay(currentDay);
  }, []);

  const handleCheckIn = (client) => {
    // Navigate to service visit workflow with client data
    navigate('/service-visit-workflow', { 
      state: { 
        clientId: client?.id,
        clientName: client?.name,
        clientAddress: client?.address,
        visitStatus: client?.status
      }
    });
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const filteredClients = mockClients?.filter(client => {
    const statusMatch = selectedStatus === 'all' || client?.status === selectedStatus;
    return statusMatch;
  });

  const formatCurrentTime = () => {
    return currentTime?.toLocaleString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Icon name="Waves" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Meu Piscineiro
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Dashboard de Controle
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrentTime()?.split(',')?.[0]}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrentTime()?.split(',')?.slice(1)?.join(',')?.trim()}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
                iconPosition="left"
                iconSize={16}
                onClick={() => navigate('/settings')}
              >
                <span className="hidden sm:inline">Configurações</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta! 👋
          </h2>
          <p className="text-gray-600">
            Aqui está um resumo das suas atividades de hoje e da semana.
          </p>
        </div>

        {/* Metrics Cards */}
        <DashboardMetrics clients={mockClients} />

        {/* Filter Toolbar */}
        <FilterToolbar
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          clients={filteredClients}
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Weekly Calendar - Takes up 3 columns on xl screens */}
          <div className="xl:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Agenda Semanal
              </h3>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={20} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  Semana de {new Date()?.toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit' 
                  })}
                </span>
              </div>
            </div>
            
            <WeeklyCalendar
              clients={filteredClients}
              onCheckIn={handleCheckIn}
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
            />
          </div>

          {/* Quick Actions Sidebar - Takes up 1 column on xl screens */}
          <div className="xl:col-span-1">
            <QuickActions onNavigate={handleNavigation} />
            
            {/* Today's Summary */}
            <div className="mt-6 bg-white rounded-lg shadow-elevation-1 p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Resumo de Hoje
                </h3>
                <Icon name="BarChart3" size={20} className="text-gray-400" />
              </div>
              
              <div className="space-y-3">
                {mockClients?.filter(client => {
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
                    return client?.scheduledDay === currentDay;
                  })?.slice(0, 3)?.map((client) => (
                    <div key={client?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {client?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {client?.status === 'completed' ? 'Concluída' : 
                           client?.status === 'in-progress' ? 'Em andamento' : 'Pendente'}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        client?.status === 'completed' ? 'bg-green-400' :
                        client?.status === 'in-progress' ? 'bg-blue-400' : 'bg-gray-400'
                      }`} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;