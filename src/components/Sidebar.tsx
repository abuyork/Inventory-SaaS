import React from 'react';
import { LayoutDashboard, Clipboard, BarChart2, Bell, Settings } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
  currentView: string;
}

export default function Sidebar({ onNavigate, currentView }: Props) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', value: 'dashboard' },
    { icon: Clipboard, label: 'Inventory', value: 'inventory' },
    { icon: BarChart2, label: 'Analytics', value: 'analytics' },
    { icon: Bell, label: 'Alerts', value: 'alerts' },
    { icon: Settings, label: 'Settings', value: 'settings' }
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">StockSense</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.value}
            onClick={() => onNavigate(item.value)}
            className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              currentView === item.value ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}