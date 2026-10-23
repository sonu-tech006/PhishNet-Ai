import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  AlertCircle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { analyzeMessage } from '../services/api.js';
import { toast } from '../components/common/Toast.js';
import { AnalysisResult } from '../types/index.js';
import { RiskMeter } from '../components/scanner/RiskMeter.js';
import { ShapWaterfall } from '../components/scanner/ShapWaterfall.js';
import { FeatureTable } from '../components/scanner/FeatureTable.js';
import { DisclaimerBanner } from '../components/scanner/DisclaimerBanner.js';

export const MessageAnalyzerPage: React.FC = () => {
  const [message, setMessage] = useState('USPS: Package #US-89218 cannot be delivered due to missing street address number. Update address within 24 hours at https://usps-redelivery-postal.top to avoid return.');
  const [senderPhone, setSenderPhone] = useState('+1 (800) 275-8777');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const smishSamples = [
    {
      title: 'USPS Delivery Bait',
      text: 'USPS: Package #US-89218 cannot be delivered due to missing street address. Update address within 24 hours at https://usps-redelivery-postal.top to avoid return.',
      sender: '+1 (800) 275-8777'
    },
    {
      title: 'Banking Wire Fraud / OTP Alert',
      text: 'Chase Fraud Alert: Did you attempt a $1,450.00 Zelle transfer to user *7829? Reply YES or NO. If NO, immediately call our security fraud team at http://chase-fraud-line.icu/verify',
      sender: '72439'
    },
    {
      title: 'Crypto / Job Offer Scam',
      text: 'Congratulations! You have been selected for remote optimization assistant. Earn $300-$800 daily on Telegram. Join immediately: https://t.me/crypto_tasks_daily',
      sender: '+44 7911 123456'
    },
    {
      title: 'Legitimate 2FA Code',
      text: 'Your GitHub authentication code is 849201. It will expire in 10 minutes. Do not share this code with anyone.',
      sender: 'GitHub Security'
    }
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await analyzeMessage(message.trim(), senderPhone.trim() || undefined);
      setResult(res);
      toast('Message evaluated and risk score updated.', 'success');
    } catch (err: any) {
      toast('Error analyzing message: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">
          Smishing & SMS Scam Filter
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Detects mobile financial fraud, OTP phishing traps, deceptive delivery alerts, and spoofed SMS shortcodes.
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs space-y-4">
        {/* Sample Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#4169E1]" /> Quick Presets:
          </span>
          {smishSamples.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setMessage(s.text);
                setSenderPhone(s.sender);
              }}
              className="px-2.5 py-1 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md text-[#334155] transition-colors"
            >
              {s.title}
            </button>
          ))}
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Sender Shortcode or Phone (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. +1 (800) 555-0199 or 5-digit shortcode"
              value={senderPhone}
              onChange={e => setSenderPhone(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs font-mono text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              SMS / Messaging Text Payload <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Paste SMS content, WhatsApp prompt, or mobile text..."
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMessage('');
                setSenderPhone('');
              }}
              className="text-xs text-[#64748B] hover:text-[#172033] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              {loading ? 'Evaluating Smishing Risk...' : 'Scan SMS Message'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          <RiskMeter
            score={result.riskScore}
            level={result.riskLevel}
            confidence={result.confidence}
            probability={result.calibratedProbability}
            latencyMs={result.executionTimeMs}
            modelVersion={result.modelVersion}
          />
          <ShapWaterfall explanations={result.shapExplanations} />
          <FeatureTable features={result.features} />
          <DisclaimerBanner />
        </div>
      )}
    </div>
  );
};
