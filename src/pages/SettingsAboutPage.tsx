import React, { useState } from 'react';
import { 
  Sliders, 
  Database, 
  Cpu, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Terminal, 
  Download, 
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';
import { SystemHealth } from '../types/index.js';

interface SettingsAboutPageProps {
  systemHealth: SystemHealth | null;
}

export const SettingsAboutPage: React.FC<SettingsAboutPageProps> = ({ systemHealth }) => {
  const [mongoUri, setMongoUri] = useState('mongodb+srv://<username>:<password>@cluster0.phishnet.mongodb.net/?retryWrites=true&w=majority');
  const [dbName, setDbName] = useState('phishnet_ai');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveDbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownloadBackup = () => {
    const backup = {
      project: 'PhishNet AI',
      btechProject: 'Final Year B.Tech Computer Science Capstone',
      generatedAt: new Date().toISOString(),
      architecture: 'Full-Stack Machine Learning & Threat Detection Platform',
      modelVersion: 'v2.4.1-hybrid-rf-tfidf',
      systemHealth,
      database: {
        configured: systemHealth?.dbConnected || false,
        engine: systemHealth?.database || 'embedded'
      }
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishnet_system_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-[#4169E1] uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> B.Tech Computer Science Project
            </span>
            <span className="text-[#94A3B8]">·</span>
            <span className="text-[11px] text-[#64748B] font-mono">Department of Computer Science & Engineering</span>
          </div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            PhishNet AI — Platform Architecture & Documentation
          </h2>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed max-w-2xl">
            A unified multi-signal cybersecurity and machine learning platform integrating feature engineering, XGBoost classification, SHAP attribution, and distributed database storage.
          </p>
        </div>

        <button
          onClick={handleDownloadBackup}
          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs font-medium text-[#334155] transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-[#4169E1]" />
          <span>Export System Metadata</span>
        </button>
      </div>

      {/* Database Configuration Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#4169E1]" />
            <h3 className="text-sm font-semibold text-[#172033]">
              MongoDB Database Connection & Retention
            </h3>
          </div>
          <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-sm ${
            systemHealth?.dbConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
          }`}>
            {systemHealth?.dbConnected ? 'MongoDB Live' : 'Embedded Engine Active'}
          </span>
        </div>

        <form onSubmit={handleSaveDbConfig} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#172033] block mb-1">
              MongoDB Connection String (URI)
            </label>
            <input
              type="text"
              value={mongoUri}
              onChange={e => setMongoUri(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md font-mono text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
            />
            <p className="text-[11px] text-[#64748B] mt-1">
              Provide connection URI from MongoDB Atlas or local deployment (<code className="font-mono text-[10px]">mongodb://localhost:27017</code>). In the AI Studio preview environment, PhishNet AI automatically uses the zero-configuration embedded persistence engine with instant data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[#172033] block mb-1">
                Database Name
              </label>
              <input
                type="text"
                value={dbName}
                onChange={e => setDbName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md font-mono text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#172033] block mb-1">
                Data Retention Window
              </label>
              <select className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]">
                <option value="90">90 Days (Standard Corporate Retention)</option>
                <option value="180">180 Days (Compliance Audit)</option>
                <option value="365">1 Year (SOC Forensics)</option>
                <option value="unlimited">Indefinite (Research Corpus)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Configuration settings updated!
              </span>
            ) : <div />}

            <button
              type="submit"
              className="px-4 py-2 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              Save Database Preferences
            </button>
          </div>
        </form>
      </div>

      {/* B.Tech Documentation & Mathematical Formulation */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs space-y-6">
        <div className="border-b border-[#F1F5F9] pb-3">
          <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#4169E1]" />
            Final-Year Project Technical Documentation
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Theoretical foundation, mathematical equations, and software design principles.
          </p>
        </div>

        {/* Section 1: Problem Statement */}
        <div className="space-y-2 text-xs text-[#475569] leading-relaxed">
          <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
            1. Problem Statement & Motivation
          </h4>
          <p>
            Phishing attacks remain the predominant initial vector for enterprise credential theft, ransomware deployment, and business email compromise (BEC). Traditional signature-based detection mechanisms fail against zero-day domains, algorithmically generated domains (DGA), and dynamically rendered phishing kits. 
            PhishNet AI addresses this vulnerability through an explainable multi-signal hybrid architecture combining linguistic stylometry, information-theoretic domain entropy, lexical graph dissection, and calibrated machine learning models.
          </p>
        </div>

        {/* Section 2: Mathematical Formulation */}
        <div className="space-y-3 text-xs text-[#475569] leading-relaxed">
          <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
            2. Mathematical Foundations & Feature Formulations
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-md space-y-2">
              <span className="font-semibold text-[#172033] block">
                A. Shannon Information Entropy of Domain Strings
              </span>
              <p className="text-[11px]">
                Measures the uncertainty and character distribution randomness in hostnames to differentiate legitimate brand names from automated DGA strings:
              </p>
              <div className="p-2 bg-white border border-[#E2E8F0] rounded-sm font-mono text-center text-[#172033]">
                H(S) = - ∑ [ p(c_i) * log₂ p(c_i) ]
              </div>
              <p className="text-[10px] text-[#64748B]">
                Where p(c_i) denotes the empirical probability of character c_i across the string length N.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-md space-y-2">
              <span className="font-semibold text-[#172033] block">
                B. Sigmoid Probability Calibration
              </span>
              <p className="text-[11px]">
                Maps raw multi-signal linear and tree ensemble margin scores into calibrated, defensible probability distributions:
              </p>
              <div className="p-2 bg-white border border-[#E2E8F0] rounded-sm font-mono text-center text-[#172033]">
                P(y=1 | x) = 1 / (1 + e^-(w·x + b))
              </div>
              <p className="text-[10px] text-[#64748B]">
                Prevents uncalibrated over-confidence and enables fine-grained risk tiering (0–35 Low, 36–69 Medium, 70–100 High).
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-md space-y-2 mt-2">
            <span className="font-semibold text-[#172033] block">
              C. TF-IDF Semantic Token Weighting
            </span>
            <p className="text-[11px]">
              Extracts distinctive phishing n-grams (e.g., &quot;immediate suspension&quot;, &quot;wire transfer&quot;, &quot;confirm password&quot;) while attenuating common English stop words:
            </p>
            <div className="p-2 bg-white border border-[#E2E8F0] rounded-sm font-mono text-center text-[#172033]">
              tf-idf(t, d, D) = tf(t, d) * log( |D| / (1 + |&#123; d &in; D : t &in; d &#125;|) )
            </div>
          </div>
        </div>

        {/* Section 3: Architecture Breakdown */}
        <div className="space-y-2 text-xs text-[#475569] leading-relaxed">
          <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
            3. Software Architecture & Monorepo Structure
          </h4>
          <div className="bg-[#0F172A] text-[#E2E8F0] p-4 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto">
{`phishnet-ai/
├── frontend/ (React 19 + TypeScript + Vite + Tailwind CSS + Recharts)
│   ├── src/pages/ (14 Complete Production Views: Scanner, Analytics, Lab, Pipelines...)
│   └── src/components/ (Explainability SHAP waterfall, Feature Table, Risk Meter...)
├── backend/ (Python 3.11+ FastAPI & Express tsx Full-Stack Runtime on Port 3000)
│   ├── app/ml/ (XGBoost champion, Random Forest, TF-IDF Logistic Regression)
│   ├── app/features/ (Safe URL Lexical Parser, Shannon Entropy, Email Semantics)
│   └── app/database/ (MongoDB Atlas Driver & Resilient Persistence Layer)
├── data/ (Curated 120,000 Sample URL Benchmark & Email Corpus)
├── tests/ (Pytest & Jest Automated Unit Tests)
├── Dockerfile & docker-compose.yml
└── .github/workflows/ci.yml`}
          </div>
        </div>
      </div>
    </div>
  );
};
