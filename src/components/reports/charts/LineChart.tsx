import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface LineChartData {
  month: string;
  currentYear: number;
  previousYear: number;
  growth: number;
}

interface CustomLineChartProps {
  data: LineChartData[];
  title: string;
  subtitle: string;
  type?: 'line' | 'area';
}

export default function CustomLineChart({ data, title, subtitle, type = 'area' }: CustomLineChartProps) {
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
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="font-medium">{entry.value.toLocaleString()} MAD</span>
            </div>
          ))}
          {payload[0]?.payload?.growth !== undefined && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <span className={`text-sm font-medium ${
                payload[0].payload.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {payload[0].payload.growth >= 0 ? '+' : ''}{payload[0].payload.growth.toFixed(1)}% vs année précédente
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = type === 'area' ? AreaChart : LineChart;

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
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
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
            
            {type === 'area' ? (
              <>
                <defs>
                  <linearGradient id="currentYearGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="previousYearGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="currentYear"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#currentYearGradient)"
                  name="Année actuelle"
                />
                <Area
                  type="monotone"
                  dataKey="previousYear"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#previousYearGradient)"
                  name="Année précédente"
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="currentYear"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  name="Année actuelle"
                />
                <Line
                  type="monotone"
                  dataKey="previousYear"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#64748b', strokeWidth: 2, r: 3 }}
                  name="Année précédente"
                />
              </>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Année actuelle</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Année précédente</span>
        </div>
      </div>
    </div>
  );
}