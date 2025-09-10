import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ClientCheckIn = ({ client, onCheckIn }) => {
  const [notes, setNotes] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = () => {
    const checkInData = {
      clientId: client?.id,
      timestamp: new Date()?.toISOString(),
      notes: notes?.trim(),
      technician: 'João Silva'
    };
    
    setIsCheckedIn(true);
    onCheckIn(checkInData);
  };

  if (isCheckedIn) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
            <Icon name="CheckCircle" size={24} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-success">Check-in Realizado</h3>
            <p className="text-sm text-text-secondary">
              {new Date()?.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4">
          <h4 className="font-medium text-text-primary mb-2">Informações do Cliente</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Nome:</span>
              <span className="ml-2 text-text-primary font-medium">{client?.name}</span>
            </div>
            <div>
              <span className="text-text-secondary">Endereço:</span>
              <span className="ml-2 text-text-primary">{client?.address}</span>
            </div>
            <div>
              <span className="text-text-secondary">Telefone:</span>
              <span className="ml-2 text-text-primary">{client?.phone}</span>
            </div>
            <div>
              <span className="text-text-secondary">Dia da Semana:</span>
              <span className="ml-2 text-text-primary">{client?.visitDay}</span>
            </div>
          </div>
          {notes && (
            <div className="mt-4 pt-4 border-t border-border">
              <span className="text-text-secondary">Observações:</span>
              <p className="mt-1 text-text-primary">{notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <Icon name="MapPin" size={24} color="white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Check-in do Cliente</h3>
          <p className="text-sm text-text-secondary">Confirme sua chegada no local</p>
        </div>
      </div>
      <div className="bg-muted rounded-lg p-4 mb-6">
        <h4 className="font-medium text-text-primary mb-3">Informações do Cliente</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="User" size={16} className="text-text-secondary" />
            <span className="text-text-secondary">Nome:</span>
            <span className="text-text-primary font-medium">{client?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={16} className="text-text-secondary" />
            <span className="text-text-secondary">Endereço:</span>
            <span className="text-text-primary">{client?.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={16} className="text-text-secondary" />
            <span className="text-text-secondary">Telefone:</span>
            <span className="text-text-primary">{client?.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-text-secondary" />
            <span className="text-text-secondary">Dia:</span>
            <span className="text-text-primary">{client?.visitDay}</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <Input
          label="Observações Iniciais (Opcional)"
          type="text"
          placeholder="Adicione observações sobre a chegada ou condições iniciais..."
          value={notes}
          onChange={(e) => setNotes(e?.target?.value)}
          description="Registre informações importantes sobre o local ou cliente"
        />
      </div>
      <Button
        variant="default"
        size="lg"
        onClick={handleCheckIn}
        iconName="CheckCircle"
        iconPosition="left"
        fullWidth
        className="h-12"
      >
        Realizar Check-in
      </Button>
    </div>
  );
};

export default ClientCheckIn;