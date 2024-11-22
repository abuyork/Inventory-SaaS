import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InventoryList from './components/inventory/InventoryList';
import AnalyticsView from './components/analytics/AnalyticsView';
import AlertsView from './components/alerts/AlertsView';
import SettingsView from './components/settings/SettingsView';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'inventory':
        return <InventoryList />;
      case 'analytics':
        return <AnalyticsView />;
      case 'alerts':
        return <AlertsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onNavigate={setCurrentView} currentView={currentView} />
      <div className="ml-64">
        <Header />
        <main className="pt-16">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;