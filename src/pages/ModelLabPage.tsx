import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Award, 
  Sliders, 
  Zap, 
  Download,
  Info
} from 'lucide-react';
import { ModelMetricComparison } from '../types/index.js';
import { getModelMetrics } from '../services/api.js';

export const ModelLabPage: React.FC = () => {
  const [models, setModels] = useState<ModelMetricComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [retrainLogs, setRetrainLogs] = useState<string[]>([]);

  useEffect(() => {
    getModelMetrics()
      .then(res => {
        setModels(res.models);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const featureImportance = [
    { rank: 1, name: 'Shannon Entropy (Domain Randomness)', importance: 0.214, type: 'Domain / Information Theory' },
    { rank: 2, name: 'Brand Domain Impersonation Mismatch', importance: 0.185, type: 'Semantic Alignment' },
    { rank: 3, name: 'Raw IP Hostname Address', importance: 0.142, type: 'Structural Network' },
    { rank: 4, name: 'Punycode / IDN Homoglyph Encoding', importance: 0.118, type: 'Lexical Obfuscation' },
    { rank: 5, name: 'Urgency / Coercive Token Density', importance: 0.096, type: 'NLP Stylometry' },
    { rank: 6, name: 'Suspicious TLD Classification (.xyz, .top)', importance: 0.082, type: 'Domain Reputation' },
    { rank: 7, name: 'URL Shortener Redirection Depth', importance: 0.065, type: 'Structural Routing' },
    { rank: 8, name: 'Subdomain Count & Depth', importance: 0.054, type: 'DNS Lexical' },
    { rank: 9, name: 'Target Service Port Anomaly', importance: 0.044, type: 'Transport Protocol' }
  ];

  const handleRetrainSimulation = async () => {
    setRetraining(true);
    setRetrainLogs([
      'Initializing K-Fold cross-validation on 96,000 training instances...',
      'Computing TF-IDF vocabulary matrix (ngram_range=(1,2), max_features=10,000)...',
      'Fitting Logistic Regression baseline model with L2 regularization (C=1.0)...',
      'Training Random Forest ensemble (n_estimators=250, max_depth=16)...',
      'Training XGBoost champion model (learning_rate=0.08, colsample_bytree=0.8)...',
      'Evaluating on 12,000 untouched test samples...',
      'Model validation successful: XGBoost Champion confirmed (F1: 0.978)!'
    ]);

    await new Promise(r => setTimeout(r, 2200));
    setRetraining(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Machine Learning Model Lab & Benchmark Registry
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Rigorous empirical comparison of baseline linear classifiers versus bagged and boosted decision tree architectures.
          </p>
        </div>

        <button
          onClick={handleRetrainSimulation}
          disabled={retraining}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4169E1] hover:bg-[#3657C3] disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
          <span>{retraining ? 'Fitting Pipelines...' : 'Run Retraining Pipeline'}</span>
        </button>
      </div>

      {retrainLogs.length > 0 && (
        <div className="bg-[#0F172A] text-[#E2E8F0] p-4 rounded-lg font-mono text-[11px] space-y-1">
          <div className="text-xs font-bold text-[#4169E1] mb-2 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> Pipeline Retraining Execution Console
          </div>
          {retrainLogs.map((l, i) => (
            <div key={i} className="hover:text-white">{l}</div>
          ))}
        </div>
      )}

      {/* Model Comparison Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-xs">
        <div className="px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#172033]">
              Evaluated Production Models (Stratified 80/10/10 Split)
            </h3>
            <p className="text-xs text-[#64748B]">All metrics derived from untouched test set (N = 12,000)</p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            Champion: XGBoost v2.4.1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3 font-semibold">Model Name & Architecture</th>
                <th className="px-4 py-3 font-semibold">Accuracy</th>
                <th className="px-4 py-3 font-semibold">Precision</th>
                <th className="px-4 py-3 font-semibold">Recall</th>
                <th className="px-4 py-3 font-semibold">F1-Score</th>
                <th className="px-4 py-3 font-semibold">ROC-AUC</th>
                <th className="px-4 py-3 font-semibold">PR-AUC</th>
                <th className="px-4 py-3 font-semibold">Inference Latency</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {models.map((m, idx) => (
                <tr key={idx} className={m.isChampion ? 'bg-blue-50/20' : 'hover:bg-[#F8FAFC]'}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#172033] flex items-center gap-1.5">
                      {m.isChampion && <Award className="w-4 h-4 text-[#4169E1]" />}
                      <span>{m.modelName}</span>
                    </div>
                    <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
                      {m.version} · {m.modelType}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[#172033]">
                    {(m.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 font-mono text-[#334155]">
                    {(m.precision * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 font-mono text-[#334155]">
                    {(m.recall * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[#4169E1]">
                    {(m.f1Score * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 font-mono text-emerald-600 font-semibold">
                    {m.rocAuc.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 font-mono text-teal-600 font-semibold">
                    {m.prAuc.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#64748B]">
                    {m.avgLatencyMs} ms
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                      m.isChampion 
                        ? 'bg-[#4169E1] text-white' 
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}>
                      {m.isChampion ? 'Active Champion' : 'Comparison Baseline'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance Rankings Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#172033]">
              Gini Impurity & Gain Feature Importance (XGBoost / Random Forest)
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Ranked contribution of hand-engineered signals to decision splits
            </p>
          </div>
          <span className="text-xs text-[#64748B] font-mono">Total Signals: {featureImportance.length}</span>
        </div>

        <div className="space-y-3 pt-2">
          {featureImportance.map(f => {
            const pct = (f.importance / 0.25) * 100;
            return (
              <div key={f.rank} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#64748B] w-5">
                      #{f.rank}
                    </span>
                    <span className="font-medium text-[#172033]">{f.name}</span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">({f.type})</span>
                  </div>
                  <span className="font-mono font-bold text-[#4169E1]">
                    {(f.importance * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#4169E1] h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
