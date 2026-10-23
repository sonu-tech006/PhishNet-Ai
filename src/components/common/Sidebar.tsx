import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  Link2, 
  Mail, 
  MessageSquare, 
  Layers, 
  History, 
  Database, 
  Cpu, 
  Activity, 
  Sliders, 
  FileText, 
  BarChart3, 
  HelpCircle,
  GitBranch,
  X
} from 'lucide-react';

export type NavTab = 
  | 'overview'
  | 'scanner'
  | 'url-analyzer'
  | 'email-analyzer'
  | 'message-analyzer'
  | 'bulk'
  | 'history'
  | 'threat-intel'
  | 'analytics'
  | 'datasets'
  | 'pipelines'
  | 'model-lab'
  | 'monitoring'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  dbConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  dbConnected
}) => {
  const navSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'overview', label: 'Overview', icon: BarChart3 }
      ]
    },
    {
      title: 'DETECTION SCANNERS',
      items: [
        { id: 'scanner', label: 'Threat Scanner', icon: ShieldAlert, badge: 'Unified' },
        { id: 'url-analyzer', label: 'URL Analyzer', icon: Link2 },
        { id: 'email-analyzer', label: 'Email Analyzer', icon: Mail },
        { id: 'message-analyzer', label: 'SMS & Message', icon: MessageSquare },
        { id: 'bulk', label: 'Bulk CSV Batch', icon: Layers }
      ]
    },
    {
      title: 'INTELLIGENCE & DATA',
      items: [
        { id: 'history', label: 'Analysis History', icon: History },
        { id: 'threat-intel', label: 'Threat Intelligence', icon: Search },
        { id: 'datasets', label: 'Dataset Explorer', icon: Database },
        { id: 'pipelines', label: 'Data Pipelines', icon: GitBranch }
      ]
    },
    {
      title: 'ML LAB & MONITORING',
      items: [
        { id: 'analytics', label: 'Analytics & Reports', icon: FileText },
        { id: 'model-lab', label: 'Model Evaluation Lab', icon: Cpu },
        { id: 'monitoring', label: 'Model Monitoring', icon: Activity },
        { id: 'settings', label: 'Settings & Architecture', icon: Sliders }
      ]
    }
  ];

  const handleNavClick = (tabId: NavTab) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-[#E2E8F0] select-none">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('overview')}>
          <div className="w-9 h-9 rounded-lg bg-[#4169E1] flex items-center justify-center text-white shadow-sm shadow-[#4169E1]/30">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] tracking-tight text-[#172033]">PhishNet</span>
              <span className="text-[11px] font-semibold text-[#4169E1] tracking-wider uppercase">AI</span>
            </div>
            <p className="text-[11px] text-[#64748B]">B.Tech Final Year CS Project</p>
          </div>
        </div>
        {mobileOpen && (
          <button 
            onClick={onCloseMobile}
            className="p-1 rounded-md text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] md:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((sec, idx) => (
          <div key={idx}>
            <div className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase">
              {sec.title}
            </div>
            <div className="space-y-0.5">
              {sec.items.map(item => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as NavTab)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                      active 
                        ? 'bg-[#4169E1]/10 text-[#4169E1] font-semibold' 
                        : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#172033]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#4169E1]' : 'text-[#64748B]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-medium text-[#0F9D92]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Engine & DB Status Footer */}
      <div className="p-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1.5">
          <span className="font-medium text-[#334155]">System Engine</span>
          <span className="font-mono text-[10px] text-[#475569]">v2.4.1</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#64748B]">Database Mode</span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium">
            <span className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            <span className={dbConnected ? 'text-emerald-700' : 'text-blue-700'}>
              {dbConnected ? 'MongoDB' : 'Embedded DB'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 z-20">
        {content}
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 w-72 z-50 transform md:hidden transition-transform duration-200 ease-in-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {content}
      </div>
    </>
  );
};
