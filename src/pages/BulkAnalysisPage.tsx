import React, { useState } from 'react';
import { 
  Layers, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RefreshCw,
  Filter,
  Check
} from 'lucide-react';
import { analyzeBatch } from '../services/api.js';
import { AnalysisResult, RiskLevel } from '../types/index.js';

export const BulkAnalysisPage: React.FC = () => {
  const [csvContent, setCsvContent] = useState<string>(`url
http://185.220.101.5:8080/secure-update/chase-login.php
https://docs.github.com/en/actions
http://paypal-security-update.xyz/auth?user=verify
https://en.wikipedia.org/wiki/Phishing
http://appleid-support-icloud.top/verify.php
http://bit.ly/3xyzExampleShortener
https://google.com/search?q=machine+learning
http://usps-tracking-redelivery.info/confirm.php`);

  const [selectedType, setSelectedType] = useState<'url' | 'email' | 'message'>('url');
  const [parsedRows, setParsedRows] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [batchResults, setBatchResults] = useState<AnalysisResult[] | null>(null);
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setErrorMsg('Please select a valid CSV or TXT file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      setErrorMsg(null);
    };
    reader.readAsText(file);
  };

  const handleRunBatch = async () => {
    setErrorMsg(null);
    setBatchResults(null);

    // Parse lines
    const lines = csvContent
      .split('\n')
      .map(l => l.trim().replace(/^["']|["']$/g, ''))
      .filter(l => l.length > 0);

    // If first line is header ('url', 'text', 'email'), skip it
    const cleanLines = (lines[0] && ['url', 'email', 'text', 'message', 'content'].includes(lines[0].toLowerCase()))
      ? lines.slice(1)
      : lines;

    if (cleanLines.length === 0) {
      setErrorMsg('No valid rows found in CSV text.');
      return;
    }

    if (cleanLines.length > 300) {
      setErrorMsg('Max batch limit for interactive UI is 300 rows.');
      return;
    }

    setParsedRows(cleanLines);
    setIsProcessing(true);
    setProgressPct(20);

    try {
      const interval = setInterval(() => {
        setProgressPct(prev => Math.min(90, prev + 15));
      }, 200);

      const res = await analyzeBatch(cleanLines, selectedType);

      clearInterval(interval);
      setProgressPct(100);
      setBatchResults(res.results);
    } catch (err: any) {
      setErrorMsg('Batch processing error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!batchResults || batchResults.length === 0) return;

    const headers = ['id', 'inputType', 'content', 'riskScore', 'riskLevel', 'confidence', 'latencyMs', 'timestamp'];
    const rows = batchResults.map(r => [
      r.id,
      r.inputType,
      `"${r.inputContent.replace(/"/g, '""')}"`,
      r.riskScore,
      r.riskLevel,
      r.confidence,
      r.executionTimeMs,
      r.createdAt
    ]);

    const csvStr = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishnet_batch_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredResults = batchResults?.filter(r => {
    if (riskFilter === 'all') return true;
    return r.riskLevel === riskFilter;
  });

  const highCount = batchResults?.filter(r => r.riskLevel === 'High Risk').length || 0;
  const medCount = batchResults?.filter(r => r.riskLevel === 'Medium Risk').length || 0;
  const lowCount = batchResults?.filter(r => r.riskLevel === 'Low Risk').length || 0;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            High-Throughput Bulk CSV Analysis
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Ingest batches of URLs or messages. Validates rows, runs high-speed parallel inference, and exports classified audit reports.
          </p>
        </div>

        {batchResults && (
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Scored CSV ({batchResults.length} Rows)</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* CSV Ingestion Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F5F9] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#172033]">Data Column Type:</span>
            <div className="flex rounded-md border border-[#E2E8F0] p-0.5 bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setSelectedType('url')}
                className={`px-3 py-1 text-xs font-medium rounded-sm ${
                  selectedType === 'url' ? 'bg-[#4169E1] text-white' : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                URLs
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('email')}
                className={`px-3 py-1 text-xs font-medium rounded-sm ${
                  selectedType === 'email' ? 'bg-[#4169E1] text-white' : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Email Bodies
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('message')}
                className={`px-3 py-1 text-xs font-medium rounded-sm ${
                  selectedType === 'message' ? 'bg-[#4169E1] text-white' : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                SMS Messages
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 px-3.5 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md text-xs font-medium text-[#334155] cursor-pointer transition-colors shrink-0">
            <Upload className="w-3.5 h-3.5 text-[#4169E1]" />
            <span>Upload .CSV File</span>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="text-xs font-medium text-[#172033] block mb-1">
            CSV / Line-Delimited Payload Preview
          </label>
          <textarea
            rows={6}
            value={csvContent}
            onChange={e => setCsvContent(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md font-mono text-xs text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
          />
        </div>

        {/* Run Batch Button & Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <span className="text-xs text-[#64748B]">
            Each item is processed through the multi-signal ML inference pipeline and saved to analysis history.
          </span>

          <button
            type="button"
            onClick={handleRunBatch}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#4169E1] hover:bg-[#3657C3] disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer shrink-0"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Batch ({progressPct}%)...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Execute Batch Analysis</span>
              </>
            )}
          </button>
        </div>

        {isProcessing && (
          <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#4169E1] h-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      {/* Batch Results View */}
      {batchResults && (
        <div className="space-y-4">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs">
              <span className="text-xs text-[#64748B] block">Total Scored Items</span>
              <span className="text-xl font-bold text-[#172033] mt-1 block">{batchResults.length}</span>
            </div>
            <div className="bg-white border border-red-200 bg-red-50/40 p-4 rounded-lg shadow-xs">
              <span className="text-xs text-red-700 block font-medium">High Risk (Threats)</span>
              <span className="text-xl font-bold text-red-600 mt-1 block">{highCount}</span>
            </div>
            <div className="bg-white border border-amber-200 bg-amber-50/40 p-4 rounded-lg shadow-xs">
              <span className="text-xs text-amber-700 block font-medium">Medium Risk</span>
              <span className="text-xl font-bold text-amber-600 mt-1 block">{medCount}</span>
            </div>
            <div className="bg-white border border-emerald-200 bg-emerald-50/40 p-4 rounded-lg shadow-xs">
              <span className="text-xs text-emerald-700 block font-medium">Low Risk (Benign)</span>
              <span className="text-xl font-bold text-emerald-600 mt-1 block">{lowCount}</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="font-medium text-[#172033]">Filter by Risk:</span>
              {(['all', 'High Risk', 'Medium Risk', 'Low Risk'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setRiskFilter(tier)}
                  className={`px-2.5 py-1 rounded-sm text-xs capitalize transition-colors ${
                    riskFilter === tier 
                      ? 'bg-[#172033] text-white font-medium' 
                      : 'text-[#64748B] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
            <span className="text-xs text-[#64748B]">
              Showing {filteredResults?.length || 0} of {batchResults.length} items
            </span>
          </div>

          {/* Table of Scored Rows */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Row #</th>
                    <th className="px-4 py-3 font-semibold">Item Content</th>
                    <th className="px-4 py-3 font-semibold">Risk Score</th>
                    <th className="px-4 py-3 font-semibold">Classification</th>
                    <th className="px-4 py-3 font-semibold">Confidence</th>
                    <th className="px-4 py-3 font-semibold">Top Indicators</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredResults?.map((item, idx) => {
                    const isHigh = item.riskLevel === 'High Risk';
                    const isMed = item.riskLevel === 'Medium Risk';
                    return (
                      <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-4 py-2.5 text-[#64748B] font-mono">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-[#172033] max-w-md truncate">
                          {item.inputContent}
                        </td>
                        <td className={`px-4 py-2.5 font-mono font-bold whitespace-nowrap ${
                          isHigh ? 'text-red-600' : (isMed ? 'text-amber-600' : 'text-emerald-600')
                        }`}>
                          {item.riskScore}/100
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap font-medium text-[#172033]">
                          <span className={`inline-flex items-center gap-1.5 ${
                            isHigh ? 'text-red-700' : (isMed ? 'text-amber-700' : 'text-emerald-700')
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              isHigh ? 'bg-red-500' : (isMed ? 'bg-amber-500' : 'bg-emerald-500')
                            }`} />
                            {item.riskLevel}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[#64748B] font-mono whitespace-nowrap">
                          {(item.confidence * 100).toFixed(0)}%
                        </td>
                        <td className="px-4 py-2.5 text-[#475569] max-w-xs truncate">
                          {item.topIndicators[0] || 'Standard pattern'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
