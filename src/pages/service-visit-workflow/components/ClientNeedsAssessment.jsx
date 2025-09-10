import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ClientNeedsAssessment = ({ onSubmit, initialData = {} }) => {
  const [assessment, setAssessment] = useState({
    recommendations: initialData?.recommendations || [],
    clientApproval: initialData?.clientApproval || {},
    generalNotes: initialData?.generalNotes || '',
    nextVisitNotes: initialData?.nextVisitNotes || '',
    urgentIssues: initialData?.urgentIssues || [],
    ...initialData
  });

  // Mock recommendations based on common pool issues
  const possibleRecommendations = [
    {
      id: 'equipment-maintenance',
      title: 'Manutenção de Equipamentos',
      description: 'Limpeza e verificação de bombas, filtros e skimmers',
      priority: 'medium',
      estimatedCost: 150.00,
      category: 'Manutenção'
    },
    {
      id: 'chemical-balance',
      title: 'Balanceamento Químico Completo',
      description: 'Ajuste completo de pH, cloro e alcalinidade',
      priority: 'high',
      estimatedCost: 80.00,
      category: 'Química'
    },
    {
      id: 'deep-cleaning',
      title: 'Limpeza Profunda',
      description: 'Escovação completa, aspiração e limpeza de bordas',
      priority: 'medium',
      estimatedCost: 200.00,
      category: 'Limpeza'
    },
    {
      id: 'algae-treatment',
      title: 'Tratamento Anti-Algas',
      description: 'Aplicação de algicida e tratamento preventivo',
      priority: 'high',
      estimatedCost: 120.00,
      category: 'Tratamento'
    },
    {
      id: 'filter-replacement',
      title: 'Troca de Filtro',
      description: 'Substituição do elemento filtrante',
      priority: 'low',
      estimatedCost: 300.00,
      category: 'Equipamento'
    },
    {
      id: 'tile-cleaning',
      title: 'Limpeza de Azulejos',
      description: 'Remoção de calcário e manchas dos azulejos',
      priority: 'low',
      estimatedCost: 180.00,
      category: 'Limpeza'
    }
  ];

  const [selectedRecommendations, setSelectedRecommendations] = useState(
    assessment?.recommendations?.map(r => r?.id) || []
  );

  const urgentIssueOptions = [
    'Água turva ou com coloração anormal',
    'Equipamento com defeito',
    'Vazamento identificado',
    'Presença de algas visíveis',
    'Odor forte de cloro ou químicos',
    'pH muito alto ou muito baixo',
    'Problema na circulação da água'
  ];

  const handleRecommendationToggle = (recommendationId) => {
    setSelectedRecommendations(prev => {
      const newSelection = prev?.includes(recommendationId)
        ? prev?.filter(id => id !== recommendationId)
        : [...prev, recommendationId];
      
      // Update assessment with selected recommendations
      const recommendations = possibleRecommendations?.filter(rec => 
        newSelection?.includes(rec?.id)
      );
      
      setAssessment(prevAssessment => ({
        ...prevAssessment,
        recommendations
      }));
      
      return newSelection;
    });
  };

  const handleApprovalChange = (recommendationId, approved) => {
    setAssessment(prev => ({
      ...prev,
      clientApproval: {
        ...prev?.clientApproval,
        [recommendationId]: approved
      }
    }));
  };

  const handleUrgentIssueToggle = (issue) => {
    setAssessment(prev => ({
      ...prev,
      urgentIssues: prev?.urgentIssues?.includes(issue)
        ? prev?.urgentIssues?.filter(i => i !== issue)
        : [...prev?.urgentIssues, issue]
    }));
  };

  const handleSubmit = () => {
    const finalAssessment = {
      ...assessment,
      timestamp: new Date()?.toISOString(),
      technician: 'João Silva',
      totalEstimatedCost: assessment?.recommendations?.filter(rec => assessment?.clientApproval?.[rec?.id])?.reduce((total, rec) => total + rec?.estimatedCost, 0)
    };
    
    onSubmit(finalAssessment);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  const approvedRecommendations = assessment?.recommendations?.filter(
    rec => assessment?.clientApproval?.[rec?.id]
  );

  const totalApprovedCost = approvedRecommendations?.reduce(
    (total, rec) => total + rec?.estimatedCost, 0
  );

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <Icon name="ClipboardList" size={24} color="white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Avaliação de Necessidades</h3>
          <p className="text-sm text-text-secondary">Recomendações e aprovações do cliente</p>
        </div>
      </div>
      {/* Urgent Issues */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3 flex items-center space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-warning" />
          <span>Problemas Urgentes Identificados</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {urgentIssueOptions?.map((issue) => (
            <Checkbox
              key={issue}
              label={issue}
              checked={assessment?.urgentIssues?.includes(issue)}
              onChange={() => handleUrgentIssueToggle(issue)}
              size="sm"
            />
          ))}
        </div>
      </div>
      {/* Recommendations */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3 flex items-center space-x-2">
          <Icon name="Lightbulb" size={16} className="text-primary" />
          <span>Recomendações de Serviços</span>
        </h4>
        <div className="space-y-4">
          {possibleRecommendations?.map((recommendation) => (
            <div key={recommendation?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={selectedRecommendations?.includes(recommendation?.id)}
                  onChange={() => handleRecommendationToggle(recommendation?.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-text-primary">{recommendation?.title}</h5>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(recommendation?.priority)}`}>
                        {getPriorityLabel(recommendation?.priority)}
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        R$ {recommendation?.estimatedCost?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{recommendation?.description}</p>
                  
                  {selectedRecommendations?.includes(recommendation?.id) && (
                    <div className="bg-muted rounded-lg p-3">
                      <h6 className="font-medium text-text-primary mb-2">Aprovação do Cliente</h6>
                      <div className="flex space-x-4">
                        <Checkbox
                          label="Cliente aprovou este serviço"
                          checked={assessment?.clientApproval?.[recommendation?.id] || false}
                          onChange={(e) => handleApprovalChange(recommendation?.id, e?.target?.checked)}
                          size="sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Approved Services Summary */}
      {approvedRecommendations?.length > 0 && (
        <div className="bg-success/5 border border-success/20 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-success mb-3 flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} />
            <span>Serviços Aprovados pelo Cliente</span>
          </h4>
          <div className="space-y-2">
            {approvedRecommendations?.map((rec) => (
              <div key={rec?.id} className="flex justify-between items-center text-sm">
                <span className="text-text-primary">{rec?.title}</span>
                <span className="font-medium text-success">R$ {rec?.estimatedCost?.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-success/20 pt-2 mt-2">
              <div className="flex justify-between items-center font-medium">
                <span className="text-text-primary">Total Aprovado:</span>
                <span className="text-success text-lg">R$ {totalApprovedCost?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Notes */}
      <div className="space-y-4 mb-6">
        <Input
          label="Observações Gerais"
          type="text"
          placeholder="Observações sobre o estado geral da piscina..."
          value={assessment?.generalNotes}
          onChange={(e) => setAssessment(prev => ({ ...prev, generalNotes: e?.target?.value }))}
          description="Registre informações importantes sobre a condição da piscina"
        />
        
        <Input
          label="Orientações para Próxima Visita"
          type="text"
          placeholder="Instruções ou lembretes para a próxima manutenção..."
          value={assessment?.nextVisitNotes}
          onChange={(e) => setAssessment(prev => ({ ...prev, nextVisitNotes: e?.target?.value }))}
          description="Informações que serão úteis na próxima visita"
        />
      </div>
      <Button
        variant="default"
        size="lg"
        onClick={handleSubmit}
        iconName="Save"
        iconPosition="left"
        fullWidth
        className="h-12"
      >
        Salvar Avaliação
      </Button>
    </div>
  );
};

export default ClientNeedsAssessment;