import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProjectDetails } from './components/ProjectDetails';
import { ResearchSubmission } from './components/ResearchSubmission';
import { PayPerKnowledge } from './components/PayPerKnowledge';
import { WalletProvider } from './contexts/WalletContext';
import { NotificationProvider } from './contexts/NotificationContext';

type View = 'dashboard' | 'project' | 'research' | 'marketplace';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const navigateTo = (view: View, projectId?: string) => {
    setCurrentView(view);
    if (projectId) setSelectedProjectId(projectId);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'project':
        return (
          <ProjectDetails 
            projectId={selectedProjectId || ''} 
            onNavigate={navigateTo} 
          />
        );
      case 'research':
        return <ResearchSubmission onNavigate={navigateTo} />;
      case 'marketplace':
        return <PayPerKnowledge onNavigate={navigateTo} />;
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <WalletProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          <Header currentView={currentView} onNavigate={navigateTo} />
          <main className="container mx-auto px-4 py-8">
            {renderCurrentView()}
          </main>
        </div>
      </NotificationProvider>
    </WalletProvider>
  );
}

export default App;