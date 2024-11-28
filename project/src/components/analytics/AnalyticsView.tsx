import { useState } from 'react';
import { BarChart as BarChartIcon, Calendar, DollarSign, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { format, subDays } from 'date-fns';

// Add these interfaces at the top of the file
interface ChartData {
  date: string;
  usage?: number;
  waste?: number;
  cost?: number;
  budget?: number;
  expiring?: number;
  expired?: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    color: string;
  }[];
  label?: string;
  prefix?: string;
  suffix?: string;
}

// Sample data - in a real app, this would come from an API
const generateUsageData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'MMM d'),
    usage: Math.floor(Math.random() * 60) + 20,
    waste: Math.floor(Math.random() * 8) + 2,
  }));
};

const generateCostData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'MMM d'),
    cost: Math.floor(Math.random() * 800) + 400,
    budget: 800,
  }));
};

const generateExpirationData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'MMM d'),
    expiring: Math.floor(Math.random() * 15) + 5,
    expired: Math.floor(Math.random() * 10) + 2,
  }));
};

// Update the CustomTooltip component with proper types
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {prefix}{entry.value}{suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Update the exportData function with proper types
const exportData = (data: ChartData[], filename: string) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  const csv = [headers, ...rows].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState('7');
  const usageData = generateUsageData();
  const costData = generateCostData();
  const expirationData = generateExpirationData();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
        <div className="flex gap-3">
          <select 
            className="input-primary"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full">
                <BarChartIcon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">Usage Trends</h3>
            </div>
            <button 
              onClick={() => exportData(usageData, 'usage-trends')}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Export data"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="h-64">
            <BarChart
              width={350}
              height={250}
              data={usageData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis domain={[0, 80]} stroke="#6B7280" />
              <Tooltip content={<CustomTooltip suffix=" units" />} />
              <Legend />
              <Bar dataKey="usage" fill="#60A5FA" name="Usage" />
              <Bar dataKey="waste" fill="#F87171" name="Waste" />
            </BarChart>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-full">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold">Cost Analysis</h3>
            </div>
            <button 
              onClick={() => exportData(costData, 'cost-analysis')}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Export data"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="h-64">
            <LineChart
              width={350}
              height={250}
              data={costData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis domain={[0, 1600]} stroke="#6B7280" />
              <Tooltip content={<CustomTooltip prefix="$" />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#10B981" 
                dot={{ fill: "#10B981" }}
                name="Daily Cost"
              />
              <Line 
                type="monotone" 
                dataKey="budget" 
                stroke="#9CA3AF" 
                strokeDasharray="5 5" 
                dot={false}
                name="Budget"
              />
            </LineChart>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-full">
                <Calendar className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold">Expiration Forecast</h3>
            </div>
            <button 
              onClick={() => exportData(expirationData, 'expiration-forecast')}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Export data"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="h-64">
            <AreaChart
              width={350}
              height={250}
              data={expirationData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis domain={[0, 28]} stroke="#6B7280" />
              <Tooltip content={<CustomTooltip suffix=" items" />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="expiring" 
                stackId="1"
                stroke="#8B5CF6" 
                fill="#DDD6FE"
                name="Expiring Soon"
              />
              <Area 
                type="monotone" 
                dataKey="expired" 
                stackId="1"
                stroke="#EF4444" 
                fill="#FCA5A5"
                name="Expired"
              />
            </AreaChart>
          </div>
        </div>
      </div>
    </div>
  );
}