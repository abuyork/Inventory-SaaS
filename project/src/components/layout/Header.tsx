import UserMenu from '../common/UserMenu';
import { Bell, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 bg-white border-b border-gray-200 z-50">
      <div className="flex justify-between items-center px-6 py-3">
        <h1 className="text-xl font-semibold text-gray-900 min-w-[200px]">StockSense</h1>
        
        <div className="flex-1 max-w-xl px-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search inventory..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400 text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 min-w-[200px] justify-end">
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
} 