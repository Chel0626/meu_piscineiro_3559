import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClientTable = ({ 
  clients, 
  onEdit, 
  onDelete, 
  onViewHistory, 
  searchTerm, 
  sortConfig, 
  onSort 
}) => {
  const [selectedClients, setSelectedClients] = useState([]);

  const sortedClients = useMemo(() => {
    if (!sortConfig?.key) return clients;

    return [...clients]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [clients, sortConfig]);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return sortedClients;
    
    return sortedClients?.filter(client =>
      client?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      client?.address?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      client?.phone?.includes(searchTerm) ||
      client?.visitDay?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  }, [sortedClients, searchTerm]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClients(filteredClients?.map(client => client?.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId, checked) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev?.filter(id => id !== clientId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Ativo': { color: 'bg-green-100 text-green-800', icon: 'CheckCircle' },
      'Inativo': { color: 'bg-gray-100 text-gray-800', icon: 'XCircle' },
      'Pendente': { color: 'bg-yellow-100 text-yellow-800', icon: 'Clock' }
    };

    const config = statusConfig?.[status] || statusConfig?.['Pendente'];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return <Icon name="ArrowUpDown" size={16} className="text-gray-400" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-primary" />
      : <Icon name="ArrowDown" size={16} className="text-primary" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-elevation-1 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedClients?.length === filteredClients?.length && filteredClients?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Nome</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('address')}
              >
                <div className="flex items-center space-x-1">
                  <span>Endereço</span>
                  {getSortIcon('address')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('phone')}
              >
                <div className="flex items-center space-x-1">
                  <span>Telefone</span>
                  {getSortIcon('phone')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('visitDay')}
              >
                <div className="flex items-center space-x-1">
                  <span>Dia da Visita</span>
                  {getSortIcon('visitDay')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients?.map((client) => (
              <tr key={client?.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedClients?.includes(client?.id)}
                    onChange={(e) => handleSelectClient(client?.id, e?.target?.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                      {client?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{client?.name}</div>
                      <div className="text-sm text-gray-500">Cliente desde {client?.createdAt}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{client?.address}</div>
                  <div className="text-sm text-gray-500">{client?.city}, {client?.state}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client?.phone}</div>
                  {client?.email && (
                    <div className="text-sm text-gray-500">{client?.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client?.visitDay}</div>
                  <div className="text-sm text-gray-500">Próxima: {client?.nextVisit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(client?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewHistory(client)}
                      iconName="History"
                      iconSize={16}
                      className="text-gray-600 hover:text-primary"
                    >
                      Histórico
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(client)}
                      iconName="Edit"
                      iconSize={16}
                      className="text-gray-600 hover:text-primary"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(client?.id)}
                      iconName="Trash2"
                      iconSize={16}
                      className="text-gray-600 hover:text-red-600"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden">
        {filteredClients?.map((client) => (
          <div key={client?.id} className="border-b border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedClients?.includes(client?.id)}
                  onChange={(e) => handleSelectClient(client?.id, e?.target?.checked)}
                  className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                  {client?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{client?.name}</h3>
                  <p className="text-sm text-gray-500">{client?.address}</p>
                  <p className="text-sm text-gray-500">{client?.phone}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500">{client?.visitDay}</span>
                    {getStatusBadge(client?.status)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewHistory(client)}
                iconName="History"
                iconSize={14}
              >
                Histórico
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(client)}
                iconName="Edit"
                iconSize={14}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(client?.id)}
                iconName="Trash2"
                iconSize={14}
                className="text-red-600 border-red-200 hover:bg-red-50"
              />
            </div>
          </div>
        ))}
      </div>
      {filteredClients?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando seu primeiro cliente.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientTable;