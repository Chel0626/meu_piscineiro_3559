import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductTable = ({ products, onEdit, onDelete, onViewUsage }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getStockLevelColor = (stock, minStock) => {
    if (stock <= minStock) return 'text-error bg-red-50';
    if (stock <= minStock * 2) return 'text-warning bg-yellow-50';
    return 'text-success bg-green-50';
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })?.format(number);
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="font-semibold text-text-primary hover:bg-transparent p-0"
                >
                  Nome do Produto
                  <Icon 
                    name={sortField === 'name' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="ml-1"
                  />
                </Button>
              </th>
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('category')}
                  className="font-semibold text-text-primary hover:bg-transparent p-0"
                >
                  Categoria
                  <Icon 
                    name={sortField === 'category' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="ml-1"
                  />
                </Button>
              </th>
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('unit')}
                  className="font-semibold text-text-primary hover:bg-transparent p-0"
                >
                  Unidade
                  <Icon 
                    name={sortField === 'unit' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="ml-1"
                  />
                </Button>
              </th>
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('currentStock')}
                  className="font-semibold text-text-primary hover:bg-transparent p-0"
                >
                  Estoque Atual
                  <Icon 
                    name={sortField === 'currentStock' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="ml-1"
                  />
                </Button>
              </th>
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('usageThisMonth')}
                  className="font-semibold text-text-primary hover:bg-transparent p-0"
                >
                  Uso Mensal
                  <Icon 
                    name={sortField === 'usageThisMonth' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="ml-1"
                  />
                </Button>
              </th>
              <th className="px-6 py-4 text-center font-semibold text-text-primary">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedProducts?.map((product) => (
              <tr key={product?.id} className="hover:bg-muted/50 transition-smooth">
                <td className="px-6 py-4">
                  <div className="font-medium text-text-primary">{product?.name}</div>
                  <div className="text-sm text-text-secondary">{product?.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {product?.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-secondary">{product?.unit}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStockLevelColor(product?.currentStock, product?.minStock)}`}>
                    {formatNumber(product?.currentStock)}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-secondary">
                  {formatNumber(product?.usageThisMonth)} {product?.unit}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewUsage(product)}
                      iconName="BarChart3"
                      iconSize={16}
                      className="text-text-secondary hover:text-primary"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                      iconName="Edit"
                      iconSize={16}
                      className="text-text-secondary hover:text-primary"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product)}
                      iconName="Trash2"
                      iconSize={16}
                      className="text-text-secondary hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {sortedProducts?.map((product) => (
          <div key={product?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-text-primary">{product?.name}</h3>
                <p className="text-sm text-text-secondary mt-1">{product?.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                    {product?.category}
                  </span>
                  <span className="text-xs text-text-secondary">{product?.unit}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewUsage(product)}
                  iconName="BarChart3"
                  iconSize={16}
                  className="text-text-secondary hover:text-primary"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(product)}
                  iconName="Edit"
                  iconSize={16}
                  className="text-text-secondary hover:text-primary"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(product)}
                  iconName="Trash2"
                  iconSize={16}
                  className="text-text-secondary hover:text-error"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Estoque:</span>
                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStockLevelColor(product?.currentStock, product?.minStock)}`}>
                  {formatNumber(product?.currentStock)}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Uso Mensal:</span>
                <span className="ml-2 text-text-primary">
                  {formatNumber(product?.usageThisMonth)} {product?.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;