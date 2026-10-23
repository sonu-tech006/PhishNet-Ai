import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  BarChart2, 
  FileSpreadsheet, 
  Layers, 
  Filter,
  X
} from 'lucide-react';
import { DatasetItem } from '../types/index.js';
import { getDatasets, uploadDataset } from '../services/api.js';
import { toast } from '../components/common/Toast.js';

export const DatasetExplorerPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('url');
  const [newCount, setNewCount] = useState(10000);
  const [newPhish, setNewPhish] = useState(4800);
  const [newLegit, setNewLegit] = useState(5200);

  const fetchDatasetsList = () => {
    setLoading(true);
    getDatasets()
      .then(res => {
        setDatasets(res.datasets);
        if (res.datasets.length > 0 && !selectedDataset) {
          setSelectedDataset(res.datasets[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching datasets:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDatasetsList();
  }, []);

  const handleCreateDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const created = await uploadDataset({
        name: newName.trim(),
        type: newType,
        recordsCount: Number(newCount),
        phishingCount: Number(newPhish),
        legitimateCount: Number(newLegit),
        license: 'Private Institutional Archive'
      });
      setShowUploadModal(false);
      setNewName('');
      fetchDatasetsList();
      setSelectedDataset(created);
      toast('Dataset registered and indexed in MongoDB Atlas.', 'success');
    } catch (err: any) {
      toast('Error uploading dataset: ' + err.message, 'error');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Data Engineering & Dataset Explorer
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Exploratory Data Analysis (EDA), class imbalance auditing, deduplication indices, and schema normalization benchmarks.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Register New Dataset</span>
        </button>
      </div>

      {/* Dataset Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {datasets.map(ds => {
          const isSelected = selectedDataset?.id === ds.id;
          return (
            <div
              key={ds.id}
              onClick={() => setSelectedDataset(ds)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-white border-[#4169E1] shadow-xs ring-1 ring-[#4169E1]' 
                  : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#4169E1] font-semibold">
                  {ds.type} Dataset
                </span>
                <span className="text-[10px] text-[#64748B] font-mono">{ds.version}</span>
              </div>
              <h3 className="font-semibold text-xs text-[#172033] mt-1 truncate">
                {ds.name}
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#F8FAFC]">
                <span>{ds.totalRecords.toLocaleString()} rows</span>
                <span className="text-[11px] font-medium text-[#172033]">{ds.imbalanceRatio}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Dataset Detail Inspection */}
      {selectedDataset && (
        <div className="space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs">
              <span className="text-[11px] text-[#64748B] block">Total Clean Samples</span>
              <span className="text-xl font-bold font-mono text-[#172033] mt-1 block">
                {selectedDataset.totalRecords.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#059669] flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Deduplicated & Normalized
              </span>
            </div>

            <div className="bg-white border border-red-200 bg-red-50/30 p-4 rounded-lg shadow-xs">
              <span className="text-[11px] text-red-700 block font-medium">Positive Phishing Class</span>
              <span className="text-xl font-bold font-mono text-red-600 mt-1 block">
                {selectedDataset.phishingCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#64748B] mt-0.5">
                {((selectedDataset.phishingCount / selectedDataset.totalRecords) * 100).toFixed(1)}% of dataset
              </span>
            </div>

            <div className="bg-white border border-emerald-200 bg-emerald-50/30 p-4 rounded-lg shadow-xs">
              <span className="text-[11px] text-emerald-700 block font-medium">Negative Benign Class</span>
              <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
                {selectedDataset.legitimateCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#64748B] mt-0.5">
                {((selectedDataset.legitimateCount / selectedDataset.totalRecords) * 100).toFixed(1)}% of dataset
              </span>
            </div>

            <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs">
              <span className="text-[11px] text-[#64748B] block">Engineered Features</span>
              <span className="text-xl font-bold font-mono text-[#4169E1] mt-1 block">
                {selectedDataset.featuresCount} Features
              </span>
              <span className="text-[10px] text-[#64748B] mt-0.5">
                License: {selectedDataset.license}
              </span>
            </div>
          </div>

          {/* Sample Rows Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-xs space-y-3 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#172033]">
                  Sample Dataframe Rows ({selectedDataset.name})
                </h3>
                <p className="text-xs text-[#64748B]">Preview of verified ground-truth training records</p>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">
                Last Ingestion: {selectedDataset.lastUpdated}
              </span>
            </div>

            <div className="overflow-x-auto border border-[#E2E8F0] rounded-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    {selectedDataset.sampleRows[0] && Object.keys(selectedDataset.sampleRows[0]).map((col, idx) => (
                      <th key={idx} className="px-4 py-2.5 font-semibold font-mono">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {selectedDataset.sampleRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#F8FAFC]">
                      {Object.entries(row).map(([k, val], cIdx) => (
                        <td key={cIdx} className="px-4 py-2 font-mono text-[11px] text-[#334155]">
                          {k === 'label' ? (
                            <span className={`inline-flex items-center gap-1 font-semibold ${
                              val === 1 ? 'text-red-600' : 'text-emerald-600'
                            }`}>
                              {val === 1 ? '1 (Phishing)' : '0 (Legitimate)'}
                            </span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-bold text-sm text-[#172033]">Register Training Dataset</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#64748B] hover:text-[#172033]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDataset} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-[#172033] block mb-1">Dataset Name</label>
                <input
                  type="text"
                  placeholder="e.g. CISA Phishing Corpus 2026"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033]"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-[#172033] block mb-1">Dataset Modality</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033]"
                >
                  <option value="url">URLs (Lexical & Structural)</option>
                  <option value="email">Emails (Headers & Bodies)</option>
                  <option value="sms">SMS / Mobile Smishing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-[#172033] block mb-1">Phishing Samples</label>
                  <input
                    type="number"
                    value={newPhish}
                    onChange={e => {
                      const p = parseInt(e.target.value) || 0;
                      setNewPhish(p);
                      setNewCount(p + newLegit);
                    }}
                    className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#172033] block mb-1">Legitimate Samples</label>
                  <input
                    type="number"
                    value={newLegit}
                    onChange={e => {
                      const l = parseInt(e.target.value) || 0;
                      setNewLegit(l);
                      setNewCount(newPhish + l);
                    }}
                    className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-[#64748B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-semibold rounded-md"
                >
                  Register Dataset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
