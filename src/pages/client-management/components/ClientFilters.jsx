import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ClientFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  visitDayFilter,
  onVisitDayFilterChange,
  onClearFilters,
  totalClients,
  filteredCount
}) => {
  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
    { value: 'Pendente', label: 'Pendente' }
  ];

  const visitDayOptions = [
    { value: '', label: 'Todos os Dias' },
    { value: 'Segunda-feira', label: 'Segunda-feira' },
    { value: 'Terça-feira', label: 'Terça-feira' },
    { value: 'Quarta-feira', label: 'Quarta-feira' },
    { value: 'Quinta-feira', label: 'Quinta-feira' },
    { value: 'Sexta-feira', label: 'Sexta-feira' },
    { value: 'Sábado', label: 'Sábado' }
  ];

  const hasActiveFilters = searchTerm || statusFilter || visitDayFilter;

  return (
    <div className="bg-white rounded-lg shadow-elevation-1 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <Input
                type="text"
                placeholder="Buscar por nome, endereço ou telefone..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e?.target?.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
              placeholder="Filtrar por status"
              className="min-w-[160px]"
            />

            <Select
              options={visitDayOptions}
              value={visitDayFilter}
              onChange={onVisitDayFilterChange}
              placeholder="Filtrar por dia"
              className="min-w-[160px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              Limpar Filtros
            </Button>
          )}

          <div className="text-sm text-gray-600 whitespace-nowrap">
            {filteredCount !== totalClients ? (
              <span>
                Mostrando <span className="font-medium">{filteredCount}</span> de{' '}
                <span className="font-medium">{totalClients}</span> clientes
              </span>
            ) : (
              <span>
                <span className="font-medium">{totalClients}</span> cliente{totalClients !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Filtros ativos:</span>
            
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Icon name="Search" size={12} className="mr-1" />
                Busca: "{searchTerm}"
              </span>
            )}
            
            {statusFilter && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Icon name="Filter" size={12} className="mr-1" />
                Status: {statusFilter}
              </span>
            )}
            
            {visitDayFilter && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Icon name="Calendar" size={12} className="mr-1" />
                Dia: {visitDayFilter}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientFilters;