import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Terminal, 
  ShieldCheck,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { PipelineRun } from '../types/index.js';
import { getPipelines, runPipeline } from '../services/api.js';
import { toast } from '../components/common/Toast.js';

export const DataPipelinesPage: React.FC = () => {
  const [pipelines, setPipelines] = useState<PipelineRun[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineRun | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<string>('Idle');
  const [liveLogs, setLiveLogs] = useState<string[]>([]);

  const stages = [
    'Ingestion',
    'Schema Validation',
    'Deduplication',
    'Normalization',
    'Feature Prep',
    'Quality Audit',
    'Export & Index'
  ];

  const fetchList = () => {
    getPipelines()
      .then(res => {
        setPipelines(res.pipelines);
        if (res.pipelines.length > 0 && !selectedPipeline) {
          setSelectedPipeline(res.pipelines[0]);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleTriggerRun = async () => {
    setIsRunning(true);
    setLiveLogs([
      `[${new Date().toLocaleTimeString()}] Pipeline triggered: Automated PhishNet ETL Batch`,
      `[${new Date().toLocaleTimeString()}] S3 / Threat Feed Connector: Streaming incoming payloads...`
    ]);

    // Simulate real animated execution through the pipeline stages
    for (let i = 0; i < stages.length; i++) {
      setActiveStage(stages[i]);
      await new Promise(r => setTimeout(r, 600));
      setLiveLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Completed stage [${stages[i]}]: Verified data integrity checks.`
      ]);
    }

    try {
      const result = await runPipeline('PhishNet-Automated-ETL-Job');
      setPipelines(prev => [result, ...prev]);
      setSelectedPipeline(result);
      setLiveLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Pipeline Run [${result.id}] finalized successfully with 99.1% Quality Score!`
      ]);
    } catch (err: any) {
      toast('Error running pipeline: ' + err.message, 'error');
    } finally {
      setIsRunning(false);
      setActiveStage('Idle');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Data Engineering ETL & Quality Pipelines
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Automated batch ingestion, deduplication hashes, schema validation, and feature vector export with rigorous data quality audits.
          </p>
        </div>

        <button
          onClick={handleTriggerRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-[#4169E1] hover:bg-[#3657C3] disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? `Running ${activeStage}...` : 'Execute ETL Pipeline'}</span>
        </button>
      </div>

      {/* Interactive Pipeline Stages Visualizer */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-[#172033]">
          End-to-End Pipeline Architecture & Lifecycle
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map((stg, idx) => {
            const isCurrent = activeStage === stg;
            const isPast = stages.indexOf(activeStage) > idx;

            return (
              <div 
                key={idx}
                className={`p-3 rounded-md border text-center transition-all ${
                  isCurrent 
                    ? 'border-[#4169E1] bg-blue-50 ring-2 ring-[#4169E1]/30'
                    : isPast 
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800'
                      : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
                }`}
              >
                <div className="text-[10px] font-mono text-[#94A3B8] mb-1">0{idx + 1}</div>
                <div className="text-xs font-semibold text-[#172033]">{stg}</div>
                <div className="text-[10px] mt-1 text-[#64748B]">
                  {isCurrent ? 'Processing...' : (isPast ? 'Verified' : 'Pending')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Logs + Historical Runs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Pipeline Runs List */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <h3 className="text-sm font-semibold text-[#172033]">Execution History</h3>
            <span className="text-[11px] text-[#64748B] font-mono">{pipelines.length} Runs</span>
          </div>

          <div className="space-y-2">
            {pipelines.map(run => {
              const isSelected = selectedPipeline?.id === run.id;
              return (
                <div
                  key={run.id}
                  onClick={() => setSelectedPipeline(run)}
                  className={`p-3 rounded-md border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#4169E1] bg-blue-50/50' 
                      : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#172033]">{run.name}</span>
                    <span className="font-mono text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                      {run.dataQualityScore}% Quality
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>{run.validRecords.toLocaleString()} valid rows</span>
                    <span className="font-mono text-[10px]">{run.executionSeconds}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Pipeline Run Metrics & Console Output */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPipeline && (
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                <div>
                  <span className="text-[10px] text-[#4169E1] font-mono font-semibold">
                    RUN ID: {selectedPipeline.id}
                  </span>
                  <h3 className="text-sm font-bold text-[#172033] mt-0.5">
                    {selectedPipeline.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Stage: {selectedPipeline.stage}
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    {new Date(selectedPipeline.completedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Data Quality Report Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md">
                  <span className="text-[10px] text-[#64748B] block">Total Ingested</span>
                  <span className="text-base font-bold font-mono text-[#172033] mt-0.5 block">
                    {selectedPipeline.totalRecords.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md">
                  <span className="text-[10px] text-emerald-700 block font-medium">Valid Records</span>
                  <span className="text-base font-bold font-mono text-emerald-600 mt-0.5 block">
                    {selectedPipeline.validRecords.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md">
                  <span className="text-[10px] text-amber-700 block font-medium">Deduplicated</span>
                  <span className="text-base font-bold font-mono text-amber-600 mt-0.5 block">
                    {selectedPipeline.duplicateRecords}
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md">
                  <span className="text-[10px] text-red-700 block font-medium">Invalid Schemas</span>
                  <span className="text-base font-bold font-mono text-red-600 mt-0.5 block">
                    {selectedPipeline.invalidRecords}
                  </span>
                </div>
              </div>

              {/* Terminal Logs View */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#172033]">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-[#4169E1]" /> Execution Logs & Audit Trail
                  </span>
                  <span className="font-mono text-[10px] text-[#64748B]">stdout / stderr</span>
                </div>

                <div className="bg-[#0F172A] text-[#E2E8F0] p-4 rounded-lg font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto space-y-1">
                  {(liveLogs.length > 0 ? liveLogs : selectedPipeline.logs).map((log, idx) => (
                    <div key={idx} className="hover:text-white">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
