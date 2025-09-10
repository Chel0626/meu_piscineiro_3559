import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const VisitTimer = ({ startTime }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime);
      const diff = Math.floor((now - start) / 1000);
      setDuration(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes?.toString()?.padStart(2, '0')}m ${secs?.toString()?.padStart(2, '0')}s`;
    }
    return `${minutes}m ${secs?.toString()?.padStart(2, '0')}s`;
  };

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Clock" size={20} color="var(--color-accent-foreground)" />
          </div>
          <div>
            <h3 className="font-medium text-text-primary">Tempo de Visita</h3>
            <p className="text-sm text-text-secondary">
              Iniciado às {new Date(startTime)?.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-accent">
            {formatDuration(duration)}
          </div>
          <div className="text-xs text-text-secondary">em andamento</div>
        </div>
      </div>
    </div>
  );
};

export default VisitTimer;