import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceDetailModal = ({ visit, client, isOpen, onClose }) => {
  if (!isOpen || !visit) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString)?.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getParameterStatus = (param, value) => {
    const ranges = {
      ph: { min: 7.0, max: 7.6, unit: '' },
      chlorine: { min: 1.0, max: 3.0, unit: 'ppm' },
      alkalinity: { min: 80, max: 120, unit: 'ppm' },
      calcium: { min: 200, max: 400, unit: 'ppm' },
      cyanuric: { min: 30, max: 50, unit: 'ppm' }
    };

    const range = ranges?.[param];
    if (!range) return 'normal';

    const numValue = parseFloat(value);
    if (numValue < range?.min) return 'low';
    if (numValue > range?.max) return 'high';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'low':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'low':
        return 'ArrowDown';
      case 'high':
        return 'ArrowUp';
      default:
        return 'Check';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Mock export functionality
    const data = {
      client: client?.name,
      visit: visit,
      exportDate: new Date()?.toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${client?.name}-${visit?.date}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Relatório de Serviço</h2>
            <p className="text-gray-600 mt-1">{formatDate(visit?.date)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Client and Visit Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Icon name="User" size={18} className="mr-2" />
                Informações do Cliente
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>Nome:</strong> {client?.name}</div>
                <div><strong>Endereço:</strong> {client?.address}</div>
                <div><strong>Telefone:</strong> {client?.phone}</div>
                <div><strong>Dia de Visita:</strong> {client?.scheduledDay}</div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Icon name="Calendar" size={18} className="mr-2" />
                Detalhes da Visita
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>Data:</strong> {formatDate(visit?.date)}</div>
                <div><strong>Horário:</strong> {formatTime(visit?.startTime)} - {formatTime(visit?.endTime)}</div>
                <div><strong>Duração:</strong> {formatDuration(visit?.duration)}</div>
                <div><strong>Técnico:</strong> {visit?.technician}</div>
                <div>
                  <strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    visit?.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                    visit?.status === 'Em Andamento'? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {visit?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Water Parameters */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Icon name="Droplets" size={18} className="mr-2" />
              Parâmetros da Água
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(visit?.waterParameters)?.map(([param, value]) => {
                const status = getParameterStatus(param, value);
                const paramLabels = {
                  ph: 'pH',
                  chlorine: 'Cloro Livre',
                  alkalinity: 'Alcalinidade Total',
                  calcium: 'Dureza Cálcica',
                  cyanuric: 'Ácido Cianúrico'
                };

                return (
                  <div key={param} className={`p-4 rounded-lg border-2 ${getStatusColor(status)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{paramLabels?.[param]}</h4>
                      <Icon name={getStatusIcon(status)} size={16} />
                    </div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-sm opacity-75 mt-1">
                      {status === 'low' ? 'Abaixo do ideal' :
                       status === 'high' ? 'Acima do ideal' :
                       'Dentro do ideal'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Products Used */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Icon name="Package" size={18} className="mr-2" />
              Produtos Aplicados
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-900">Produto</th>
                    <th className="text-left p-3 font-medium text-gray-900">Quantidade</th>
                    <th className="text-left p-3 font-medium text-gray-900">Unidade</th>
                    <th className="text-left p-3 font-medium text-gray-900">Finalidade</th>
                  </tr>
                </thead>
                <tbody>
                  {visit?.productsUsed?.map((product, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-3 text-gray-900">{product?.name}</td>
                      <td className="p-3 text-gray-900">{product?.quantity}</td>
                      <td className="p-3 text-gray-600">{product?.unit}</td>
                      <td className="p-3 text-gray-600">{product?.purpose || 'Manutenção geral'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          {visit?.recommendations && visit?.recommendations?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="Lightbulb" size={18} className="mr-2" />
                Recomendações
              </h3>
              <div className="space-y-3">
                {visit?.recommendations?.map((rec, index) => (
                  <div key={index} className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-800">{rec?.description}</p>
                        {rec?.priority && (
                          <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                            rec?.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                            rec?.priority === 'Média'? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            Prioridade: {rec?.priority}
                          </span>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec?.status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                        rec?.status === 'Pendente'? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {rec?.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technician Notes */}
          {visit?.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="FileText" size={18} className="mr-2" />
                Observações do Técnico
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{visit?.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={handlePrint}
            iconName="Printer"
            iconPosition="left"
            className="flex-1"
          >
            Imprimir Relatório
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            iconName="Download"
            iconPosition="left"
            className="flex-1"
          >
            Exportar PDF
          </Button>
          <Button
            variant="default"
            onClick={onClose}
            className="flex-1"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;