import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Eye, 
  Link2, 
  Mail, 
  MessageSquare, 
  RefreshCw,
  Clock,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { AnalysisResult, RiskLevel } from '../types/index.js';
import { getAnalyses, deleteAnalysis } from '../services/api.js';
import { toast } from '../components/common/Toast.js';
import { RiskMeter } from '../components/scanner/RiskMeter.js';
import { ShapWaterfall } from '../components/scanner/ShapWaterfall.js';
import { FeatureTable } from '../components/scanner/FeatureTable.js';

interface HistoryPageProps {
  initialSearch?: string;
  onOpenAnalysis: (scan: AnalysisResult) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ initialSearch, onOpenAnalysis }) => {
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(initialSearch || '');
  const [inputType, setInputType] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');
  const [page, setPage] = useState(0);
  const pageSize = 15;

  // Selected for detail modal
  const [selectedScan, setSelectedScan] = useState<AnalysisResult | null>(null);

  const fetchItems = () => {
    setLoading(true);
    getAnalyses({
      search: search.trim() || undefined,
      inputType: inputType !== 'all' ? inputType : undefined,
      riskLevel: riskLevel !== 'all' ? riskLevel : undefined,
      limit: pageSize,
      offset: page * pageSize
    })
      .then(res => {
        setItems(res.items);
        setTotal(res.total);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching history:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [search, inputType, riskLevel, page]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteAnalysis(id);
      fetchItems();
      if (selectedScan?.id === id) {
        setSelectedScan(null);
      }
      toast('Analysis record removed from database.', 'info');
    } catch (err: any) {
      toast('Failed to delete: ' + err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    if (items.length === 0) return;
    const headers = ['id', 'inputType', 'displayTitle', 'inputHash', 'riskScore', 'riskLevel', 'confidence', 'createdAt'];
    const rows = items.map(i => [
      i.id,
      i.inputType,
      `"${i.displayTitle.replace(/"/g, '""')}"`,
      i.inputHash,
      i.riskScore,
      i.riskLevel,
      i.confidence,
      i.createdAt
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishnet_history_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Persisted Analysis History
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Cryptographically indexed scan history stored in MongoDB / embedded engine with SHA-256 content hashes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] rounded-md text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Export View to CSV</span>
          </button>
          <button
            onClick={() => fetchItems()}
            className="p-1.5 bg-white hover:bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-md text-xs transition-colors"
            title="Refresh history"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by URL, keyword, email subject, or SHA-256 hash..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-[#64748B]">
              <span className="font-medium text-[#334155]">Type:</span>
              <select
                value={inputType}
                onChange={e => { setInputType(e.target.value); setPage(0); }}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#172033] rounded-md px-2 py-1.5 focus:outline-hidden"
              >
                <option value="all">All Types</option>
                <option value="url">URLs</option>
                <option value="email">Emails</option>
                <option value="message">SMS / Messages</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs text-[#64748B]">
              <span className="font-medium text-[#334155]">Risk Tier:</span>
              <select
                value={riskLevel}
                onChange={e => { setRiskLevel(e.target.value); setPage(0); }}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#172033] rounded-md px-2 py-1.5 focus:outline-hidden"
              >
                <option value="all">All Risk Levels</option>
                <option value="High Risk">High Risk (70-100)</option>
                <option value="Medium Risk">Medium Risk (36-69)</option>
                <option value="Low Risk">Low Risk (0-35)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Inspected Subject / Target</th>
                <th className="px-4 py-3 font-semibold">Risk Score</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Model Confidence</th>
                <th className="px-4 py-3 font-semibold">Audit Timestamp</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#64748B]">
                    Loading persisted audit records...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#64748B]">
                    No analysis records found matching your filters.
                  </td>
                </tr>
              ) : (
                items.map(item => {
                  const isHigh = item.riskLevel === 'High Risk';
                  const isMed = item.riskLevel === 'Medium Risk';
                  let TypeIcon = Link2;
                  if (item.inputType === 'email') TypeIcon = Mail;
                  if (item.inputType === 'message') TypeIcon = MessageSquare;

                  return (
                    <tr 
                      key={item.id}
                      onClick={() => setSelectedScan(item)}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 font-medium text-[#475569]">
                          <TypeIcon className="w-3.5 h-3.5 text-[#64748B]" />
                          <span className="capitalize">{item.inputType}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-sm">
                        <div className="font-medium text-[#172033] truncate">
                          {item.displayTitle}
                        </div>
                        <div className="font-mono text-[10px] text-[#94A3B8] truncate">
                          SHA: {item.inputHash.substring(0, 16)}...
                        </div>
                      </td>
                      <td className={`px-4 py-3 font-mono font-bold whitespace-nowrap ${
                        isHigh ? 'text-red-600' : (isMed ? 'text-amber-600' : 'text-emerald-600')
                      }`}>
                        {item.riskScore}/100
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 font-medium ${
                          isHigh ? 'text-red-700' : (isMed ? 'text-amber-700' : 'text-emerald-700')
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            isHigh ? 'bg-red-500' : (isMed ? 'bg-amber-500' : 'bg-emerald-500')
                          }`} />
                          {item.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#475569] font-mono whitespace-nowrap">
                        {(item.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedScan(item)}
                            className="p-1 text-[#64748B] hover:text-[#4169E1] rounded-sm transition-colors"
                            title="View Analysis Vector"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1 text-[#64748B] hover:text-red-600 rounded-sm transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>
            Showing {items.length > 0 ? page * pageSize + 1 : 0} to {Math.min((page + 1) * pageSize, total)} of {total} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1 rounded-sm border border-[#E2E8F0] bg-white disabled:opacity-40 hover:bg-[#F1F5F9]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-[#172033]">
              Page {page + 1} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1 rounded-sm border border-[#E2E8F0] bg-white disabled:opacity-40 hover:bg-[#F1F5F9]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedScan && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="text-[10px] text-[#4169E1] font-mono uppercase font-semibold">
                  AUDIT ID: {selectedScan.id}
                </span>
                <h3 className="text-base font-bold text-[#172033] mt-0.5">
                  {selectedScan.displayTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="p-1 text-[#64748B] hover:text-[#172033] rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <RiskMeter
              score={selectedScan.riskScore}
              level={selectedScan.riskLevel}
              confidence={selectedScan.confidence}
              probability={selectedScan.calibratedProbability}
              latencyMs={selectedScan.executionTimeMs}
              modelVersion={selectedScan.modelVersion}
            />

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-md space-y-2 text-xs">
              <span className="font-semibold text-[#172033] block">Raw Input Content:</span>
              <pre className="font-mono text-[11px] text-[#334155] whitespace-pre-wrap max-h-40 overflow-y-auto bg-white p-3 rounded-sm border border-[#E2E8F0]">
                {selectedScan.inputContent}
              </pre>
            </div>

            <ShapWaterfall explanations={selectedScan.shapExplanations} />
            <FeatureTable features={selectedScan.features} />

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-2 bg-[#172033] text-white text-xs font-semibold rounded-md"
              >
                Close Audit Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
