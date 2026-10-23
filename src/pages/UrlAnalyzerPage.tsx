import React, { useState } from 'react';
import { 
  Link2, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Hash
} from 'lucide-react';
import { extractUrlFeatures, UrlAnalysisFeatures } from '../server/features/urlFeatures.js';
import { analyzeUrl } from '../services/api.js';
import { toast } from '../components/common/Toast.js';
import { AnalysisResult } from '../types/index.js';
import { FeatureTable } from '../components/scanner/FeatureTable.js';
import { RiskMeter } from '../components/scanner/RiskMeter.js';
import { DisclaimerBanner } from '../components/scanner/DisclaimerBanner.js';

export const UrlAnalyzerPage: React.FC = () => {
  const [urlInput, setUrlInput] = useState('http://185.220.101.5:8080/paypal-security-update.xyz/login.php?user=verify');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [lexicalFeatures, setLexicalFeatures] = useState<UrlAnalysisFeatures | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setLoading(true);

    try {
      // Calculate local lexical feature extraction
      const feat = extractUrlFeatures(urlInput.trim());
      setLexicalFeatures(feat);

      // Call API for persisted classification
      const res = await analyzeUrl(urlInput.trim());
      setResult(res);
      toast('URL forensic signals analyzed and persisted.', 'success');
    } catch (err: any) {
      toast('Error analyzing URL: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const sampleUrls = [
    { label: 'Raw IP with non-standard port', val: 'http://185.220.101.5:8080/auth/login.html' },
    { label: 'Punycode Cyrillic Spoof', val: 'http://xn--pple-43d.com/secure-login' },
    { label: 'URL Shortener Payload', val: 'http://bit.ly/3x89aFz' },
    { label: 'Excessive Subdomains + High TLD Risk', val: 'http://secure.login.verify.account.chase.top/update' },
    { label: 'Verified Benign Developer Domain', val: 'https://developer.mozilla.org/en-US/docs/Web/API/URL' }
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">
          URL Forensic Feature Engineering Workbench
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Deep structural analysis of Uniform Resource Identifiers. Evaluates protocol integrity, Shannon entropy, homoglyph punycode attacks, and suspicious parameter trees.
        </p>
      </div>

      {/* URL Input Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-3">
        <form onSubmit={handleAnalyze} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Enter URL to inspect..."
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs font-mono text-[#172033] placeholder-[#94A3B8] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer shrink-0"
            >
              {loading ? 'Inspecting Anatomy...' : 'Inspect URL'}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#64748B]">
            <span className="font-medium">Samples:</span>
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUrlInput(s.val);
                }}
                className="hover:text-[#4169E1] hover:underline"
              >
                {s.label} {idx < sampleUrls.length - 1 && '·'}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* URL Structural Anatomy Breakdown */}
      {lexicalFeatures && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#172033]">
              URL Anatomy & Decomposition
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md">
                <span className="text-[10px] text-[#64748B] block font-mono">SCHEME</span>
                <span className="font-mono font-semibold text-[#172033] mt-0.5 block">
                  {lexicalFeatures.scheme.toUpperCase()}
                </span>
                <span className={`text-[10px] mt-1 block ${
                  lexicalFeatures.scheme === 'https' ? 'text-emerald-600' : 'text-red-600 font-medium'
                }`}>
                  {lexicalFeatures.scheme === 'https' ? 'Encrypted TLS' : 'Unencrypted Cleartext'}
                </span>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md">
                <span className="text-[10px] text-[#64748B] block font-mono">HOSTNAME / IP</span>
                <span className="font-mono font-semibold text-[#172033] mt-0.5 block truncate">
                  {lexicalFeatures.hostname}
                </span>
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  {lexicalFeatures.isIpHost ? 'Raw IP Address' : 'Registered Domain'}
                </span>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md">
                <span className="text-[10px] text-[#64748B] block font-mono">SHANNON ENTROPY</span>
                <span className="font-mono font-semibold text-[#4169E1] mt-0.5 block">
                  {lexicalFeatures.shannonEntropy} bits
                </span>
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  {lexicalFeatures.shannonEntropy > 3.8 ? 'Elevated Randomness (DGA)' : 'Natural Vocabulary'}
                </span>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md">
                <span className="text-[10px] text-[#64748B] block font-mono">TARGET PORT</span>
                <span className="font-mono font-semibold text-[#172033] mt-0.5 block">
                  {lexicalFeatures.port || (lexicalFeatures.scheme === 'https' ? '443 (Default)' : '80 (Default)')}
                </span>
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  {lexicalFeatures.port && !['80', '443'].includes(lexicalFeatures.port) ? 'Non-Standard Port' : 'Standard Port'}
                </span>
              </div>
            </div>

            {/* Path & Query String */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#64748B] font-mono w-16 shrink-0">PATH:</span>
                <span className="font-mono text-[11px] text-[#172033] truncate">{lexicalFeatures.path || '/'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#64748B] font-mono w-16 shrink-0">QUERY:</span>
                <span className="font-mono text-[11px] text-[#4169E1] truncate">{lexicalFeatures.query || '(None)'}</span>
              </div>
            </div>
          </div>

          {result && (
            <>
              <RiskMeter
                score={result.riskScore}
                level={result.riskLevel}
                confidence={result.confidence}
                probability={result.calibratedProbability}
                latencyMs={result.executionTimeMs}
                modelVersion={result.modelVersion}
              />
              <FeatureTable features={result.features} />
            </>
          )}

          <DisclaimerBanner />
        </div>
      )}
    </div>
  );
};
