import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface CashflowData {
  date: string;
  incoming: number;
  outgoing: number;
  balance: number;
  cumulative: number;
}

interface CashflowChartProps {
  data: CashflowData[];
  title: string;
  subtitle: string;
}

export default function CashflowChart({ data, title, subtitle }: CashflowChartProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className={`font-medium ${
                entry.name === 'Solde' 
                  ? entry.value >= 0 ? 'text-green-600' : 'text-red-600'
                  : 'text-gray-900'
              }`}>
                {entry.value >= 0 && entry.name === 'Solde' ? '+' : ''}
                {entry.value.toLocaleString()} MAD
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculer les tendances
  const currentBalance = data.length > 0 ? data[data.length - 1].cumulative : 0;
  const previousBalance = data.length > 1 ? data[data.length - 2].cumulative : 0;
  const trend = currentBalance - previousBalance;
  
  const minBalance = Math.min(...data.map(d => d.cumulative));
  const maxBalance = Math.max(...data.map(d => d.cumulative));
  const negativeCount = data.filter(d => d.cumulative < 0).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        
        {/* Indicateur de tendance */}
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
          trend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {trend >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {trend >= 0 ? '+' : ''}{trend.toLocaleString()} MAD
          </span>
        </div>
      </div>

      {/* Alertes */}
      {negativeCount > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800 font-medium">
              ⚠️ {negativeCount} période{negativeCount > 1 ? 's' : ''} avec solde négatif détecté{negativeCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={formatValue}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Ligne de référence à zéro */}
            <ReferenceLine y={0} stroke="#374151" strokeDasharray="2 2" />
            
            {/* Entrées d'argent */}
            <Line
              type="monotone"
              dataKey="incoming"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              name="Entrées"
            />
            
            {/* Sorties d'argent */}
            <Line
              type="monotone"
              dataKey="outgoing"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              name="Sorties"
            />
            
            {/* Solde cumulé */}
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              name="Solde"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistiques résumées */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{maxBalance.toLocaleString()}</div>
            <div className="text-xs text-green-700">Solde maximum</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-600">{minBalance.toLocaleString()}</div>
            <div className="text-xs text-red-700">Solde minimum</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{currentBalance.toLocaleString()}</div>
            <div className="text-xs text-blue-700">Solde actuel</div>
          </div>
        </div>
      </div>
    </div>
  );
}