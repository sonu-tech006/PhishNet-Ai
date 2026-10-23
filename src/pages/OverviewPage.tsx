import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  Link2, 
  Mail, 
  MessageSquare, 
  Layers, 
  Cpu, 
  GitBranch, 
  Database,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { OverviewMetrics, AnalysisResult } from '../types/index.js';
import { getOverviewMetrics } from '../services/api.js';
import { NavTab } from '../components/common/Sidebar.js';

interface OverviewPageProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenAnalysis: (scan: AnalysisResult) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onSelectTab, onOpenAnalysis }) => {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverviewMetrics()
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load overview metrics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-28 bg-white border border-[#E2E8F0] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-white border border-[#E2E8F0] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Scanned Items',
      value: metrics?.totalScans || 0,
      sub: 'Across URLs, Emails & SMS',
      icon: Layers,
      color: 'text-[#4169E1]',
      bg: 'bg-blue-50'
    },
    {
      label: 'High-Risk Threats Blocked',
      value: metrics?.highRiskCount || 0,
      sub: `${metrics?.totalScans ? Math.round(((metrics.highRiskCount || 0) / metrics.totalScans) * 100) : 0}% of scanned volume`,
      icon: ShieldAlert,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      label: 'Clean / Low-Risk Items',
      value: metrics?.lowRiskCount || 0,
      sub: 'Verified benign patterns',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Average Model Latency',
      value: `${metrics?.avgLatencyMs || 12.4} ms`,
      sub: 'XGBoost + RF multi-signal',
      icon: Clock,
      color: 'text-[#0F9D92]',
      bg: 'bg-teal-50'
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-[#4169E1] uppercase tracking-wider">
              Security Operations Center
            </span>
            <span className="text-[#94A3B8]">·</span>
            <span className="text-[11px] text-[#64748B] font-mono">XGBoost v2.4.1 Active</span>
          </div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            PhishNet AI Threat Monitoring & Analytics
          </h2>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Multi-signal machine learning detection engine for URLs, suspicious emails, and smishing scams. Built with reproducible feature engineering pipelines, SHAP explainability, and persistent MongoDB threat analytics.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('scanner')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-medium rounded-md shadow-xs transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Unified Scanner</span>
          </button>
          <button
            onClick={() => onSelectTab('bulk')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] text-xs font-medium rounded-md transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Bulk CSV Analysis</span>
          </button>
          <button
            onClick={() => onSelectTab('model-lab')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] text-xs font-medium rounded-md transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Model Lab</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#64748B]">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-md ${kpi.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-[#172033] tracking-tight">{kpi.value}</div>
                <div className="text-[11px] text-[#64748B] mt-0.5">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Timeline */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#172033]">7-Day Threat Detection Activity</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Scanned items categorized by calibrated risk tier</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#EF4444] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> High Risk
              </span>
              <span className="flex items-center gap-1 text-[#F59E0B] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Medium
              </span>
              <span className="flex items-center gap-1 text-[#10B981] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Low Risk
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics?.scansOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '6px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="high" name="High Risk" stackId="1" stroke="#EF4444" fill="#FEE2E2" />
                <Area type="monotone" dataKey="medium" name="Medium Risk" stackId="1" stroke="#F59E0B" fill="#FEF3C7" />
                <Area type="monotone" dataKey="low" name="Low Risk" stackId="1" stroke="#10B981" fill="#D1FAE5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#172033]">Risk Category Distribution</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Classification proportions</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics?.riskDistribution || []}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                >
                  {(metrics?.riskDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '6px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-[#F1F5F9]">
            {(metrics?.riskDistribution || []).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-[#475569]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-[#172033] font-mono">{item.count} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Scanners Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => onSelectTab('url-analyzer')}
          className="bg-white border border-[#E2E8F0] rounded-lg p-4 hover:border-[#4169E1] transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-blue-50 text-[#4169E1] flex items-center justify-center">
                <Link2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#172033] group-hover:text-[#4169E1] transition-colors">
                  URL Feature Analyzer
                </h4>
                <p className="text-[11px] text-[#64748B]">Shannon entropy, punycode & shorteners</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#4169E1] transition-colors" />
          </div>
        </div>

        <div 
          onClick={() => onSelectTab('email-analyzer')}
          className="bg-white border border-[#E2E8F0] rounded-lg p-4 hover:border-[#4169E1] transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-teal-50 text-[#0F9D92] flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#172033] group-hover:text-[#0F9D92] transition-colors">
                  Email Impersonation Detector
                </h4>
                <p className="text-[11px] text-[#64748B]">Headers, urgency & brand spoofing</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F9D92] transition-colors" />
          </div>
        </div>

        <div 
          onClick={() => onSelectTab('message-analyzer')}
          className="bg-white border border-[#E2E8F0] rounded-lg p-4 hover:border-[#4169E1] transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-purple-50 text-[#7967D8] flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#172033] group-hover:text-[#7967D8] transition-colors">
                  Smishing & SMS Scam Filter
                </h4>
                <p className="text-[11px] text-[#64748B]">Parcel baits, OTP theft & wire fraud</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#7967D8] transition-colors" />
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Phishing Indicators & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Indicators */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#172033]">Most Prevalent Risk Indicators</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Top signals extracted across historical analysis runs</p>
            </div>
            <span className="text-[11px] text-[#4169E1] font-medium cursor-pointer" onClick={() => onSelectTab('analytics')}>
              View Analytics
            </span>
          </div>

          <div className="space-y-2.5">
            {(metrics?.topIndicators || []).map((ind, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#F1F5F9] text-[#64748B] text-[10px] font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-[#172033]">{ind.indicator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="capitalize text-[10px] text-[#64748B]">{ind.category}</span>
                  <span className="font-mono text-[11px] font-semibold text-[#4169E1] bg-[#F1F5F9] px-2 py-0.5 rounded-sm">
                    {ind.count} hits
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Analyses List */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#172033]">Recent Analysis Audits</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Persisted in database with calibrated probability</p>
            </div>
            <button
              onClick={() => onSelectTab('history')}
              className="text-[11px] text-[#4169E1] font-medium hover:underline flex items-center gap-0.5"
            >
              <span>Full History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {(metrics?.recentScans || []).map(scan => {
              const isHigh = scan.riskLevel === 'High Risk';
              const isMed = scan.riskLevel === 'Medium Risk';
              return (
                <div 
                  key={scan.id} 
                  onClick={() => onOpenAnalysis(scan)}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] px-2 rounded-md transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-xs text-[#172033] truncate">
                      {scan.displayTitle}
                    </div>
                    <div className="text-[10px] text-[#64748B] flex items-center gap-2 mt-0.5">
                      <span className="capitalize font-medium">{scan.inputType}</span>
                      <span>·</span>
                      <span className="font-mono text-[9px] truncate max-w-[120px]">{scan.inputHash.substring(0, 12)}...</span>
                      <span>·</span>
                      <span>{new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className={`font-mono font-bold text-xs ${
                        isHigh ? 'text-red-600' : (isMed ? 'text-amber-600' : 'text-emerald-600')
                      }`}>
                        {scan.riskScore}/100
                      </div>
                      <div className="text-[10px] text-[#64748B]">{scan.riskLevel}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
