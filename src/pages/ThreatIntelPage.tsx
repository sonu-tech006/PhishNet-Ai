import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldAlert, 
  Plus, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Tag, 
  Clock, 
  Info,
  X
} from 'lucide-react';
import { ThreatIndicatorItem } from '../types/index.js';
import { getThreatIntel, addThreatIndicator } from '../services/api.js';
import { toast } from '../components/common/Toast.js';

export const ThreatIntelPage: React.FC = () => {
  const [indicators, setIndicators] = useState<ThreatIndicatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState('domain');
  const [newValue, setNewValue] = useState('');
  const [newSeverity, setNewSeverity] = useState('high');
  const [newSource, setNewSource] = useState('Analyst Manual Feed');
  const [newDesc, setNewDesc] = useState('');

  const fetchIntel = () => {
    setLoading(true);
    getThreatIntel()
      .then(res => {
        setIndicators(res.indicators);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load threat intel:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIntel();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    try {
      await addThreatIndicator({
        type: newType,
        value: newValue.trim(),
        severity: newSeverity,
        source: newSource.trim() || 'Analyst Manual Entry',
        description: newDesc.trim() || 'Reported phishing indicator'
      });
      setShowAddModal(false);
      setNewValue('');
      setNewDesc('');
      fetchIntel();
      toast('Threat intelligence indicator registered in MongoDB Atlas.', 'success');
    } catch (err: any) {
      toast('Failed to add indicator: ' + err.message, 'error');
    }
  };

  const filtered = indicators.filter(item => {
    const matchesSearch = item.value.toLowerCase().includes(search.toLowerCase()) ||
                          item.source.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Threat Intelligence & Indicator Feeds
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Normalized IOC (Indicators of Compromise) repository synchronized with public phishing databases and SOC analyst intelligence.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Threat Indicator</span>
        </button>
      </div>

      {/* Advisory Banner */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg text-xs text-[#475569] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#4169E1] shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-[#172033]">
            Threat Feed Integration Architecture
          </p>
          <p className="mt-0.5 leading-relaxed">
            PhishNet AI differentiates deterministic blacklist feed matches from machine learning feature probabilities. 
            Indicators are queried locally against deduplicated indices to protect user privacy and avoid server-side request forgery (SSRF).
          </p>
        </div>
      </div>

      {/* Search & Type Filter */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search indicators by domain, IP, sender or source..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B] font-medium">Type:</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#172033] rounded-md px-2.5 py-2 focus:outline-hidden"
          >
            <option value="all">All IOC Types</option>
            <option value="domain">Domain Names</option>
            <option value="ip">IP Addresses</option>
            <option value="sender_email">Sender Emails</option>
            <option value="url">Specific URLs</option>
          </select>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => {
          const isCritical = item.severity === 'critical';
          return (
            <div 
              key={item.id} 
              className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs hover:border-[#4169E1]/50 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-[#64748B] uppercase font-semibold">
                    <span className="font-mono">{item.type}</span>
                    <span>·</span>
                    <span className={isCritical ? 'text-red-600' : 'text-amber-600'}>
                      {item.severity} severity
                    </span>
                  </div>
                  <h3 className="font-mono font-bold text-xs text-[#172033] mt-1 truncate">
                    {item.value}
                  </h3>
                </div>

                <span className="text-[10px] font-mono text-[#4169E1] bg-[#F1F5F9] px-2 py-0.5 rounded-sm shrink-0">
                  {item.matchedCount} hits
                </span>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 border-t border-[#F8FAFC] flex items-center justify-between text-[11px] text-[#64748B]">
                <span className="truncate">Source: <strong className="text-[#334155]">{item.source}</strong></span>
                <span className="font-mono text-[10px] shrink-0">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Indicator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-bold text-sm text-[#172033]">Add Threat Intelligence IOC</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#64748B] hover:text-[#172033]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-[#172033] block mb-1">Indicator Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033]"
                  >
                    <option value="domain">Domain Name</option>
                    <option value="ip">IP Address</option>
                    <option value="sender_email">Sender Email</option>
                    <option value="url">URL Pattern</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-[#172033] block mb-1">Severity Tier</label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033]"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-[#172033] block mb-1">Indicator Value <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. malphish-auth.xyz or 194.26.29.112"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md font-mono text-[#172033]"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-[#172033] block mb-1">Threat Source Feed</label>
                <input
                  type="text"
                  placeholder="e.g. Internal SOC Triage or APWG"
                  value={newSource}
                  onChange={e => setNewSource(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033]"
                />
              </div>

              <div>
                <label className="font-medium text-[#172033] block mb-1">Context / Campaign Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe campaign tactics, target brand, or delivery mechanism..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-[#64748B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-semibold rounded-md"
                >
                  Save Indicator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
