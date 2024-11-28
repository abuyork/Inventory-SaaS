import React from 'react';
import { Bell, Users, Database, Shield } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-full">
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-gray-500">Get notified when items are low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Expiration Alerts</p>
                <p className="text-sm text-gray-500">Get notified about expiring items</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-full">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold">User Management</h3>
          </div>
          <div className="space-y-4">
            <button className="btn-primary w-full">Manage Team Members</button>
            <button className="btn-secondary w-full">View Access Logs</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-full">
              <Database className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold">Data Management</h3>
          </div>
          <div className="space-y-4">
            <button className="btn-primary w-full">Export Data</button>
            <button className="btn-secondary w-full">Backup Settings</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-full">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold">Security</h3>
          </div>
          <div className="space-y-4">
            <button className="btn-primary w-full">Change Password</button>
            <button className="btn-secondary w-full">Two-Factor Authentication</button>
          </div>
        </div>
      </div>
    </div>
  );
}