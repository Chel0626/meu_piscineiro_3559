import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ServiceVisitCard from './components/ServiceVisitCard';
import ServiceSummaryPanel from './components/ServiceSummaryPanel';
import FilterControls from './components/FilterControls';
import ServiceDetailModal from './components/ServiceDetailModal';

const ClientServiceHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock client data - in real app this would come from route params or API
  const mockClient = {
    id: 1,
    name: "Maria Silva",
    address: "Rua das Flores, 123 - Jardim Primavera, São Paulo - SP",
    phone: "(11) 99999-8888",
    scheduledDay: "Terça-feira",
    email: "maria.silva@email.com",
    poolType: "Residencial",
    poolSize: "8m x 4m"
  };

  // Mock visits data
  const mockVisits = [
    {
      id: 1,
      date: "2024-01-09",
      startTime: "2024-01-09T09:00:00",
      endTime: "2024-01-09T10:30:00",
      duration: 90,
      status: "Concluído",
      technician: "João Silva",
      waterParameters: {
        ph: "7.2",
        chlorine: "2.5",
        alkalinity: "95",
        calcium: "280",
        cyanuric: "35"
      },
      productsUsed: [
        { name: "Cloro Granulado", quantity: "200", unit: "g", purpose: "Desinfecção" },
        { name: "Barrilha", quantity: "150", unit: "g", purpose: "Correção pH" }
      ],
      notes: `Piscina em bom estado geral. Realizada limpeza completa do fundo e paredes.\nAplicados produtos para correção dos parâmetros da água.\nCliente orientado sobre manutenção preventiva.`,
      recommendations: [
        {
          description: "Recomendo instalação de sistema de aquecimento solar para melhor aproveitamento da piscina no inverno",
          status: "Pendente",
          priority: "Baixa"
        }
      ]
    },
    {
      id: 2,
      date: "2024-01-02",
      startTime: "2024-01-02T14:00:00",
      endTime: "2024-01-02T15:15:00",
      duration: 75,
      status: "Concluído",
      technician: "Maria Santos",
      waterParameters: {
        ph: "6.8",
        chlorine: "1.2",
        alkalinity: "85",
        calcium: "320",
        cyanuric: "42"
      },
      productsUsed: [
        { name: "Cloro Granulado", quantity: "300", unit: "g", purpose: "Desinfecção" },
        { name: "Elevador de pH", quantity: "100", unit: "ml", purpose: "Correção pH" },
        { name: "Algicida", quantity: "50", unit: "ml", purpose: "Prevenção algas" }
      ],
      notes: `Água com pH baixo, necessária correção.\nPresença de pequenas algas nas bordas, aplicado algicida preventivo.\nOrientações passadas ao cliente sobre frequência de uso dos produtos.`,
      recommendations: [
        {
          description: "Substituir filtro da bomba - está com sinais de desgaste",
          status: "Aprovado",
          priority: "Média"
        },
        {
          description: "Considerar instalação de sistema de dosagem automática de cloro",
          status: "Pendente",
          priority: "Baixa"
        }
      ]
    },
    {
      id: 3,
      date: "2023-12-26",
      startTime: "2023-12-26T08:30:00",
      endTime: "2023-12-26T10:00:00",
      duration: 90,
      status: "Concluído",
      technician: "Pedro Oliveira",
      waterParameters: {
        ph: "7.4",
        chlorine: "2.8",
        alkalinity: "110",
        calcium: "250",
        cyanuric: "38"
      },
      productsUsed: [
        { name: "Cloro Granulado", quantity: "150", unit: "g", purpose: "Manutenção" },
        { name: "Clarificante", quantity: "30", unit: "ml", purpose: "Clarificação" }
      ],
      notes: `Manutenção de rotina realizada com sucesso.\nÁgua cristalina, todos os parâmetros dentro do ideal.\nLimpeza do skimmer e cesto da bomba.`,
      recommendations: []
    },
    {
      id: 4,
      date: "2023-12-19",
      startTime: "2023-12-19T15:30:00",
      endTime: "2023-12-19T17:00:00",
      duration: 90,
      status: "Concluído",
      technician: "Ana Costa",
      waterParameters: {
        ph: "7.6",
        chlorine: "3.2",
        alkalinity: "125",
        calcium: "290",
        cyanuric: "45"
      },
      productsUsed: [
        { name: "Ácido Muriático", quantity: "20", unit: "ml", purpose: "Correção pH" },
        { name: "Cloro Granulado", quantity: "100", unit: "g", purpose: "Manutenção" }
      ],
      notes: `pH ligeiramente alto, aplicado ácido para correção.\nRealizada escovação completa das paredes e fundo.\nSistema de filtração funcionando perfeitamente.`,
      recommendations: [
        {
          description: "Verificar calibração do sistema de dosagem automática",
          status: "Concluído",
          priority: "Alta"
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setSelectedClient(mockClient);
      setVisits(mockVisits);
      setFilteredVisits(mockVisits);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFiltersChange = (filters) => {
    let filtered = [...visits];

    // Apply search filter
    if (filters?.searchTerm) {
      const searchTerm = filters?.searchTerm?.toLowerCase();
      filtered = filtered?.filter(visit =>
        visit?.notes?.toLowerCase()?.includes(searchTerm) ||
        visit?.technician?.toLowerCase()?.includes(searchTerm) ||
        visit?.productsUsed?.some(product => 
          product?.name?.toLowerCase()?.includes(searchTerm)
        )
      );
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(visit => visit?.status === filters?.status);
    }

    // Apply technician filter
    if (filters?.technician !== 'all') {
      filtered = filtered?.filter(visit => visit?.technician === filters?.technician);
    }

    // Apply date range filter
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      let startDate;

      switch (filters?.dateRange) {
        case 'last7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last3months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'last6months':
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case 'lastyear':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered?.filter(visit => new Date(visit.date) >= startDate);
      }
    }

    // Apply parameter filter
    if (filters?.parameter !== 'all') {
      // This could filter visits that have specific parameter readings
      // For now, we'll keep all visits as they all have parameter readings
    }

    // Apply product filter
    if (filters?.product !== 'all') {
      filtered = filtered?.filter(visit =>
        visit?.productsUsed?.some(product => product?.name === filters?.product)
      );
    }

    setFilteredVisits(filtered);
  };

  const handleViewDetails = (visit) => {
    setSelectedVisit(visit);
    setIsDetailModalOpen(true);
  };

  const handleBackToClients = () => {
    navigate('/client-management');
  };

  const handleExportAll = () => {
    // Mock export functionality
    const exportData = {
      client: selectedClient,
      visits: filteredVisits,
      exportDate: new Date()?.toISOString(),
      totalVisits: filteredVisits?.length
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico-${selectedClient?.name}-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando histórico de serviços...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Histórico de Serviços
            </h1>
            <p className="text-gray-600">
              Visualize todo o histórico de manutenções e serviços realizados
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleBackToClients}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Voltar aos Clientes
            </Button>
            <Button
              variant="default"
              onClick={handleExportAll}
              iconName="Download"
              iconPosition="left"
            >
              Exportar Histórico
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Summary Panel */}
          <div className="lg:col-span-1">
            {selectedClient && (
              <ServiceSummaryPanel 
                client={selectedClient} 
                visits={filteredVisits} 
              />
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <FilterControls 
              onFiltersChange={handleFiltersChange}
              totalVisits={filteredVisits?.length}
            />

            {/* Visits List */}
            <div className="space-y-4">
              {filteredVisits?.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Icon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma visita encontrada
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Não foram encontradas visitas com os filtros aplicados.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFiltersChange({
                      dateRange: 'all',
                      status: 'all',
                      parameter: 'all',
                      product: 'all',
                      technician: 'all',
                      searchTerm: ''
                    })}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Visitas Realizadas ({filteredVisits?.length})
                    </h2>
                    <div className="text-sm text-gray-500">
                      Ordenado por data (mais recente primeiro)
                    </div>
                  </div>
                  
                  {filteredVisits?.map((visit) => (
                    <ServiceVisitCard
                      key={visit?.id}
                      visit={visit}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Detail Modal */}
      <ServiceDetailModal
        visit={selectedVisit}
        client={selectedClient}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

export default ClientServiceHistory;