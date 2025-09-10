import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const certifications = [
    {
      id: 1,
      name: 'CNPJ Verificado',
      icon: 'Shield',
      description: 'Empresa registrada no Brasil'
    },
    {
      id: 2,
      name: 'LGPD Compliance',
      icon: 'Lock',
      description: 'Dados protegidos conforme LGPD'
    },
    {
      id: 3,
      name: 'SSL Seguro',
      icon: 'ShieldCheck',
      description: 'Conexão criptografada'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <p className="text-center text-sm text-text-secondary mb-4">
        Sua segurança é nossa prioridade
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {certifications?.map((cert) => (
          <div
            key={cert?.id}
            className="flex items-center space-x-2 p-3 bg-muted rounded-lg"
          >
            <Icon 
              name={cert?.icon} 
              size={16} 
              className="text-success flex-shrink-0" 
            />
            <div>
              <p className="text-xs font-medium text-text-primary">
                {cert?.name}
              </p>
              <p className="text-xs text-text-secondary">
                {cert?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-xs text-text-secondary">
          © {new Date()?.getFullYear()} Meu Piscineiro. Todos os direitos reservados.
        </p>
        <p className="text-xs text-text-secondary mt-1">
          Desenvolvido com segurança para profissionais de piscina no Brasil.
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;