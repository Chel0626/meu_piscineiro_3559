import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProgressIndicator from './components/ProgressIndicator';
import VisitTimer from './components/VisitTimer';
import ClientCheckIn from './components/ClientCheckIn';
import WaterParametersForm from './components/WaterParametersForm';
import ProductApplicationForm from './components/ProductApplicationForm';
import ClientNeedsAssessment from './components/ClientNeedsAssessment';

const ServiceVisitWorkflow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams?.get('clientId');

  const [currentStep, setCurrentStep] = useState(1);
  const [visitData, setVisitData] = useState({
    client: null,
    checkIn: null,
    waterParameters: null,
    productApplications: [],
    needsAssessment: null,
    startTime: null,
    status: 'pending'
  });

  // Mock client data
  const mockClients = [
    {
      id: '1',
      name: 'Maria Silva Santos',
      address: 'Rua das Flores, 123 - Jardim Primavera',
      phone: '(11) 98765-4321',
      visitDay: 'Segunda-feira',
      poolType: 'Residencial',
      lastVisit: '2024-09-03'
    },
    {
      id: '2',
      name: 'João Carlos Oliveira',
      address: 'Av. Central, 456 - Centro',
      phone: '(11) 91234-5678',
      visitDay: 'Terça-feira',
      poolType: 'Comercial',
      lastVisit: '2024-09-04'
    },
    {
      id: '3',
      name: 'Ana Paula Costa',
      address: 'Rua do Sol, 789 - Vila Nova',
      phone: '(11) 95555-1234',
      visitDay: 'Quarta-feira',
      poolType: 'Residencial',
      lastVisit: '2024-09-05'
    }
  ];

  const workflowSteps = [
    { id: 1, title: 'Check-in', component: 'checkin' },
    { id: 2, title: 'Parâmetros', component: 'parameters' },
    { id: 3, title: 'Produtos', component: 'products' },
    { id: 4, title: 'Avaliação', component: 'assessment' }
  ];

  useEffect(() => {
    // Load client data
    const client = mockClients?.find(c => c?.id === clientId);
    if (!client) {
      navigate('/dashboard');
      return;
    }

    setVisitData(prev => ({
      ...prev,
      client,
      startTime: new Date()?.toISOString()
    }));
  }, [clientId, navigate]);

  const handleCheckIn = (checkInData) => {
    setVisitData(prev => ({
      ...prev,
      checkIn: checkInData,
      status: 'in-progress'
    }));
    setCurrentStep(2);
  };

  const handleWaterParameters = (parametersData) => {
    setVisitData(prev => ({
      ...prev,
      waterParameters: parametersData
    }));
    setCurrentStep(3);
  };

  const handleProductApplications = (applicationsData) => {
    setVisitData(prev => ({
      ...prev,
      productApplications: applicationsData
    }));
    setCurrentStep(4);
  };

  const handleNeedsAssessment = (assessmentData) => {
    setVisitData(prev => ({
      ...prev,
      needsAssessment: assessmentData
    }));
    
    // Complete the visit
    completeVisit();
  };

  const completeVisit = () => {
    const completedVisit = {
      ...visitData,
      endTime: new Date()?.toISOString(),
      status: 'completed',
      duration: Math.floor((new Date() - new Date(visitData.startTime)) / 1000)
    };

    // In a real app, this would save to backend
    console.log('Visit completed:', completedVisit);
    
    // Show completion message and redirect
    alert('Visita finalizada com sucesso!');
    navigate('/dashboard');
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToDashboard = () => {
    if (visitData?.status === 'in-progress') {
      const confirmLeave = window.confirm(
        'Você tem uma visita em andamento. Deseja realmente sair? O progresso será perdido.'
      );
      if (!confirmLeave) return;
    }
    navigate('/dashboard');
  };

  if (!visitData?.client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClientCheckIn
            client={visitData?.client}
            onCheckIn={handleCheckIn}
          />
        );
      case 2:
        return (
          <WaterParametersForm
            onSubmit={handleWaterParameters}
            initialData={visitData?.waterParameters}
          />
        );
      case 3:
        return (
          <ProductApplicationForm
            onSubmit={handleProductApplications}
            initialData={visitData?.productApplications}
          />
        );
      case 4:
        return (
          <ClientNeedsAssessment
            onSubmit={handleNeedsAssessment}
            initialData={visitData?.needsAssessment}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-elevation-1 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-lg font-semibold text-text-primary">
                  Fluxo de Visita
                </h1>
                <p className="text-sm text-text-secondary">
                  {visitData?.client?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {visitData?.status === 'in-progress' && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-success font-medium">Em Andamento</span>
                </div>
              )}
              
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousStep}
                  iconName="ChevronLeft"
                  iconPosition="left"
                >
                  Anterior
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={workflowSteps?.length}
          steps={workflowSteps}
        />

        {/* Visit Timer */}
        {visitData?.startTime && visitData?.status === 'in-progress' && (
          <VisitTimer startTime={visitData?.startTime} />
        )}

        {/* Current Step Content */}
        <div className="mb-6">
          {renderCurrentStep()}
        </div>

        {/* Mobile Navigation Helper */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Etapa {currentStep} de {workflowSteps?.length}
            </div>
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousStep}
                  iconName="ChevronLeft"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                iconName="Home"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceVisitWorkflow;