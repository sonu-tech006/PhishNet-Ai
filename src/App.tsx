import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/common/Sidebar.js';
import { Header } from './components/common/Header.js';
import { SystemHealth, AnalysisResult, User, ThemeMode } from './types/index.js';
import { checkSystemHealth, getCurrentUser, removeAuthToken } from './services/api.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { ToastContainer, toast } from './components/common/Toast.js';

// Pages
import { LandingPage } from './pages/LandingPage.js';
import { OverviewPage } from './pages/OverviewPage.js';
import { ThreatScannerPage } from './pages/ThreatScannerPage.js';
import { UrlAnalyzerPage } from './pages/UrlAnalyzerPage.js';
import { EmailAnalyzerPage } from './pages/EmailAnalyzerPage.js';
import { MessageAnalyzerPage } from './pages/MessageAnalyzerPage.js';
import { BulkAnalysisPage } from './pages/BulkAnalysisPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { ThreatIntelPage } from './pages/ThreatIntelPage.js';
import { AnalyticsReportsPage } from './pages/AnalyticsReportsPage.js';
import { DatasetExplorerPage } from './pages/DatasetExplorerPage.js';
import { DataPipelinesPage } from './pages/DataPipelinesPage.js';
import { ModelLabPage } from './pages/ModelLabPage.js';
import { ModelMonitoringPage } from './pages/ModelMonitoringPage.js';
import { SettingsAboutPage } from './pages/SettingsAboutPage.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab | 'landing'>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('phishnet_theme');
    return (saved as ThemeMode) || 'cyber-blue';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('phishnet_theme', theme);
  }, [theme]);

  // Load authenticated user on startup
  useEffect(() => {
    getCurrentUser()
      .then((currUser) => {
        if (currUser) {
          setUser(currUser);
        }
      })
      .catch((err) => {
        console.warn('Initial session check:', err.message);
      });
  }, []);

  // System Health Polling
  useEffect(() => {
    const fetchHealth = () => {
      checkSystemHealth()
        .then(setSystemHealth)
        .catch(err => {
          console.warn('System health polling warning:', err.message);
        });
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    toast('You have been signed out safely.', 'info');
  };

  const handleOpenAnalysis = (scan: AnalysisResult) => {
    setActiveAnalysis(scan);
    setCurrentTab('scanner');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentTab('history');
  };

  // If on landing page
  if (currentTab === 'landing') {
    return (
      <>
        <LandingPage onEnterApp={(tab) => setCurrentTab(tab || 'overview')} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#172033]">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab as NavTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'scanner') {
            setActiveAnalysis(null);
          }
        }}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        dbConnected={systemHealth?.dbConnected ?? false}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <Header
          currentTab={currentTab as NavTab}
          onOpenMobile={() => setMobileOpen(true)}
          onSelectTab={(tab) => setCurrentTab(tab)}
          systemHealth={systemHealth}
          onSearch={handleSearch}
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          theme={theme}
          onThemeChange={setTheme}
        />

        <main className="flex-1 pb-16">
          {currentTab === 'overview' && (
            <OverviewPage
              onSelectTab={(tab) => setCurrentTab(tab)}
              onOpenAnalysis={handleOpenAnalysis}
            />
          )}

          {currentTab === 'scanner' && (
            <ThreatScannerPage initialResult={activeAnalysis} />
          )}

          {currentTab === 'url-analyzer' && <UrlAnalyzerPage />}
          {currentTab === 'email-analyzer' && <EmailAnalyzerPage />}
          {currentTab === 'message-analyzer' && <MessageAnalyzerPage />}
          {currentTab === 'bulk' && <BulkAnalysisPage />}
          {currentTab === 'history' && (
            <HistoryPage
              initialSearch={searchQuery}
              onOpenAnalysis={handleOpenAnalysis}
            />
          )}
          {currentTab === 'threat-intel' && <ThreatIntelPage />}
          {currentTab === 'analytics' && <AnalyticsReportsPage />}
          {currentTab === 'datasets' && <DatasetExplorerPage />}
          {currentTab === 'pipelines' && <DataPipelinesPage />}
          {currentTab === 'model-lab' && <ModelLabPage />}
          {currentTab === 'monitoring' && <ModelMonitoringPage />}
          {currentTab === 'settings' && (
            <SettingsAboutPage systemHealth={systemHealth} />
          )}
        </main>
      </div>

      {/* Auth Modal for Login / Signup */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(loggedInUser) => setUser(loggedInUser)}
      />

      {/* Modern Non-blocking Notification Toasts */}
      <ToastContainer />
    </div>
  );
}
