import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CredentialsHelper = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mockCredentials = [
    {
      role: 'Técnico',
      email: 'tecnico@piscineiro.com',
      password: 'tecnico123',
      description: 'Acesso para técnicos de manutenção'
    },
    {
      role: 'Gerente',
      email: 'gerente@piscineiro.com',
      password: 'gerente123',
      description: 'Acesso para gerentes de operação'
    },
    {
      role: 'Administrador',
      email: 'admin@piscineiro.com',
      password: 'admin123',
      description: 'Acesso completo ao sistema'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    // Could add a toast notification here
  };

  return (
    <div className="mt-6">
      <Button
        variant="outline"
        size="sm"
        fullWidth
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
        iconSize={16}
      >
        {isExpanded ? 'Ocultar' : 'Ver'} Credenciais de Teste
      </Button>
      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Credenciais para Demonstração
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Use as credenciais abaixo para testar diferentes níveis de acesso
                </p>
              </div>
            </div>
          </div>

          {mockCredentials?.map((cred, index) => (
            <div
              key={index}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-text-primary">{cred?.role}</h4>
                <Icon name="User" size={16} className="text-text-secondary" />
              </div>
              
              <p className="text-xs text-text-secondary mb-3">
                {cred?.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between bg-muted rounded p-2">
                  <span className="text-sm font-mono text-text-primary">
                    {cred?.email}
                  </span>
                  <button
                    onClick={() => copyToClipboard(cred?.email)}
                    className="text-primary hover:text-primary/80 transition-smooth"
                  >
                    <Icon name="Copy" size={14} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between bg-muted rounded p-2">
                  <span className="text-sm font-mono text-text-primary">
                    {cred?.password}
                  </span>
                  <button
                    onClick={() => copyToClipboard(cred?.password)}
                    className="text-primary hover:text-primary/80 transition-smooth"
                  >
                    <Icon name="Copy" size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;