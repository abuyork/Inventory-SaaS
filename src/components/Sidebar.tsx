import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  BarChart2, 
  Bell, 
  Settings 
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/alerts', icon: Bell, label: 'Alerts' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 pt-16">
      <nav className="p-4">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg mb-1 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}