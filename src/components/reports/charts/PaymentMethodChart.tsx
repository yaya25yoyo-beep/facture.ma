import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CreditCard, Banknote, FileText, Smartphone } from 'lucide-react';

interface PaymentMethodData {
  method: string;
  value: number;
  count: number;
  percentage: number;
  color: string;
  icon: React.ComponentType<any>;
}

interface PaymentMethodChartProps {
  data: PaymentMethodData[];
  title: string;
  subtitle: string;
}

export default function PaymentMethodChart({ data, title, subtitle }: PaymentMethodChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <data.icon className="w-4 h-4 text-gray-600" />
            <p className="font-medium text-gray-900">{data.method}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Montant:</span>
              <span className="font-medium">{data.value.toLocaleString()} MAD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Transactions:</span>
              <span className="font-medium">{data.count}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pourcentage:</span>
              <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique */}
        <div className="relative">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percentage }) => `${percentage.toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Centre du donut */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{totalCount}</div>
              <div className="text-xs text-gray-600">Transactions</div>
            </div>
          </div>
        </div>

        {/* Détails par méthode */}
        <div className="space-y-3">
          {data.map((method, index) => {
            const Icon = method.icon;
            return (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: method.color }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{method.method}</p>
                    <p className="text-sm text-gray-600">{method.count} transaction{method.count > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{method.value.toLocaleString()} MAD</p>
                  <p className="text-sm text-gray-600">{method.percentage.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Résumé */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{totalValue.toLocaleString()}</div>
            <div className="text-xs text-blue-700">Total encaissé</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {totalCount > 0 ? (totalValue / totalCount).toFixed(0) : '0'}
            </div>
            <div className="text-xs text-purple-700">Montant moyen</div>
          </div>
        </div>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune donnée de paiement disponible</p>
        </div>
      )}
    </div>
  );
}