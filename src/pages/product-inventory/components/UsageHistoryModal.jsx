import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const UsageHistoryModal = ({ isOpen, onClose, product }) => {
  const [viewType, setViewType] = useState('chart');
  const [timeRange, setTimeRange] = useState('6months');

  if (!isOpen || !product) return null;

  // Mock usage history data
  const usageHistory = [
    { month: 'Abr 2024', usage: 45.5, applications: 12, clients: 8 },
    { month: 'Mai 2024', usage: 52.3, applications: 15, clients: 10 },
    { month: 'Jun 2024', usage: 38.7, applications: 10, clients: 7 },
    { month: 'Jul 2024', usage: 61.2, applications: 18, clients: 12 },
    { month: 'Ago 2024', usage: 49.8, applications: 14, clients: 9 },
    { month: 'Set 2024', usage: 55.1, applications: 16, clients: 11 }
  ];

  const recentApplications = [
    {
      id: 1,
      date: '2024-09-08',
      client: 'João Silva',
      quantity: 2.5,
      technician: 'Carlos Santos',
      notes: 'Aplicação de rotina - pH alto'
    },
    {
      id: 2,
      date: '2024-09-07',
      client: 'Maria Oliveira',
      quantity: 1.8,
      technician: 'Ana Costa',
      notes: 'Correção de alcalinidade'
    },
    {
      id: 3,
      date: '2024-09-06',
      client: 'Pedro Ferreira',
      quantity: 3.2,
      technician: 'Carlos Santos',
      notes: 'Tratamento de choque'
    },
    {
      id: 4,
      date: '2024-09-05',
      client: 'Lucia Mendes',
      quantity: 1.5,
      technician: 'Ana Costa',
      notes: 'Manutenção preventiva'
    },
    {
      id: 5,
      date: '2024-09-04',
      client: 'Roberto Lima',
      quantity: 2.1,
      technician: 'Carlos Santos',
      notes: 'Ajuste de pH'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR');
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    })?.format(number);
  };

  const totalUsage = usageHistory?.reduce((sum, item) => sum + item?.usage, 0);
  const averageUsage = totalUsage / usageHistory?.length;
  const totalApplications = usageHistory?.reduce((sum, item) => sum + item?.applications, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Histórico de Uso - {product?.name}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Análise detalhada de consumo e aplicações
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        <div className="p-6">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewType === 'chart' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('chart')}
                iconName="BarChart3"
                iconPosition="left"
                iconSize={16}
              >
                Gráficos
              </Button>
              <Button
                variant={viewType === 'applications' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('applications')}
                iconName="List"
                iconPosition="left"
                iconSize={16}
              >
                Aplicações Recentes
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e?.target?.value)}
                className="px-3 py-1 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="3months">Últimos 3 meses</option>
                <option value="6months">Últimos 6 meses</option>
                <option value="12months">Último ano</option>
              </select>
            </div>
          </div>

          {viewType === 'chart' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="TrendingUp" size={20} className="text-primary" />
                    <div>
                      <div className="text-2xl font-bold text-text-primary">
                        {formatNumber(totalUsage)}
                      </div>
                      <div className="text-sm text-text-secondary">
                        Total Usado ({product?.unit})
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="BarChart" size={20} className="text-secondary" />
                    <div>
                      <div className="text-2xl font-bold text-text-primary">
                        {formatNumber(averageUsage)}
                      </div>
                      <div className="text-sm text-text-secondary">
                        Média Mensal ({product?.unit})
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Activity" size={20} className="text-accent" />
                    <div>
                      <div className="text-2xl font-bold text-text-primary">
                        {totalApplications}
                      </div>
                      <div className="text-sm text-text-secondary">
                        Total de Aplicações
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={20} className="text-success" />
                    <div>
                      <div className="text-2xl font-bold text-text-primary">
                        {Math.max(...usageHistory?.map(h => h?.clients))}
                      </div>
                      <div className="text-sm text-text-secondary">
                        Clientes Atendidos
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Chart */}
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Consumo Mensal ({product?.unit})
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${formatNumber(value)} ${product?.unit}`, 'Consumo']}
                      />
                      <Bar dataKey="usage" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Applications Trend */}
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Tendência de Aplicações
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="applications" 
                        stroke="var(--color-secondary)" 
                        strokeWidth={3}
                        dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {viewType === 'applications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Aplicações Recentes
              </h3>
              
              <div className="bg-muted rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-card">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-text-primary">Data</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-text-primary">Cliente</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-text-primary">Quantidade</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-text-primary">Técnico</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-text-primary">Observações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentApplications?.map((application) => (
                        <tr key={application?.id} className="hover:bg-card/50">
                          <td className="px-6 py-4 text-sm text-text-primary">
                            {formatDate(application?.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-primary font-medium">
                            {application?.client}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-primary">
                            {formatNumber(application?.quantity)} {product?.unit}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {application?.technician}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {application?.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsageHistoryModal;