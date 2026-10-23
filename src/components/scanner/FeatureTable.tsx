import React from 'react';
import { ExtractedFeature } from '../../types/index.js';
import { AlertCircle, CheckCircle2, Minus } from 'lucide-react';

interface FeatureTableProps {
  features: ExtractedFeature[];
}

export const FeatureTable: React.FC<FeatureTableProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return (
      <div className="text-xs text-[#64748B] italic p-4 text-center bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
        No structured features extracted.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <h3 className="text-sm font-semibold text-[#172033]">
          Extracted Feature Vector ({features.length} Signals)
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Heuristic, lexical, domain, and semantic properties evaluated during model inference.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-[#64748B] uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Signal Name</th>
              <th className="px-4 py-2.5 font-semibold">Observed Value</th>
              <th className="px-4 py-2.5 font-semibold">Category</th>
              <th className="px-4 py-2.5 font-semibold">Threat Correlation</th>
              <th className="px-4 py-2.5 font-semibold">Weight</th>
              <th className="px-4 py-2.5 font-semibold">Analysis Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {features.map((f, idx) => {
              let impactStyle = 'text-[#64748B]';
              let Icon = Minus;
              if (f.impact === 'phishing') {
                impactStyle = 'text-red-700 font-medium';
                Icon = AlertCircle;
              } else if (f.impact === 'legitimate') {
                impactStyle = 'text-emerald-700 font-medium';
                Icon = CheckCircle2;
              }

              return (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-2.5 font-medium text-[#172033] whitespace-nowrap">
                    {f.name}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-[#334155] max-w-xs truncate">
                    {String(f.value)}
                  </td>
                  <td className="px-4 py-2.5 capitalize text-[#64748B]">
                    {f.category}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 ${impactStyle}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span className="capitalize">{f.impact}</span>
                    </span>
                  </td>
                  <td className={`px-4 py-2.5 font-mono font-medium whitespace-nowrap ${
                    f.weight > 0 ? 'text-red-600' : (f.weight < 0 ? 'text-emerald-600' : 'text-[#64748B]')
                  }`}>
                    {f.weight > 0 ? `+${f.weight.toFixed(2)}` : f.weight.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-[#475569] max-w-sm">
                    {f.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
