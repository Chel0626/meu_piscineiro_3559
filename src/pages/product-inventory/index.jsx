import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import ProductFilters from './components/ProductFilters';
import UsageHistoryModal from './components/UsageHistoryModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const ProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [stockFilter, setStockFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [isLoading, setIsLoading] = useState(false);

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: 'Cloro Granulado HTH',
      description: 'Cloro granulado para tratamento de piscinas',
      category: 'Cloro e Sanitizantes',
      unit: 'Quilogramas',
      currentStock: 25.5,
      minStock: 10.0,
      costPerUnit: 15.90,
      usageThisMonth: 12.3,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-09-08T14:30:00Z'
    },
    {
      id: 2,
      name: 'pH Menos Líquido',
      description: 'Redutor de pH líquido concentrado',
      category: 'Químicos para pH',
      unit: 'Litros',
      currentStock: 8.2,
      minStock: 15.0,
      costPerUnit: 22.50,
      usageThisMonth: 18.7,
      createdAt: '2024-02-10T09:15:00Z',
      updatedAt: '2024-09-07T16:45:00Z'
    },
    {
      id: 3,
      name: 'Algicida Concentrado',
      description: 'Algicida de ação prolongada para prevenção',
      category: 'Algicidas',
      unit: 'Litros',
      currentStock: 42.0,
      minStock: 20.0,
      costPerUnit: 35.80,
      usageThisMonth: 8.5,
      createdAt: '2024-01-20T11:30:00Z',
      updatedAt: '2024-09-06T13:20:00Z'
    },
    {
      id: 4,
      name: 'Clarificante Líquido',
      description: 'Clarificante para água turva',
      category: 'Clarificantes',
      unit: 'Litros',
      currentStock: 15.8,
      minStock: 12.0,
      costPerUnit: 28.90,
      usageThisMonth: 6.2,
      createdAt: '2024-03-05T08:45:00Z',
      updatedAt: '2024-09-05T10:15:00Z'
    },
    {
      id: 5,
      name: 'Barrilha Soda',
      description: 'Elevador de pH em pó',
      category: 'Químicos para pH',
      unit: 'Quilogramas',
      currentStock: 35.0,
      minStock: 25.0,
      costPerUnit: 12.40,
      usageThisMonth: 14.8,
      createdAt: '2024-02-28T15:20:00Z',
      updatedAt: '2024-09-04T12:30:00Z'
    },
    {
      id: 6,
      name: 'Aspirador Manual',
      description: 'Aspirador manual com cabo telescópico',
      category: 'Equipamentos',
      unit: 'Unidades',
      currentStock: 3.0,
      minStock: 2.0,
      costPerUnit: 89.90,
      usageThisMonth: 0.0,
      createdAt: '2024-01-10T14:00:00Z',
      updatedAt: '2024-09-03T09:45:00Z'
    },
    {
      id: 7,
      name: 'Pastilhas de Cloro 3 em 1',
      description: 'Pastilhas multifuncionais de cloro',
      category: 'Cloro e Sanitizantes',
      unit: 'Quilogramas',
      currentStock: 18.5,
      minStock: 20.0,
      costPerUnit: 45.60,
      usageThisMonth: 22.1,
      createdAt: '2024-03-12T16:30:00Z',
      updatedAt: '2024-09-02T11:20:00Z'
    },
    {
      id: 8,
      name: 'Teste Kit pH e Cloro',
      description: 'Kit para teste de pH e cloro livre',
      category: 'Acessórios',
      unit: 'Unidades',
      currentStock: 12.0,
      minStock: 5.0,
      costPerUnit: 25.90,
      usageThisMonth: 2.0,
      createdAt: '2024-02-15T13:15:00Z',
      updatedAt: '2024-09-01T15:10:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        product?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'Todos') {
      filtered = filtered?.filter(product => product?.category === selectedCategory);
    }

    // Apply stock filter
    if (stockFilter !== 'all') {
      filtered = filtered?.filter(product => {
        switch (stockFilter) {
          case 'low':
            return product?.currentStock <= product?.minStock;
          case 'normal':
            return product?.currentStock > product?.minStock && product?.currentStock <= product?.minStock * 2;
          case 'high':
            return product?.currentStock > product?.minStock * 2;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, stockFilter]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('create');
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleViewUsage = (product) => {
    setSelectedProduct(product);
    setIsUsageModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (modalMode === 'create') {
        setProducts(prev => [...prev, { ...productData, id: Date.now() }]);
      } else {
        setProducts(prev => prev?.map(p => 
          p?.id === productData?.id ? productData : p
        ));
      }
      
      setIsProductModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(prev => prev?.filter(p => p?.id !== selectedProduct?.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && products?.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-text-secondary">Carregando produtos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Inventário de Produtos</h1>
            <p className="text-text-secondary mt-2">
              Gerencie produtos, estoques e acompanhe o consumo
            </p>
          </div>
          <Button
            onClick={handleAddProduct}
            iconName="Plus"
            iconPosition="left"
            iconSize={20}
            className="shadow-elevation-1"
          >
            Adicionar Produto
          </Button>
        </div>

        {/* Filters */}
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          products={products}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-text-secondary">
            Mostrando {filteredProducts?.length} de {products?.length} produtos
          </div>
          {filteredProducts?.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="Package" size={16} />
              <span>Total em estoque: {filteredProducts?.reduce((sum, p) => sum + p?.currentStock, 0)?.toFixed(1)} unidades</span>
            </div>
          )}
        </div>

        {/* Products Table */}
        {filteredProducts?.length > 0 ? (
          <ProductTable
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onViewUsage={handleViewUsage}
          />
        ) : (
          <div className="bg-card rounded-lg shadow-elevation-1 p-12 text-center">
            <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              {products?.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum produto encontrado'}
            </h3>
            <p className="text-text-secondary mb-6">
              {products?.length === 0 
                ? 'Comece adicionando seu primeiro produto ao inventário'
                : 'Tente ajustar os filtros para encontrar o que procura'
              }
            </p>
            {products?.length === 0 && (
              <Button
                onClick={handleAddProduct}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Adicionar Primeiro Produto
              </Button>
            )}
          </div>
        )}

        {/* Modals */}
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
          product={selectedProduct}
          mode={modalMode}
        />

        <UsageHistoryModal
          isOpen={isUsageModalOpen}
          onClose={() => setIsUsageModalOpen(false)}
          product={selectedProduct}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          product={selectedProduct}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProductInventory;