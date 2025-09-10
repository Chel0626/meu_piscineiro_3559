import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import ClientTable from './components/ClientTable';
import ClientModal from './components/ClientModal';
import ClientFilters from './components/ClientFilters';
import BulkActions from './components/BulkActions';
import ClientStats from './components/ClientStats';

const ClientManagement = () => {
  const navigate = useNavigate();
  
  // Mock client data
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Carlos Silva Santos",
      address: "Rua das Flores, 123, Jardim Paulista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      phone: "(11) 99999-1234",
      email: "carlos.silva@email.com",
      visitDay: "Segunda-feira",
      status: "Ativo",
      notes: "Piscina com aquecimento solar",
      createdAt: "Jan 2024",
      nextVisit: "15/09/2024"
    },
    {
      id: 2,
      name: "Maria Oliveira Costa",
      address: "Av. Paulista, 456, Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01311-200",
      phone: "(11) 98888-5678",
      email: "maria.costa@email.com",
      visitDay: "Terça-feira",
      status: "Ativo",
      notes: "Preferência por produtos orgânicos",
      createdAt: "Fev 2024",
      nextVisit: "16/09/2024"
    },
    {
      id: 3,
      name: "João Pedro Almeida",
      address: "Rua Augusta, 789, Consolação",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
      phone: "(11) 97777-9012",
      email: "",
      visitDay: "Quarta-feira",
      status: "Pendente",
      notes: "Cliente novo - primeira visita agendada",
      createdAt: "Set 2024",
      nextVisit: "17/09/2024"
    },
    {
      id: 4,
      name: "Ana Beatriz Ferreira",
      address: "Rua Oscar Freire, 321, Jardins",
      city: "São Paulo",
      state: "SP",
      zipCode: "01426-001",
      phone: "(11) 96666-3456",
      email: "ana.ferreira@email.com",
      visitDay: "Quinta-feira",
      status: "Ativo",
      notes: "Piscina infantil adicional",
      createdAt: "Mar 2024",
      nextVisit: "18/09/2024"
    },
    {
      id: 5,
      name: "Roberto Mendes Lima",
      address: "Rua Haddock Lobo, 654, Cerqueira César",
      city: "São Paulo",
      state: "SP",
      zipCode: "01414-001",
      phone: "(11) 95555-7890",
      email: "roberto.lima@email.com",
      visitDay: "Sexta-feira",
      status: "Inativo",
      notes: "Temporariamente sem serviço",
      createdAt: "Dez 2023",
      nextVisit: "19/09/2024"
    },
    {
      id: 6,
      name: "Fernanda Santos Rocha",
      address: "Alameda Santos, 987, Jardim Paulista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01419-001",
      phone: "(11) 94444-2468",
      email: "fernanda.rocha@email.com",
      visitDay: "Sábado",
      status: "Ativo",
      notes: "Piscina com borda infinita",
      createdAt: "Abr 2024",
      nextVisit: "20/09/2024"
    }
  ]);

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitDayFilter, setVisitDayFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [selectedClients, setSelectedClients] = useState([]);

  // Filtered clients
  const filteredClients = useMemo(() => {
    return clients?.filter(client => {
      const matchesSearch = !searchTerm || 
        client?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        client?.address?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        client?.phone?.includes(searchTerm);
      
      const matchesStatus = !statusFilter || client?.status === statusFilter;
      const matchesVisitDay = !visitDayFilter || client?.visitDay === visitDayFilter;
      
      return matchesSearch && matchesStatus && matchesVisitDay;
    });
  }, [clients, searchTerm, statusFilter, visitDayFilter]);

  // Handlers
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddClient = () => {
    setModalMode('create');
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client) => {
    setModalMode('edit');
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      setClients(prev => prev?.filter(client => client?.id !== clientId));
      setSelectedClients(prev => prev?.filter(id => id !== clientId));
    }
  };

  const handleViewHistory = (client) => {
    navigate('/client-service-history', { state: { client } });
  };

  const handleSaveClient = (clientData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (modalMode === 'create') {
          const newClient = {
            ...clientData,
            id: Math.max(...clients.map(c => c.id)) + 1,
            createdAt: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
            nextVisit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
          };
          setClients(prev => [...prev, newClient]);
        } else {
          setClients(prev => prev.map(client => 
            client.id === selectedClient.id 
              ? { ...client, ...clientData }
              : client
          ));
        }
        resolve();
      }, 1000);
    });
  };

  const handleBulkAction = (action, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (action) {
          case 'activate':
            setClients(prev => prev.map(client => 
              data.clientIds.includes(client.id) 
                ? { ...client, status: 'Ativo' }
                : client
            ));
            break;
          case 'deactivate':
            setClients(prev => prev.map(client => 
              data.clientIds.includes(client.id) 
                ? { ...client, status: 'Inativo' }
                : client
            ));
            break;
          case 'change-day':
            setClients(prev => prev.map(client => 
              data.clientIds.includes(client.id) 
                ? { ...client, visitDay: data.newVisitDay }
                : client
            ));
            break;
          case 'delete':
            if (window.confirm(`Tem certeza que deseja excluir ${data.clientIds.length} cliente(s)? Esta ação não pode ser desfeita.`)) {
              setClients(prev => prev.filter(client => !data.clientIds.includes(client.id)));
            }
            break;
          case 'export':
            // Mock export functionality
            console.log('Exporting clients:', data.clientIds);
            break;
        }
        resolve();
      }, 1000);
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setVisitDayFilter('');
  };

  const handleClearSelection = () => {
    setSelectedClients([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Clientes</h1>
              <p className="mt-2 text-gray-600">
                Gerencie informações dos clientes, horários de visita e histórico de serviços
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={handleAddClient}
                iconName="Plus"
                iconPosition="left"
                size="lg"
              >
                Adicionar Cliente
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <ClientStats clients={clients} />

        {/* Filters */}
        <ClientFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          visitDayFilter={visitDayFilter}
          onVisitDayFilterChange={setVisitDayFilter}
          onClearFilters={handleClearFilters}
          totalClients={clients?.length}
          filteredCount={filteredClients?.length}
        />

        {/* Bulk Actions */}
        <BulkActions
          selectedClients={selectedClients}
          onBulkAction={handleBulkAction}
          onClearSelection={handleClearSelection}
        />

        {/* Client Table */}
        <ClientTable
          clients={filteredClients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          onViewHistory={handleViewHistory}
          searchTerm={searchTerm}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {/* Client Modal */}
        <ClientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveClient}
          client={selectedClient}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default ClientManagement;