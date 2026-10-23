import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-lg text-xs text-[#92400E] flex items-start gap-3">
      <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-semibold text-[#78350F]">
          Cybersecurity & Machine Learning Advisory
        </p>
        <p className="leading-relaxed text-[#92400E]">
          Model predictions are statistical approximations trained on benchmark datasets, not mathematical warranties. 
          A low risk score does <strong>not</strong> guarantee an item is benign or safe. PhishNet AI operates safely by never fetching arbitrary remote content or auto-navigating to suspicious domains. Always follow organization security policies and exercise human skepticism.
        </p>
      </div>
    </div>
  );
};
