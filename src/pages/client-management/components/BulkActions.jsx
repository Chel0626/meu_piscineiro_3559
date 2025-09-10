import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedClients, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const actionOptions = [
    { value: '', label: 'Selecionar ação...' },
    { value: 'activate', label: 'Ativar Clientes' },
    { value: 'deactivate', label: 'Desativar Clientes' },
    { value: 'change-day', label: 'Alterar Dia da Visita' },
    { value: 'export', label: 'Exportar Dados' },
    { value: 'delete', label: 'Excluir Clientes' }
  ];

  const visitDayOptions = [
    { value: 'Segunda-feira', label: 'Segunda-feira' },
    { value: 'Terça-feira', label: 'Terça-feira' },
    { value: 'Quarta-feira', label: 'Quarta-feira' },
    { value: 'Quinta-feira', label: 'Quinta-feira' },
    { value: 'Sexta-feira', label: 'Sexta-feira' },
    { value: 'Sábado', label: 'Sábado' }
  ];

  const [newVisitDay, setNewVisitDay] = useState('');
  const [showVisitDaySelect, setShowVisitDaySelect] = useState(false);

  const handleActionChange = (action) => {
    setSelectedAction(action);
    setShowVisitDaySelect(action === 'change-day');
    if (action !== 'change-day') {
      setNewVisitDay('');
    }
  };

  const handleExecuteAction = async () => {
    if (!selectedAction) return;

    if (selectedAction === 'change-day' && !newVisitDay) {
      alert('Por favor, selecione o novo dia da visita.');
      return;
    }

    setIsLoading(true);
    
    try {
      await onBulkAction(selectedAction, {
        clientIds: selectedClients,
        newVisitDay: selectedAction === 'change-day' ? newVisitDay : undefined
      });
      
      // Reset form
      setSelectedAction('');
      setNewVisitDay('');
      setShowVisitDaySelect(false);
      onClearSelection();
    } catch (error) {
      console.error('Error executing bulk action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      'activate': 'CheckCircle',
      'deactivate': 'XCircle',
      'change-day': 'Calendar',
      'export': 'Download',
      'delete': 'Trash2'
    };
    return icons?.[action] || 'Settings';
  };

  const getActionColor = (action) => {
    const colors = {
      'activate': 'success',
      'deactivate': 'secondary',
      'change-day': 'default',
      'export': 'default',
      'delete': 'destructive'
    };
    return colors?.[action] || 'default';
  };

  if (selectedClients?.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedClients?.length} cliente{selectedClients?.length !== 1 ? 's' : ''} selecionado{selectedClients?.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconSize={16}
            className="text-blue-600 hover:text-blue-800"
          >
            Limpar Seleção
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            options={actionOptions}
            value={selectedAction}
            onChange={handleActionChange}
            placeholder="Selecionar ação..."
            className="min-w-[200px]"
          />

          {showVisitDaySelect && (
            <Select
              options={visitDayOptions}
              value={newVisitDay}
              onChange={setNewVisitDay}
              placeholder="Novo dia da visita"
              className="min-w-[160px]"
            />
          )}

          <Button
            variant={getActionColor(selectedAction)}
            size="sm"
            onClick={handleExecuteAction}
            disabled={!selectedAction || isLoading}
            loading={isLoading}
            iconName={selectedAction ? getActionIcon(selectedAction) : 'Play'}
            iconPosition="left"
            iconSize={16}
          >
            Executar
          </Button>
        </div>
      </div>
      {selectedAction === 'delete' && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">
              <strong>Atenção:</strong> Esta ação não pode ser desfeita. Os clientes selecionados e todo seu histórico de serviços serão permanentemente removidos.
            </div>
          </div>
        </div>
      )}
      {selectedAction === 'change-day' && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              O dia da visita será alterado para todos os clientes selecionados. As próximas visitas serão reagendadas automaticamente.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;