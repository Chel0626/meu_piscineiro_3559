import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const WaterParametersForm = ({ onSubmit, initialData = {} }) => {
  const [parameters, setParameters] = useState({
    ph: initialData?.ph || '',
    chlorine: initialData?.chlorine || '',
    alkalinity: initialData?.alkalinity || '',
    calciumHardness: initialData?.calciumHardness || '',
    cyanuricAcid: initialData?.cyanuricAcid || '',
    temperature: initialData?.temperature || '',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const parameterConfig = {
    ph: {
      label: 'pH',
      min: 6.0,
      max: 8.5,
      ideal: '7.2 - 7.6',
      unit: '',
      step: 0.1,
      icon: 'Droplets'
    },
    chlorine: {
      label: 'Cloro Livre',
      min: 0.5,
      max: 5.0,
      ideal: '1.0 - 3.0',
      unit: 'ppm',
      step: 0.1,
      icon: 'Zap'
    },
    alkalinity: {
      label: 'Alcalinidade Total',
      min: 80,
      max: 200,
      ideal: '80 - 120',
      unit: 'ppm',
      step: 1,
      icon: 'BarChart3'
    },
    calciumHardness: {
      label: 'Dureza Cálcica',
      min: 150,
      max: 500,
      ideal: '200 - 400',
      unit: 'ppm',
      step: 1,
      icon: 'Layers'
    },
    cyanuricAcid: {
      label: 'Ácido Cianúrico',
      min: 30,
      max: 100,
      ideal: '30 - 50',
      unit: 'ppm',
      step: 1,
      icon: 'Shield'
    },
    temperature: {
      label: 'Temperatura',
      min: 15,
      max: 40,
      ideal: '24 - 28',
      unit: '°C',
      step: 0.5,
      icon: 'Thermometer'
    }
  };

  const validateParameter = (key, value) => {
    const config = parameterConfig?.[key];
    const numValue = parseFloat(value);
    
    if (!value) return 'Este campo é obrigatório';
    if (isNaN(numValue)) return 'Valor deve ser numérico';
    if (numValue < config?.min) return `Valor mínimo: ${config?.min}${config?.unit}`;
    if (numValue > config?.max) return `Valor máximo: ${config?.max}${config?.unit}`;
    
    return '';
  };

  const getParameterStatus = (key, value) => {
    const config = parameterConfig?.[key];
    const numValue = parseFloat(value);
    
    if (!value || isNaN(numValue)) return 'neutral';
    
    const [idealMin, idealMax] = config?.ideal?.split(' - ')?.map(v => parseFloat(v));
    
    if (numValue >= idealMin && numValue <= idealMax) return 'ideal';
    if (numValue < config?.min || numValue > config?.max) return 'critical';
    return 'warning';
  };

  const handleParameterChange = (key, value) => {
    setParameters(prev => ({ ...prev, [key]: value }));
    
    const error = validateParameter(key, value);
    setErrors(prev => ({ ...prev, [key]: error }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const newErrors = {};
    Object.keys(parameterConfig)?.forEach(key => {
      const error = validateParameter(key, parameters?.[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors)?.length === 0) {
      const formattedData = {
        ...parameters,
        timestamp: new Date()?.toISOString(),
        technician: 'João Silva'
      };
      onSubmit(formattedData);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ideal': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ideal': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'critical': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <Icon name="TestTube" size={24} color="white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Parâmetros da Água</h3>
          <p className="text-sm text-text-secondary">Registre as medições dos testes químicos</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(parameterConfig)?.map(([key, config]) => {
            const status = getParameterStatus(key, parameters?.[key]);
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name={config?.icon} size={16} className="text-primary" />
                    <span className="text-sm font-medium text-text-primary">
                      {config?.label}
                    </span>
                  </div>
                  {parameters?.[key] && (
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={getStatusIcon(status)} 
                        size={14} 
                        className={getStatusColor(status)} 
                      />
                      <span className={`text-xs ${getStatusColor(status)}`}>
                        {status === 'ideal' ? 'Ideal' : 
                         status === 'warning' ? 'Atenção' : 
                         status === 'critical' ? 'Crítico' : ''}
                      </span>
                    </div>
                  )}
                </div>
                <Input
                  type="number"
                  placeholder={`Ex: ${config?.ideal?.split(' - ')?.[0]}`}
                  value={parameters?.[key]}
                  onChange={(e) => handleParameterChange(key, e?.target?.value)}
                  error={errors?.[key]}
                  min={config?.min}
                  max={config?.max}
                  step={config?.step}
                  className="text-lg"
                />
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Ideal: {config?.ideal}{config?.unit}</span>
                  <span>Faixa: {config?.min} - {config?.max}{config?.unit}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium text-text-primary mb-2 flex items-center space-x-2">
            <Icon name="Info" size={16} />
            <span>Resumo dos Parâmetros</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {Object.entries(parameterConfig)?.map(([key, config]) => {
              const status = getParameterStatus(key, parameters?.[key]);
              const value = parameters?.[key];
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-text-secondary">{config?.label}:</span>
                  <span className={`font-medium ${getStatusColor(status)}`}>
                    {value ? `${value}${config?.unit}` : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          iconName="Save"
          iconPosition="left"
          fullWidth
          className="h-12"
        >
          Salvar Parâmetros
        </Button>
      </form>
    </div>
  );
};

export default WaterParametersForm;