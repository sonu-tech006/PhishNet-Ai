import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Clock, Zap, Cpu } from 'lucide-react';
import { RiskLevel } from '../../types/index.js';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
  confidence: number;
  probability: number;
  latencyMs: number;
  modelVersion: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  level,
  confidence,
  probability,
  latencyMs,
  modelVersion
}) => {
  const getColorClasses = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'High Risk':
        return {
          text: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-200',
          barColor: 'bg-red-600',
          badgeText: 'text-red-700',
          icon: ShieldAlert
        };
      case 'Medium Risk':
        return {
          text: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          barColor: 'bg-amber-500',
          badgeText: 'text-amber-700',
          icon: AlertTriangle
        };
      case 'Low Risk':
      default:
        return {
          text: 'text-emerald-700',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          barColor: 'bg-emerald-600',
          badgeText: 'text-emerald-700',
          icon: ShieldCheck
        };
    }
  };

  const style = getColorClasses(level);
  const IconComponent = style.icon;

  return (
    <div className={`p-5 rounded-lg border ${style.border} ${style.bg} transition-all`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left score & icon */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg bg-white border ${style.border} flex items-center justify-center shadow-xs shrink-0`}>
            <IconComponent className={`w-6 h-6 ${style.text}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold tracking-tight ${style.text}`}>
                {score}
              </span>
              <span className="text-xs text-[#64748B] font-mono">/100</span>
              <span className="text-sm font-semibold tracking-tight text-[#172033]">
                · {level}
              </span>
            </div>
            <p className="text-xs text-[#475569] mt-0.5">
              Calibrated Phishing Probability: <span className="font-semibold text-[#172033]">{(probability * 100).toFixed(1)}%</span>
            </p>
          </div>
        </div>

        {/* Right metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs w-full sm:w-auto">
          <div className="bg-white/80 border border-[#E2E8F0] px-3 py-1.5 rounded-md">
            <span className="text-[10px] text-[#64748B] block">Model Confidence</span>
            <span className="font-semibold text-[#172033]">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="bg-white/80 border border-[#E2E8F0] px-3 py-1.5 rounded-md">
            <span className="text-[10px] text-[#64748B] block">Inference Latency</span>
            <span className="font-semibold text-[#172033] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#64748B]" />
              {latencyMs} ms
            </span>
          </div>
          <div className="bg-white/80 border border-[#E2E8F0] px-3 py-1.5 rounded-md col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#64748B] block">Model Version</span>
            <span className="font-mono text-[10px] font-semibold text-[#4169E1] truncate block">
              {modelVersion}
            </span>
          </div>
        </div>
      </div>

      {/* Progress meter bar */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-[#64748B] mb-1 font-mono">
          <span>0 (Benign / Low)</span>
          <span>35</span>
          <span>70</span>
          <span>100 (Severe Threat)</span>
        </div>
        <div className="w-full h-2.5 bg-white border border-[#E2E8F0] rounded-full overflow-hidden p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${style.barColor}`} 
            style={{ width: `${Math.min(100, Math.max(3, score))}%` }} 
          />
        </div>
      </div>
    </div>
  );
};
