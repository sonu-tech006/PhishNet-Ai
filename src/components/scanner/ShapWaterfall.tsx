import React from 'react';
import { ShapExplanation } from '../../types/index.js';
import { HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ShapWaterfallProps {
  explanations: ShapExplanation[];
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({ explanations }) => {
  if (!explanations || explanations.length === 0) {
    return (
      <div className="text-xs text-[#64748B] italic p-4 text-center bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
        No specific feature deviations detected. Model returned baseline distribution.
      </div>
    );
  }

  // Find max absolute value for normalization
  const maxAbs = Math.max(...explanations.map(e => Math.abs(e.contribution)), 0.1);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#172033] tracking-tight">
            Feature Attribution & Explainability (SHAP Values)
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Marginal impact of each extracted signal on the final calibrated risk score.
          </p>
        </div>
        <div className="text-[11px] text-[#64748B] flex items-center gap-3">
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Increases Risk
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Decreases Risk
          </span>
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        {explanations.map((exp, idx) => {
          const isRiskIncrease = exp.contribution > 0;
          const pctWidth = Math.min(100, Math.max(8, (Math.abs(exp.contribution) / maxAbs) * 100));

          return (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-xs py-1.5 border-b border-[#F8FAFC]">
              <div className="w-full sm:w-1/3 min-w-0">
                <div className="font-medium text-[#172033] truncate flex items-center gap-1">
                  {exp.featureName}
                </div>
                <div className="text-[10px] text-[#64748B] font-mono truncate">
                  Value: {String(exp.featureValue)}
                </div>
              </div>

              {/* Bar visualization */}
              <div className="w-full sm:w-1/2 flex items-center gap-2">
                <div className="flex-1 h-3 bg-[#F1F5F9] rounded-sm overflow-hidden relative">
                  <div 
                    className={`h-full rounded-sm transition-all duration-300 ${
                      isRiskIncrease ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pctWidth}%` }}
                  />
                </div>
                <div className={`w-14 text-right font-mono text-[11px] font-semibold ${
                  isRiskIncrease ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {isRiskIncrease ? '+' : ''}{exp.contribution.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
