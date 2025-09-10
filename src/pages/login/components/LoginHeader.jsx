import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-elevation-2">
          <Icon name="Waves" size={32} color="white" />
        </div>
      </div>

      {/* App Name */}
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Meu Piscineiro
      </h1>

      {/* Subtitle */}
      <p className="text-text-secondary text-lg mb-6">
        Sistema de Gestão de Manutenção de Piscinas
      </p>

      {/* Welcome Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Bem-vindo de volta!
        </h2>
        <p className="text-text-secondary">
          Faça login para acessar suas visitas, clientes e relatórios de manutenção.
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;