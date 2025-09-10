import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductModal = ({ isOpen, onClose, onSave, product = null, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    currentStock: '',
    minStock: '',
    costPerUnit: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Químicos para pH',
    'Cloro e Sanitizantes',
    'Algicidas',
    'Clarificantes',
    'Equipamentos',
    'Acessórios',
    'Outros'
  ];

  const units = [
    'Litros',
    'Quilogramas',
    'Gramas',
    'Unidades',
    'Pacotes',
    'Caixas'
  ];

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product?.name || '',
        description: product?.description || '',
        category: product?.category || '',
        unit: product?.unit || '',
        currentStock: product?.currentStock?.toString() || '',
        minStock: product?.minStock?.toString() || '',
        costPerUnit: product?.costPerUnit?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        unit: '',
        currentStock: '',
        minStock: '',
        costPerUnit: ''
      });
    }
    setErrors({});
  }, [product, mode, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }

    if (!formData?.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData?.unit) {
      newErrors.unit = 'Unidade de medida é obrigatória';
    }

    if (!formData?.currentStock || parseFloat(formData?.currentStock) < 0) {
      newErrors.currentStock = 'Estoque atual deve ser um número válido';
    }

    if (!formData?.minStock || parseFloat(formData?.minStock) < 0) {
      newErrors.minStock = 'Estoque mínimo deve ser um número válido';
    }

    if (formData?.costPerUnit && parseFloat(formData?.costPerUnit) < 0) {
      newErrors.costPerUnit = 'Custo deve ser um número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const productData = {
        ...formData,
        currentStock: parseFloat(formData?.currentStock),
        minStock: parseFloat(formData?.minStock),
        costPerUnit: formData?.costPerUnit ? parseFloat(formData?.costPerUnit) : 0,
        id: product?.id || Date.now(),
        usageThisMonth: product?.usageThisMonth || 0,
        createdAt: product?.createdAt || new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      await onSave(productData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const numericValue = value?.replace(/\D/g, '');
    const formattedValue = (parseFloat(numericValue) / 100)?.toFixed(2);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(formattedValue);
  };

  const handleCurrencyChange = (value) => {
    const numericValue = value?.replace(/\D/g, '');
    const formattedValue = (parseFloat(numericValue) / 100)?.toFixed(2);
    handleInputChange('costPerUnit', formattedValue);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            {mode === 'edit' ? 'Editar Produto' : 'Adicionar Produto'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Nome do Produto"
                type="text"
                placeholder="Ex: Cloro Granulado HTH"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Descrição"
                type="text"
                placeholder="Descrição detalhada do produto"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                error={errors?.description}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Categoria <span className="text-error">*</span>
              </label>
              <select
                value={formData?.category}
                onChange={(e) => handleInputChange('category', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors?.category && (
                <p className="mt-1 text-sm text-error">{errors?.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Unidade de Medida <span className="text-error">*</span>
              </label>
              <select
                value={formData?.unit}
                onChange={(e) => handleInputChange('unit', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Selecione uma unidade</option>
                {units?.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors?.unit && (
                <p className="mt-1 text-sm text-error">{errors?.unit}</p>
              )}
            </div>

            <div>
              <Input
                label="Estoque Atual"
                type="number"
                placeholder="0"
                value={formData?.currentStock}
                onChange={(e) => handleInputChange('currentStock', e?.target?.value)}
                error={errors?.currentStock}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Input
                label="Estoque Mínimo"
                type="number"
                placeholder="0"
                value={formData?.minStock}
                onChange={(e) => handleInputChange('minStock', e?.target?.value)}
                error={errors?.minStock}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Custo por Unidade (Opcional)"
                type="number"
                placeholder="0,00"
                value={formData?.costPerUnit}
                onChange={(e) => handleInputChange('costPerUnit', e?.target?.value)}
                error={errors?.costPerUnit}
                min="0"
                step="0.01"
                description="Valor em reais (R$)"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              {mode === 'edit' ? 'Salvar Alterações' : 'Adicionar Produto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;