import { AlertTriangle, TrendingDown, Clock } from 'lucide-react';

export default function AlertsView() {
  const alerts = [
    {
      id: 1,
      type: 'low-stock',
      title: 'Low Stock Alert',
      message: 'Tomatoes are below reorder point (5kg remaining)',
      timestamp: new Date(),
      priority: 'high'
    },
    {
      id: 2,
      type: 'expiration',
      title: 'Expiration Warning',
      message: 'Chicken breast expires in 2 days',
      timestamp: new Date(),
      priority: 'medium'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low-stock':
        return <TrendingDown className="w-5 h-5" />;
      case 'expiration':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-500';
      case 'medium':
        return 'bg-yellow-50 text-yellow-500';
      default:
        return 'bg-blue-50 text-blue-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Alerts</h2>
        <div className="flex gap-3">
          <select className="input-primary">
            <option>All Alerts</option>
            <option>Low Stock</option>
            <option>Expiration</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${getPriorityColor(alert.priority)}`}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                    <p className="text-gray-600 mt-1">{alert.message}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="btn-primary text-sm py-1">Take Action</button>
                  <button className="btn-secondary text-sm py-1">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}