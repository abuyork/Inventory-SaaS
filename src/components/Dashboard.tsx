import { TrendingDown, TrendingUp, AlertTriangle, Package } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Items',
      value: '486',
      change: '+2.5%',
      trend: 'up',
      icon: Package
    },
    {
      title: 'Low Stock Items',
      value: '12',
      change: '-4',
      trend: 'down',
      icon: TrendingDown
    },
    {
      title: 'Alerts',
      value: '8',
      change: '+3',
      trend: 'up',
      icon: AlertTriangle
    },
    {
      title: 'Monthly Costs',
      value: '$24,380',
      change: '+12.3%',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className={`text-sm mt-1 ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.trend === 'up' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}