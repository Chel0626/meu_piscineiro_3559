import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, product, isLoading = false }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-error" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Confirmar Exclusão
              </h3>
              <p className="text-sm text-text-secondary">
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-text-primary mb-2">
              Tem certeza que deseja excluir o produto:
            </p>
            <div className="bg-muted rounded-lg p-4">
              <div className="font-medium text-text-primary">{product?.name}</div>
              <div className="text-sm text-text-secondary mt-1">
                {product?.description}
              </div>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="text-text-secondary">
                  Categoria: <span className="text-text-primary">{product?.category}</span>
                </span>
                <span className="text-text-secondary">
                  Estoque: <span className="text-text-primary">{product?.currentStock} {product?.unit}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
              <div className="text-sm">
                <p className="text-error font-medium mb-1">Atenção:</p>
                <ul className="text-text-secondary space-y-1">
                  <li>• O histórico de uso deste produto será perdido</li>
                  <li>• Aplicações anteriores permanecerão no histórico dos clientes</li>
                  <li>• Esta ação não afetará relatórios já gerados</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              loading={isLoading}
              iconName="Trash2"
              iconPosition="left"
              iconSize={16}
            >
              Excluir Produto
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;