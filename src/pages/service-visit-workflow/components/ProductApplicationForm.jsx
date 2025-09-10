import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ProductApplicationForm = ({ onSubmit, initialData = [] }) => {
  const [applications, setApplications] = useState(initialData?.length > 0 ? initialData : []);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Mock product inventory
  const availableProducts = [
    { value: 'cloro-granulado', label: 'Cloro Granulado', unit: 'kg', category: 'Sanitizante' },
    { value: 'cloro-liquido', label: 'Cloro Líquido', unit: 'L', category: 'Sanitizante' },
    { value: 'ph-mais', label: 'pH+ (Elevador)', unit: 'kg', category: 'Corretor pH' },
    { value: 'ph-menos', label: 'pH- (Redutor)', unit: 'kg', category: 'Corretor pH' },
    { value: 'alcalinizante', label: 'Alcalinizante', unit: 'kg', category: 'Corretor' },
    { value: 'clarificante', label: 'Clarificante', unit: 'L', category: 'Tratamento' },
    { value: 'algicida', label: 'Algicida', unit: 'L', category: 'Tratamento' },
    { value: 'floculante', label: 'Floculante', unit: 'kg', category: 'Tratamento' },
    { value: 'estabilizante', label: 'Estabilizante (Ácido Cianúrico)', unit: 'kg', category: 'Corretor' }
  ];

  const [newApplication, setNewApplication] = useState({
    productId: '',
    quantity: '',
    reason: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validateApplication = (application) => {
    const newErrors = {};
    
    if (!application?.productId) newErrors.productId = 'Selecione um produto';
    if (!application?.quantity || parseFloat(application?.quantity) <= 0) {
      newErrors.quantity = 'Quantidade deve ser maior que zero';
    }
    if (!application?.reason?.trim()) newErrors.reason = 'Informe o motivo da aplicação';
    
    return newErrors;
  };

  const handleAddProduct = () => {
    const validationErrors = validateApplication(newApplication);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors)?.length === 0) {
      const product = availableProducts?.find(p => p?.value === newApplication?.productId);
      const application = {
        id: Date.now(),
        product: product,
        quantity: parseFloat(newApplication?.quantity),
        reason: newApplication?.reason,
        notes: newApplication?.notes,
        timestamp: new Date()?.toISOString(),
        technician: 'João Silva'
      };
      
      setApplications(prev => [...prev, application]);
      setNewApplication({ productId: '', quantity: '', reason: '', notes: '' });
      setIsAddingProduct(false);
      setErrors({});
    }
  };

  const handleRemoveApplication = (id) => {
    setApplications(prev => prev?.filter(app => app?.id !== id));
  };

  const handleSubmit = () => {
    if (applications?.length === 0) {
      alert('Adicione pelo menos um produto aplicado');
      return;
    }
    
    onSubmit(applications);
  };

  const getTotalQuantityByCategory = () => {
    const totals = {};
    applications?.forEach(app => {
      const category = app?.product?.category;
      if (!totals?.[category]) totals[category] = [];
      totals?.[category]?.push(`${app?.quantity}${app?.product?.unit} ${app?.product?.label}`);
    });
    return totals;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Package" size={24} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Aplicação de Produtos</h3>
            <p className="text-sm text-text-secondary">Registre os produtos utilizados na piscina</p>
          </div>
        </div>
        
        {!isAddingProduct && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingProduct(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Adicionar Produto
          </Button>
        )}
      </div>
      {/* Applied Products List */}
      {applications?.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-text-primary mb-3">Produtos Aplicados</h4>
          <div className="space-y-3">
            {applications?.map((app) => (
              <div key={app?.id} className="bg-muted rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Package" size={16} className="text-primary" />
                      <span className="font-medium text-text-primary">{app?.product?.label}</span>
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {app?.product?.category}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-text-secondary">Quantidade:</span>
                        <span className="ml-2 font-medium text-text-primary">
                          {app?.quantity}{app?.product?.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-secondary">Motivo:</span>
                        <span className="ml-2 text-text-primary">{app?.reason}</span>
                      </div>
                    </div>
                    {app?.notes && (
                      <div className="mt-2 text-sm">
                        <span className="text-text-secondary">Observações:</span>
                        <p className="mt-1 text-text-primary">{app?.notes}</p>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveApplication(app?.id)}
                    iconName="Trash2"
                    className="text-destructive hover:text-destructive"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Add Product Form */}
      {isAddingProduct && (
        <div className="bg-muted rounded-lg p-4 mb-6">
          <h4 className="font-medium text-text-primary mb-4">Adicionar Produto</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Produto"
                placeholder="Selecione o produto"
                options={availableProducts}
                value={newApplication?.productId}
                onChange={(value) => setNewApplication(prev => ({ ...prev, productId: value }))}
                error={errors?.productId}
                searchable
              />
              
              <Input
                label="Quantidade"
                type="number"
                placeholder="0.0"
                value={newApplication?.quantity}
                onChange={(e) => setNewApplication(prev => ({ ...prev, quantity: e?.target?.value }))}
                error={errors?.quantity}
                min="0"
                step="0.1"
                description={newApplication?.productId ? 
                  `Unidade: ${availableProducts?.find(p => p?.value === newApplication?.productId)?.unit}` : 
                  'Selecione um produto primeiro'
                }
              />
            </div>
            
            <Input
              label="Motivo da Aplicação"
              type="text"
              placeholder="Ex: Correção de pH, Sanitização, Clarificação..."
              value={newApplication?.reason}
              onChange={(e) => setNewApplication(prev => ({ ...prev, reason: e?.target?.value }))}
              error={errors?.reason}
              required
            />
            
            <Input
              label="Observações (Opcional)"
              type="text"
              placeholder="Informações adicionais sobre a aplicação..."
              value={newApplication?.notes}
              onChange={(e) => setNewApplication(prev => ({ ...prev, notes: e?.target?.value }))}
            />
            
            <div className="flex space-x-3">
              <Button
                variant="default"
                onClick={handleAddProduct}
                iconName="Check"
                iconPosition="left"
              >
                Adicionar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingProduct(false);
                  setNewApplication({ productId: '', quantity: '', reason: '', notes: '' });
                  setErrors({});
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Summary */}
      {applications?.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-text-primary mb-3 flex items-center space-x-2">
            <Icon name="BarChart3" size={16} />
            <span>Resumo por Categoria</span>
          </h4>
          <div className="space-y-2">
            {Object.entries(getTotalQuantityByCategory())?.map(([category, products]) => (
              <div key={category} className="text-sm">
                <span className="font-medium text-primary">{category}:</span>
                <div className="ml-4 text-text-secondary">
                  {products?.map((product, index) => (
                    <div key={index}>• {product}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Button
        variant="default"
        size="lg"
        onClick={handleSubmit}
        iconName="Save"
        iconPosition="left"
        fullWidth
        className="h-12"
        disabled={applications?.length === 0}
      >
        {applications?.length === 0 ? 'Adicione produtos para continuar' : 'Salvar Aplicações'}
      </Button>
    </div>
  );
};

export default ProductApplicationForm;