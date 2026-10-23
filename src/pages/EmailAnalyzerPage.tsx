import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  RotateCcw,
  Copy,
  Download
} from 'lucide-react';
import { analyzeEmail } from '../services/api.js';
import { toast } from '../components/common/Toast.js';
import { AnalysisResult } from '../types/index.js';
import { RiskMeter } from '../components/scanner/RiskMeter.js';
import { ShapWaterfall } from '../components/scanner/ShapWaterfall.js';
import { FeatureTable } from '../components/scanner/FeatureTable.js';
import { DisclaimerBanner } from '../components/scanner/DisclaimerBanner.js';

export const EmailAnalyzerPage: React.FC = () => {
  const [subject, setSubject] = useState('URGENT: Microsoft 365 Account Suspension Notice');
  const [senderEmail, setSenderEmail] = useState('security-alerts@mso-renew-support.info');
  const [senderName, setSenderName] = useState('Microsoft Support Desk');
  const [body, setBody] = useState(`Dear Valued Corporate Employee,

Your Microsoft 365 account password is set to expire within 2 hours. If you do not renew your authentication credentials immediately, your access to SharePoint, Outlook, and corporate teams will be permanently revoked.

Please click the secure validation link below to keep your password active:
http://mso-portal-renew.xyz/auth?user=victim

Thank you,
Corporate IT Security Department`);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);

    try {
      const res = await analyzeEmail({
        subject: subject.trim(),
        body: body.trim(),
        senderEmail: senderEmail.trim() || undefined,
        senderName: senderName.trim() || undefined
      });
      setResult(res);
      toast('Email payload classified successfully.', 'success');
    } catch (err: any) {
      toast('Error analyzing email: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">
          Email Header & Semantic Impersonation Analyzer
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Audits email subject lines, body text, and sender headers against social engineering vectors, credential theft prompts, and sender alignment discrepancies.
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                Sender Email (From: Header)
              </label>
              <input
                type="text"
                placeholder="e.g. security@paypal.com or spoofed domain"
                value={senderEmail}
                onChange={e => setSenderEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs font-mono text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                Display Name (Friendly From:)
              </label>
              <input
                type="text"
                placeholder="e.g. PayPal Support"
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Subject Line
            </label>
            <input
              type="text"
              placeholder="e.g. Action Required: Review recent invoice"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Email Body & Raw Hyperlinks <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1] font-sans"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => {
                setSubject('');
                setSenderEmail('');
                setSenderName('');
                setBody('');
              }}
              className="text-xs text-[#64748B] hover:text-[#172033] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              {loading ? 'Evaluating Email Risk...' : 'Analyze Email Payload'}
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
