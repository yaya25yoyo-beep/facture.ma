import React from 'react';
import { Calendar, TrendingUp, FileText, DollarSign } from 'lucide-react';

interface QuickSummaryData {
  period: string;
  invoicesCount: number;
  paidPercentage: number;
  revenue: number;
  growth: number;
  averageTicket: number;
  dso: number;
}

interface QuickSummaryWidgetProps {
  data: QuickSummaryData;
  className?: string;
}

export default function QuickSummaryWidget({ data, className = '' }: QuickSummaryWidgetProps) {
  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4" />;
    if (growth < 0) return <TrendingUp className="w-4 h-4 rotate-180" />;
    return <TrendingUp className="w-4 h-4 text-gray-400" />;
  };

  const getPaidPercentageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Synthèse Rapide</h3>
          <p className="text-sm text-blue-700">{data.period}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Nombre de factures */}
        <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{data.invoicesCount}</span>
          </div>
          <p className="text-xs text-gray-600">Factures</p>
        </div>

        {/* Pourcentage payé */}
        <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <span className={`text-2xl font-bold ${getPaidPercentageColor(data.paidPercentage)}`}>
              {data.paidPercentage.toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-gray-600">Payées</p>
        </div>

        {/* Chiffre d'affaires */}
        <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-lg font-bold text-gray-900">
              {data.revenue >= 1000000 
                ? `${(data.revenue / 1000000).toFixed(1)}M`
                : data.revenue >= 1000 
                  ? `${(data.revenue / 1000).toFixed(0)}K`
                  : data.revenue.toLocaleString()
              }
            </span>
          </div>
          <p className="text-xs text-gray-600">MAD CA</p>
        </div>

        {/* Croissance */}
        <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-1 mb-1">
            {getGrowthIcon(data.growth)}
            <span className={`text-lg font-bold ${getGrowthColor(data.growth)}`}>
              {data.growth >= 0 ? '+' : ''}{data.growth.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-600">vs précédent</p>
        </div>
      </div>

      {/* Métriques supplémentaires */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Panier moyen:</span>
            <span className="font-medium text-gray-900">{data.averageTicket.toLocaleString()} MAD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">DSO:</span>
            <span className={`font-medium ${
              data.dso <= 30 ? 'text-green-600' : 
              data.dso <= 45 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {data.dso.toFixed(0)} jours
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}