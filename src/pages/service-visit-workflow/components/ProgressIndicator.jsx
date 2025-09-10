import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="bg-card rounded-lg p-6 mb-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Progresso da Visita</h2>
        <span className="text-sm text-text-secondary">
          Etapa {currentStep} de {totalSteps}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <React.Fragment key={step?.id}>
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-smooth
                  ${isCompleted 
                    ? 'bg-success text-success-foreground' 
                    : isCurrent 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`
                  text-xs mt-2 text-center max-w-20 leading-tight
                  ${isCurrent ? 'text-primary font-medium' : 'text-text-secondary'}
                `}>
                  {step?.title}
                </span>
              </div>
              {index < steps?.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-2 transition-smooth
                  ${isCompleted ? 'bg-success' : 'bg-muted'}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;