import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterControls = ({ onFiltersChange, totalVisits }) => {
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all',
    parameter: 'all',
    product: 'all',
    technician: 'all',
    searchTerm: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const dateRangeOptions = [
    { value: 'all', label: 'Todas as datas' },
    { value: 'last7days', label: 'Últimos 7 dias' },
    { value: 'last30days', label: 'Últimos 30 dias' },
    { value: 'last3months', label: 'Últimos 3 meses' },
    { value: 'last6months', label: 'Últimos 6 meses' },
    { value: 'lastyear', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Em Andamento', label: 'Em Andamento' },
    { value: 'Pendente', label: 'Pendente' }
  ];

  const parameterOptions = [
    { value: 'all', label: 'Todos os parâmetros' },
    { value: 'ph', label: 'pH' },
    { value: 'chlorine', label: 'Cloro Livre' },
    { value: 'alkalinity', label: 'Alcalinidade' },
    { value: 'calcium', label: 'Dureza Cálcica' },
    { value: 'cyanuric', label: 'Ácido Cianúrico' }
  ];

  const productOptions = [
    { value: 'all', label: 'Todos os produtos' },
    { value: 'Cloro Granulado', label: 'Cloro Granulado' },
    { value: 'Barrilha', label: 'Barrilha' },
    { value: 'Ácido Muriático', label: 'Ácido Muriático' },
    { value: 'Algicida', label: 'Algicida' },
    { value: 'Clarificante', label: 'Clarificante' }
  ];

  const technicianOptions = [
    { value: 'all', label: 'Todos os técnicos' },
    { value: 'João Silva', label: 'João Silva' },
    { value: 'Maria Santos', label: 'Maria Santos' },
    { value: 'Pedro Oliveira', label: 'Pedro Oliveira' },
    { value: 'Ana Costa', label: 'Ana Costa' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      dateRange: 'all',
      status: 'all',
      parameter: 'all',
      product: 'all',
      technician: 'all',
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value !== 'all' && value !== ''
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="Filter" size={20} className="mr-2" />
            Filtros de Busca
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {totalVisits} visita{totalVisits !== 1 ? 's' : ''} encontrada{totalVisits !== 1 ? 's' : ''}
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                iconName="X"
                iconPosition="left"
              >
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Buscar por observações, produtos ou técnico..."
            value={filters?.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select
            label="Período"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
          
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
          
          <Select
            label="Técnico"
            options={technicianOptions}
            value={filters?.technician}
            onChange={(value) => handleFilterChange('technician', value)}
          />
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Filtros Avançados
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <Select
              label="Parâmetro Específico"
              options={parameterOptions}
              value={filters?.parameter}
              onChange={(value) => handleFilterChange('parameter', value)}
            />
            
            <Select
              label="Produto Aplicado"
              options={productOptions}
              value={filters?.product}
              onChange={(value) => handleFilterChange('product', value)}
            />
          </div>
        )}

        {/* Custom Date Range */}
        {filters?.dateRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            <Input
              type="date"
              label="Data Inicial"
              onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
            />
            <Input
              type="date"
              label="Data Final"
              onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('dateRange', 'last30days')}
            iconName="Calendar"
            iconPosition="left"
          >
            Último Mês
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('status', 'Concluído')}
            iconName="CheckCircle"
            iconPosition="left"
          >
            Apenas Concluídas
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Exportar Filtrados
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;