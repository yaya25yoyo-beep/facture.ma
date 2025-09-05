import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from 'lucide-react';

interface KPIData {
  label: string;
  value: string | number;
  previousValue?: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  status?: 'good' | 'warning' | 'danger';
  target?: number;
}

interface KPIWidgetProps {
  title: string;
  kpis: KPIData[];
  className?: string;
}

export default function KPIWidget({ title, kpis, className = '' }: KPIWidgetProps) {
  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status?: 'good' | 'warning' | 'danger') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'danger':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: 'good' | 'warning' | 'danger') => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, index) => (
          <div 
            key={index}
            className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{kpi.label}</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(kpi.status)}
                {getTrendIcon(kpi.trend)}
              </div>
            </div>
            
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-bold ${getStatusColor(kpi.status)}`}>
                {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
              </span>
              {kpi.unit && (
                <span className="text-sm text-gray-500">{kpi.unit}</span>
              )}
            </div>
            
            {kpi.trendValue !== undefined && (
              <div className={`text-sm mt-1 ${
                kpi.trend === 'up' ? 'text-green-600' : 
                kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {kpi.trendValue >= 0 ? '+' : ''}{kpi.trendValue.toFixed(1)}% vs précédent
              </div>
            )}
            
            {kpi.target !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Objectif: {kpi.target.toLocaleString()}</span>
                  <span>
                    {typeof kpi.value === 'number' && kpi.target > 0 
                      ? `${((kpi.value / kpi.target) * 100).toFixed(0)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      typeof kpi.value === 'number' && kpi.value >= kpi.target 
                        ? 'bg-green-500' 
                        : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, typeof kpi.value === 'number' && kpi.target > 0 
                        ? (kpi.value / kpi.target) * 100 
                        : 0
                      )}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}