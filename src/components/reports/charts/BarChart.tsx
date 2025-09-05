import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarData {
  name: string;
  value: number;
  debt?: number;
  color: string;
}

interface CustomBarChartProps {
  data: BarData[];
  title: string;
  subtitle: string;
  type?: 'clients' | 'suppliers';
  orientation?: 'vertical' | 'horizontal';
}

export default function CustomBarChart({ 
  data, 
  title, 
  subtitle, 
  type = 'clients',
  orientation = 'vertical' 
}: CustomBarChartProps) {
  const [activeBar, setActiveBar] = useState<number | null>(null);

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
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Montant payé:</span>
              <span className="font-medium text-green-600">{data.value.toLocaleString()} MAD</span>
            </div>
            {data.debt !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dette en cours:</span>
                <span className="font-medium text-red-600">{data.debt.toLocaleString()} MAD</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            {orientation === 'horizontal' ? (
              <>
                <XAxis type="number" tickFormatter={formatValue} stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={100} />
              </>
            ) : (
              <>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={formatValue} stroke="#64748b" fontSize={12} />
              </>
            )}
            <Tooltip content={<CustomTooltip />} />
            
            <Bar 
              dataKey="value" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              onMouseEnter={(_, index) => setActiveBar(index)}
              onMouseLeave={() => setActiveBar(null)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activeBar === index ? '#1d4ed8' : entry.color}
                />
              ))}
            </Bar>
            
            {/* Barre pour les dettes si applicable */}
            {data.some(d => d.debt !== undefined) && (
              <Bar 
                dataKey="debt" 
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                opacity={0.7}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Montant payé</span>
        </div>
        {data.some(d => d.debt !== undefined) && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Dette en cours</span>
          </div>
        )}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      )}
    </div>
  );
}