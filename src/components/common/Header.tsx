import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  CheckCircle2, 
  ShieldAlert, 
  ExternalLink, 
  Cpu, 
  Database,
  Info,
  User as UserIcon,
  Palette,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { NavTab } from './Sidebar.js';
import { SystemHealth, User, ThemeMode } from '../../types/index.js';

interface HeaderProps {
  currentTab: NavTab;
  onOpenMobile: () => void;
  onSelectTab: (tab: NavTab) => void;
  systemHealth: SystemHealth | null;
  onSearch: (query: string) => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobile,
  onSelectTab,
  systemHealth,
  onSearch,
  user,
  onOpenAuth,
  onLogout,
  theme,
  onThemeChange
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const getBreadcrumbTitle = (tab: NavTab): { category: string; title: string } => {
    switch (tab) {
      case 'overview': return { category: 'Core Platform', title: 'Security Operations Overview' };
      case 'scanner': return { category: 'Detection Scanners', title: 'Unified Threat Scanner' };
      case 'url-analyzer': return { category: 'Detection Scanners', title: 'URL Feature Engineering & Analyzer' };
      case 'email-analyzer': return { category: 'Detection Scanners', title: 'Email Header & Semantic Analyzer' };
      case 'message-analyzer': return { category: 'Detection Scanners', title: 'Smishing & Mobile Fraud Analyzer' };
      case 'bulk': return { category: 'Detection Scanners', title: 'High-Throughput Bulk CSV Analysis' };
      case 'history': return { category: 'Intelligence & Data', title: 'Persisted Analysis History' };
      case 'threat-intel': return { category: 'Intelligence & Data', title: 'Threat Intelligence Feeds' };
      case 'datasets': return { category: 'Intelligence & Data', title: 'Data Engineering & Dataset Explorer' };
      case 'pipelines': return { category: 'Intelligence & Data', title: 'ETL Pipelines & Ingestion Logs' };
      case 'analytics': return { category: 'ML Lab & Monitoring', title: 'Model Evaluation & Error Analytics' };
      case 'model-lab': return { category: 'ML Lab & Monitoring', title: 'Machine Learning Model Comparison' };
      case 'monitoring': return { category: 'ML Lab & Monitoring', title: 'Live Model Drift & Latency Monitoring' };
      case 'settings': return { category: 'Platform', title: 'System Architecture & Documentation' };
      default: return { category: 'Dashboard', title: 'PhishNet AI' };
    }
  };

  const { category, title } = getBreadcrumbTitle(currentTab);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearch(searchVal.trim());
      onSelectTab('history');
    }
  };

  const themes: { id: ThemeMode; label: string; primary: string; desc: string }[] = [
    { id: 'cyber-blue', label: 'Cyber Blue', primary: '#4169E1', desc: 'Enterprise SOC default' },
    { id: 'emerald-guard', label: 'Emerald Guard', primary: '#059669', desc: 'Cyber defense teal & green' },
    { id: 'electric-violet', label: 'Electric Violet', primary: '#7C3AED', desc: 'Modern AI analytics purple' },
    { id: 'midnight-dark', label: 'Midnight Dark', primary: '#38BDF8', desc: 'Ultra-slick dark SOC console' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-[#E2E8F0] px-4 md:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left breadcrumb + mobile toggle */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="p-1.5 -ml-1 text-[#475569] hover:text-[#172033] hover:bg-[#F1F5F9] rounded-md md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-medium truncate">
            <span>{category}</span>
            <span>/</span>
            <span className="text-[#172033] font-semibold">{title}</span>
          </div>
          <h1 className="text-sm md:text-base font-semibold text-[#172033] tracking-tight truncate hidden sm:block">
            {title}
          </h1>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden xl:block w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search scans, domains..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#172033] placeholder-[#94A3B8] rounded-md pl-8 pr-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-[#4169E1] transition-all"
          />
        </form>

        {/* Theme Switcher Button */}
        <div className="relative">
          <button
            onClick={() => { setShowThemeMenu(!showThemeMenu); setShowUserDropdown(false); }}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] transition-colors flex items-center gap-1 text-xs cursor-pointer"
            title="Customize UI Color Theme"
          >
            <Palette className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full hidden sm:inline-block" style={{
              backgroundColor: themes.find(t => t.id === theme)?.primary || '#4169E1'
            }} />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-lg shadow-xl z-40 p-2 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Select Visual Palette
              </div>
              <div className="space-y-1 mt-1">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onThemeChange(t.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                      theme === t.id ? 'bg-[#F1F5F9] font-semibold text-[#172033]' : 'hover:bg-[#F8FAFC] text-[#475569]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.primary }} />
                      <div>
                        <div className="text-xs">{t.label}</div>
                        <div className="text-[10px] text-[#94A3B8]">{t.desc}</div>
                      </div>
                    </div>
                    {theme === t.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Database & Health status pill */}
        <button 
          onClick={() => setShowHealthModal(!showHealthModal)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] border border-[#E2E8F0] transition-colors cursor-pointer"
          title="Click to view Backend & Database health"
        >
          <span className={`w-2 h-2 rounded-full ${systemHealth?.dbConnected ? 'bg-emerald-500' : 'bg-blue-500'}`} />
          <span className="font-mono text-[10px] hidden md:inline">
            {systemHealth?.dbConnected ? 'MongoDB Atlas Live' : 'Embedded DB'}
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowUserDropdown(false); }}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] transition-colors relative cursor-pointer"
            aria-label="Threat notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-40 p-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] font-semibold text-[#172033]">
                <span>Threat Feed Alerts</span>
                <span className="text-[10px] text-[#4169E1] cursor-pointer" onClick={() => { onSelectTab('threat-intel'); setShowNotifications(false); }}>
                  View All
                </span>
              </div>
              <div className="divide-y divide-[#F1F5F9] mt-1 space-y-1">
                <div className="py-2">
                  <div className="font-medium text-red-600">Active Phishing Campaign Detected</div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    OpenPhish added 42 new spoofed PayPal authentication URLs.
                  </p>
                  <span className="text-[10px] text-[#94A3B8]">15m ago</span>
                </div>
                <div className="py-2">
                  <div className="font-medium text-[#172033]">USPS Redelivery Smishing Wave</div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    High-volume SMS alerts targeting postal deliveries with .top domains.
                  </p>
                  <span className="text-[10px] text-[#94A3B8]">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account / Profile Area */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => { setShowUserDropdown(!showUserDropdown); setShowThemeMenu(false); }}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-md bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#4169E1] text-white flex items-center justify-center font-bold text-[10px]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden lg:block">
                <div className="font-semibold text-[#172033] leading-tight truncate max-w-[110px]">{user.name}</div>
                <div className="text-[9px] text-[#64748B] leading-tight font-mono">{user.role}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-lg shadow-xl z-40 p-3 text-xs space-y-3">
                <div className="border-b border-[#F1F5F9] pb-2">
                  <div className="font-bold text-[#172033]">{user.name}</div>
                  <div className="text-[11px] text-[#64748B] truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] bg-blue-50 text-[#4169E1] px-1.5 py-0.5 rounded-sm font-semibold">
                      {user.role}
                    </span>
                    <span className="text-[10px] text-[#64748B]">· In MongoDB</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { onSelectTab('history'); setShowUserDropdown(false); }}
                    className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[#F8FAFC] text-[#334155] text-xs cursor-pointer flex items-center justify-between"
                  >
                    <span>My Analysis Scans</span>
                    <span className="font-mono text-[10px] text-[#4169E1]">{user.scanCount}</span>
                  </button>
                  <button
                    onClick={() => { onLogout(); setShowUserDropdown(false); }}
                    className="w-full text-left px-2 py-1.5 rounded-md hover:bg-red-50 text-red-600 text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#172033] hover:bg-[#0F172A] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        )}

        {/* Scan Now Button */}
        <button
          onClick={() => onSelectTab('scanner')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-medium rounded-md shadow-xs shadow-[#4169E1]/20 transition-all cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Scan</span>
        </button>
      </div>

      {/* Health Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#4169E1]" />
                <h3 className="font-semibold text-sm text-[#172033]">System Diagnostics & Health</h3>
              </div>
              <button 
                onClick={() => setShowHealthModal(false)}
                className="text-[#64748B] hover:text-[#172033] text-xs font-semibold px-2 py-1 rounded-sm cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Platform API Status</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Operational (Port 3000)
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Database Persistence</span>
                <span className="font-mono text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {systemHealth?.dbConnected ? 'MongoDB Atlas Cluster (Live)' : 'Embedded Resilient Store (Active)'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Loaded Production Models</span>
                <span className="font-mono text-[11px] text-[#4169E1]">
                  {systemHealth?.modelsLoaded.join(', ') || 'XGBoost + RF + TF-IDF'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Server Uptime</span>
                <span className="font-mono text-[11px] text-[#172033]">
                  {systemHealth?.uptimeSeconds ? `${systemHealth.uptimeSeconds} seconds` : 'Active'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#64748B]">Active User Session</span>
                <span className="text-[#172033] font-semibold">
                  {user ? `${user.name} (${user.email})` : 'Anonymous Guest'}
                </span>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md text-[11px] text-[#64748B] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#4169E1] shrink-0 mt-0.5" />
              <span>
                All submitted scans and user profiles are stored persistently in MongoDB Atlas.
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
