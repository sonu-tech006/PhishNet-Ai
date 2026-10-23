import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Cpu, 
  Database, 
  BarChart3, 
  GitBranch, 
  Lock, 
  CheckCircle2, 
  Layers, 
  Activity, 
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { NavTab } from '../components/common/Sidebar.js';

interface LandingPageProps {
  onEnterApp: (tab?: NavTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const pillars = [
    {
      title: 'AI / ML Engineering',
      icon: Cpu,
      color: 'text-[#4169E1]',
      bg: 'bg-blue-50',
      description: 'Hand-engineered lexical signals, Shannon domain entropy, XGBoost champion model, and local SHAP feature attribution.'
    },
    {
      title: 'Data Science & Analytics',
      icon: BarChart3,
      color: 'text-[#0F9D92]',
      bg: 'bg-teal-50',
      description: 'Stratified train/val/test splits (80/10/10), empirical ROC/PR curves, confusion matrices, and dynamic threshold tuning.'
    },
    {
      title: 'Data Engineering ETL',
      icon: GitBranch,
      color: 'text-[#7967D8]',
      bg: 'bg-purple-50',
      description: 'Automated ingestion pipelines, Pydantic schema validation, SHA-256 deduplication, and data quality scoring.'
    }
  ];

  const features = [
    'Safe static URL dissection without remote code execution or SSRF risks',
    'Email header alignment heuristics detecting brand spoofing & urgency',
    'Mobile smishing filter identifying parcel delivery & OTP theft baits',
    'Calibrated sigmoid probability with transparent risk scoring (0-100)',
    'High-throughput bulk CSV batch processor with instant export',
    'MongoDB Atlas persistence with cryptographically hashed audit trails'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] selection:bg-[#4169E1]/20 selection:text-[#4169E1]">
      {/* Top Navbar */}
      <nav className="border-b border-[#E2E8F0] bg-white sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#4169E1] flex items-center justify-center text-white shadow-xs">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-[#172033]">PhishNet</span>
              <span className="text-xs font-semibold text-[#4169E1] tracking-wider uppercase">AI</span>
            </div>
            <p className="text-[10px] text-[#64748B]">B.Tech Final Year CS Project</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onEnterApp('settings')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#172033] px-3 py-1.5"
          >
            <BookOpen className="w-4 h-4 text-[#64748B]" />
            <span>Architecture</span>
          </button>
          <button
            onClick={() => onEnterApp('scanner')}
            className="flex items-center gap-2 px-4 py-2 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <span>Launch Threat Scanner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#4169E1] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Final-Year B.Tech Computer Science Capstone Project</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#172033] max-w-4xl mx-auto leading-tight">
          Intelligent Phishing & Scam Detection Platform
        </h1>

        <p className="text-sm md:text-base text-[#475569] max-w-2xl mx-auto leading-relaxed">
          PhishNet AI combines lexical feature engineering, NLP stylometry, and XGBoost machine learning to detect zero-day phishing URLs, spoofed corporate emails, and smishing scams with explainable SHAP diagnostics.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onEnterApp('scanner')}
            className="flex items-center gap-2 px-6 py-3 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs md:text-sm font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Open Threat Scanner</span>
          </button>
          <button
            onClick={() => onEnterApp('overview')}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] text-xs md:text-sm font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#64748B]" />
            <span>Enter SOC Dashboard</span>
          </button>
        </div>
      </section>

      {/* 3 Academic Perspectives */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs space-y-3">
                <div className={`w-10 h-10 rounded-lg ${pil.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${pil.color}`} />
                </div>
                <h3 className="text-base font-bold text-[#172033]">{pil.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {pil.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Engineering Features */}
      <section className="px-6 py-12 max-w-5xl mx-auto bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#172033]">
            Engineered for Production Rigor
          </h2>
          <p className="text-xs text-[#64748B]">
            Practical implementation of full-stack data science, cybersecurity analytics, and distributed persistence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div>
            <strong>Tech Stack:</strong> React 19, TypeScript, Tailwind CSS, Recharts, Express / FastAPI, XGBoost, Scikit-learn, MongoDB Atlas.
          </div>
          <button
            onClick={() => onEnterApp('scanner')}
            className="text-[#4169E1] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Proceed to Live System</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#E2E8F0] text-center text-xs text-[#94A3B8] mt-16">
        <p>PhishNet AI · Final Year B.Tech Computer Science Capstone Project · {new Date().getFullYear()}</p>
        <p className="mt-1 text-[11px]">Designed with zero-pill discipline, explainable AI, and defense-in-depth cybersecurity controls.</p>
      </footer>
    </div>
  );
};
