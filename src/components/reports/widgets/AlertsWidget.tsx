import React from 'react';
import { AlertTriangle, Clock, TrendingDown, Users, FileText } from 'lucide-react';

interface Alert {
  id: string;
  type: 'overdue' | 'low_recovery' | 'late_payment' | 'cashflow';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  value?: string;
  action?: string;
}

interface AlertsWidgetProps {
  alerts: Alert[];
  onAlertAction?: (alertId: string, action: string) => void;
}

export default function AlertsWidget({ alerts, onAlertAction }: AlertsWidgetProps) {
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'overdue':
        return <Clock className="w-5 h-5" />;
      case 'low_recovery':
        return <TrendingDown className="w-5 h-5" />;
      case 'late_payment':
        return <Users className="w-5 h-5" />;
      case 'cashflow':
        return <FileText className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const priorityAlerts = alerts.filter(alert => alert.severity === 'high');
  const otherAlerts = alerts.filter(alert => alert.severity !== 'high');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Alertes Financières</h3>
          <p className="text-sm text-gray-600">
            {alerts.length} alerte{alerts.length > 1 ? 's' : ''} active{alerts.length > 1 ? 's' : ''}
          </p>
        </div>
        
        {priorityAlerts.length > 0 && (
          <div className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{priorityAlerts.length} prioritaire{priorityAlerts.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Alertes prioritaires */}
        {priorityAlerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} border-l-red-500`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getSeverityIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  {alert.value && (
                    <p className="text-sm font-medium text-gray-900">{alert.value}</p>
                  )}
                </div>
              </div>
              
              {alert.action && onAlertAction && (
                <button
                  onClick={() => onAlertAction(alert.id, alert.action!)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {alert.action}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Autres alertes */}
        {otherAlerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getSeverityIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  {alert.value && (
                    <p className="text-sm font-medium text-gray-900 mt-1">{alert.value}</p>
                  )}
                </div>
              </div>
              
              {alert.action && onAlertAction && (
                <button
                  onClick={() => onAlertAction(alert.id, alert.action!)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {alert.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Tout va bien !</h4>
          <p className="text-gray-600">Aucune alerte financière détectée</p>
        </div>
      )}
    </div>
  );
}