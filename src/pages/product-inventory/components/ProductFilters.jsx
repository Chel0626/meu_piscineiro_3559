import React from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  stockFilter, 
  onStockFilterChange,
  products 
}) => {
  const categories = [
    'Todos',
    'Químicos para pH',
    'Cloro e Sanitizantes',
    'Algicidas',
    'Clarificantes',
    'Equipamentos',
    'Acessórios',
    'Outros'
  ];

  const stockFilters = [
    { value: 'all', label: 'Todos os Estoques', icon: 'Package' },
    { value: 'low', label: 'Estoque Baixo', icon: 'AlertTriangle' },
    { value: 'normal', label: 'Estoque Normal', icon: 'CheckCircle' },
    { value: 'high', label: 'Estoque Alto', icon: 'TrendingUp' }
  ];

  const getCategoryCount = (category) => {
    if (category === 'Todos') return products?.length;
    return products?.filter(product => product?.category === category)?.length;
  };

  const getStockFilterCount = (filter) => {
    switch (filter) {
      case 'all':
        return products?.length;
      case 'low':
        return products?.filter(product => product?.currentStock <= product?.minStock)?.length;
      case 'normal':
        return products?.filter(product => 
          product?.currentStock > product?.minStock && 
          product?.currentStock <= product?.minStock * 2
        )?.length;
      case 'high':
        return products?.filter(product => product?.currentStock > product?.minStock * 2)?.length;
      default:
        return 0;
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('Todos');
    onStockFilterChange('all');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'Todos' || stockFilter !== 'all';

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={16}
            className="text-text-secondary hover:text-text-primary"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {/* Search */}
        <div>
          <Input
            type="search"
            placeholder="Buscar produtos por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Categoria</h4>
          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => {
              const count = getCategoryCount(category);
              const isActive = selectedCategory === category;
              
              return (
                <Button
                  key={category}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className="flex items-center space-x-2"
                >
                  <span>{category}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' :'bg-muted text-text-secondary'
                  }`}>
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Stock Level Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Nível de Estoque</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stockFilters?.map((filter) => {
              const count = getStockFilterCount(filter?.value);
              const isActive = stockFilter === filter?.value;
              
              return (
                <Button
                  key={filter?.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStockFilterChange(filter?.value)}
                  iconName={filter?.icon}
                  iconPosition="left"
                  iconSize={16}
                  className="justify-start"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm">{filter?.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ml-2 ${
                      isActive 
                        ? 'bg-white/20 text-white' :'bg-muted text-text-secondary'
                    }`}>
                      {count}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-2xl font-bold text-text-primary">{products?.length}</div>
              <div className="text-sm text-text-secondary">Total de Produtos</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-error">{getStockFilterCount('low')}</div>
              <div className="text-sm text-text-secondary">Estoque Baixo</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-success">{getStockFilterCount('normal')}</div>
              <div className="text-sm text-text-secondary">Estoque Normal</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-primary">{getStockFilterCount('high')}</div>
              <div className="text-sm text-text-secondary">Estoque Alto</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;