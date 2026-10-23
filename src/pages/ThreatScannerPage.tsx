import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Link2, 
  Mail, 
  MessageSquare, 
  FileText, 
  Send, 
  Copy, 
  Download, 
  RotateCcw, 
  AlertCircle, 
  Check, 
  ThumbsDown, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { AnalysisResult, InputType } from '../types/index.js';
import { analyzeUrl, analyzeEmail, analyzeMessage, submitScanFeedback } from '../services/api.js';
import { toast } from '../components/common/Toast.js';
import { RiskMeter } from '../components/scanner/RiskMeter.js';
import { ShapWaterfall } from '../components/scanner/ShapWaterfall.js';
import { FeatureTable } from '../components/scanner/FeatureTable.js';
import { DisclaimerBanner } from '../components/scanner/DisclaimerBanner.js';

interface ThreatScannerPageProps {
  initialResult?: AnalysisResult | null;
}

export const ThreatScannerPage: React.FC<ThreatScannerPageProps> = ({ initialResult }) => {
  const [activeTab, setActiveTab] = useState<InputType>('url');
  
  // URL Form state
  const [urlInput, setUrlInput] = useState('');
  
  // Email Form state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  
  // Message Form state
  const [messageInput, setMessageInput] = useState('');
  const [senderPhone, setSenderPhone] = useState('');

  // Processing state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(initialResult || null);
  const [copied, setCopied] = useState(false);

  // Feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackLabel, setFeedbackLabel] = useState<'phishing' | 'legitimate'>('legitimate');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Quick Preset Samples
  const presets = [
    {
      title: 'PayPal Phishing URL',
      type: 'url' as InputType,
      run: () => {
        setActiveTab('url');
        setUrlInput('http://185.220.101.5:8080/paypal-security-update.xyz/login.php?user=verify');
      }
    },
    {
      title: 'Microsoft 365 Credential Scam',
      type: 'email' as InputType,
      run: () => {
        setActiveTab('email');
        setEmailSubject('URGENT: Microsoft 365 Account Suspension Notice');
        setEmailBody('Dear User,\nYour Office 365 mailbox password will expire in 2 hours. Failure to authenticate immediately will result in complete account deactivation. Click here to verify credentials: http://mso-portal-renew.xyz/auth');
        setSenderEmail('alerts@mail-security-notification.info');
        setSenderName('Microsoft Security Team');
      }
    },
    {
      title: 'USPS Redelivery Smishing',
      type: 'message' as InputType,
      run: () => {
        setActiveTab('message');
        setMessageInput('USPS: Package #US-89218 cannot be delivered due to missing postal street number. Update address within 24 hours at https://usps-redelivery-postal.top to prevent package return.');
        setSenderPhone('+1 (800) 275-8777');
      }
    },
    {
      title: 'Legitimate GitHub Link',
      type: 'url' as InputType,
      run: () => {
        setActiveTab('url');
        setUrlInput('https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions');
      }
    },
    {
      title: 'Legitimate Corporate Email',
      type: 'email' as InputType,
      run: () => {
        setActiveTab('email');
        setEmailSubject('Quarterly Engineering Sprint Architecture Sync');
        setEmailBody('Hi team,\nHere are the notes from our morning architectural review. Please take a look at the proposed schema updates before our demo tomorrow. Have a great afternoon!\nBest,\nAlex Chen');
        setSenderEmail('alex.chen@acme-corp.com');
        setSenderName('Alex Chen');
      }
    }
  ];

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result: AnalysisResult;
      if (activeTab === 'url') {
        if (!urlInput.trim()) {
          setError('Please provide a URL to analyze.');
          setLoading(false);
          return;
        }
        result = await analyzeUrl(urlInput.trim());
      } else if (activeTab === 'email') {
        if (!emailBody.trim()) {
          setError('Email body is required.');
          setLoading(false);
          return;
        }
        result = await analyzeEmail({
          subject: emailSubject,
          body: emailBody,
          senderEmail: senderEmail || undefined,
          senderName: senderName || undefined
        });
      } else {
        if (!messageInput.trim()) {
          setError('Message text is required.');
          setLoading(false);
          return;
        }
        result = await analyzeMessage(messageInput.trim(), senderPhone || undefined);
      }

      setCurrentResult(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during threat scanning.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJSON = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(JSON.stringify(currentResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!currentResult) return;
    const reportText = `=====================================================
PHISHNET AI THREAT AUDIT REPORT
=====================================================
Scan ID: ${currentResult.id}
Timestamp: ${currentResult.createdAt}
Model Version: ${currentResult.modelVersion}
Input Type: ${currentResult.inputType.toUpperCase()}
Input Hash (SHA-256): ${currentResult.inputHash}

RISK EVALUATION
-----------------------------------------------------
Risk Score: ${currentResult.riskScore} / 100
Risk Category: ${currentResult.riskLevel}
Confidence: ${(currentResult.confidence * 100).toFixed(1)}%
Calibrated Probability: ${(currentResult.calibratedProbability * 100).toFixed(1)}%
Execution Latency: ${currentResult.executionTimeMs} ms

EXECUTIVE SUMMARY
-----------------------------------------------------
${currentResult.explanationSummary}

TOP DETECTED INDICATORS
-----------------------------------------------------
${currentResult.topIndicators.map(i => '- ' + i).join('\n')}

RECOMMENDED MITIGATION ACTIONS
-----------------------------------------------------
${currentResult.recommendedActions.map(a => '- ' + a).join('\n')}

EXTRACTED FEATURE VECTOR (${currentResult.features.length} Signals)
-----------------------------------------------------
${currentResult.features.map(f => `[${f.category.toUpperCase()}] ${f.name} = ${f.value} (Impact: ${f.impact}, Weight: ${f.weight})`).join('\n')}

DISCLAIMER
-----------------------------------------------------
Model predictions are statistical approximations trained on benchmark datasets, 
not mathematical warranties. Always exercise defense-in-depth verification.
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishnet-report-${currentResult.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResult) return;
    try {
      await submitScanFeedback(currentResult.id, feedbackLabel, feedbackNotes);
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackSubmitted(false);
        setFeedbackNotes('');
      }, 1500);
    } catch (err: any) {
      toast('Failed to submit feedback: ' + err.message, 'error');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Title & Presets */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Unified Threat Scanner
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Submit a suspicious URL, email payload, or SMS message to run multi-signal feature extraction and machine learning classification.
          </p>
        </div>

        {/* Quick Presets Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#4169E1]" /> Quick Presets:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={p.run}
              className="text-xs px-2.5 py-1 bg-white hover:bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0] rounded-md transition-colors"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scanner Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'url'
                ? 'border-[#4169E1] text-[#4169E1] bg-white'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>URL Scanner</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'email'
                ? 'border-[#4169E1] text-[#4169E1] bg-white'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Analyzer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('message')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'message'
                ? 'border-[#4169E1] text-[#4169E1] bg-white'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>SMS & Message</span>
          </button>
        </div>

        {/* Input Forms */}
        <form onSubmit={handleScan} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#172033] block">
                Target URL or Hostname
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="e.g. http://185.220.101.5:8080/secure-update/chase-login.php"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1] focus:border-[#4169E1] transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-[#64748B]">
                PhishNet extracts lexical, subdomain, entropy, punycode, and TLD characteristics without loading external scripts or following redirects.
              </p>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#172033] block mb-1">
                    Sender Email Address (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. alerts@security-update-chase.xyz"
                    value={senderEmail}
                    onChange={e => setSenderEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#172033] block mb-1">
                    Sender Display Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chase Fraud Prevention"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#172033] block mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  placeholder="e.g. URGENT: Unauthorized login detected on your account"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#172033] block mb-1">
                  Email Body Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste email message text, headers, and hyperlinks..."
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
                />
              </div>
            </div>
          )}

          {activeTab === 'message' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#172033] block mb-1">
                  Sender Phone / Shortcode (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 (800) 275-8777 or shortcode 49182"
                  value={senderPhone}
                  onChange={e => setSenderPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#172033] block mb-1">
                  SMS / Chat Message Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste SMS text, OTP solicitation, parcel tracking, or WhatsApp scam message..."
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
                />
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setUrlInput('');
                setEmailSubject('');
                setEmailBody('');
                setSenderEmail('');
                setSenderName('');
                setMessageInput('');
                setSenderPhone('');
                setError(null);
              }}
              className="text-xs text-[#64748B] hover:text-[#172033] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Inputs</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4169E1] hover:bg-[#3657C3] disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Evaluating Model Inference...' : 'Analyze Threat Signals'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {currentResult && (
        <div className="space-y-6 pt-2">
          {/* Top Result Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[#172033]">Scan Reference:</span>
                <span className="font-mono text-[#4169E1]">{currentResult.id}</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="text-[#64748B] font-mono text-[11px] truncate max-w-xs">
                  SHA-256: {currentResult.inputHash.substring(0, 16)}...
                </span>
              </div>
              <div className="text-xs text-[#64748B] mt-1">
                Audited at {new Date(currentResult.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs font-medium text-[#334155] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadReport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs font-medium text-[#334155] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Export Report</span>
              </button>
              <button
                type="button"
                onClick={() => setShowFeedbackModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs font-medium text-[#334155] transition-colors"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Feedback</span>
              </button>
            </div>
          </div>

          {/* Threat Intelligence Alert if matched */}
          {currentResult.threatIntelMatch?.matched && (
            <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg flex items-start gap-3 text-xs text-red-900">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-red-800 text-sm">
                  Active Threat Intelligence Feed Match ({currentResult.threatIntelMatch.severity?.toUpperCase()})
                </div>
                <p className="mt-1 text-red-800">
                  This indicator was positively matched against verified blacklist feeds from <strong>{currentResult.threatIntelMatch.source}</strong>.
                  Indicator: <code className="font-mono bg-red-100 px-1 py-0.5 rounded-sm">{currentResult.threatIntelMatch.indicator}</code>
                </p>
              </div>
            </div>
          )}

          {/* Calibrated Risk Score Meter */}
          <RiskMeter
            score={currentResult.riskScore}
            level={currentResult.riskLevel}
            confidence={currentResult.confidence}
            probability={currentResult.calibratedProbability}
            latencyMs={currentResult.executionTimeMs}
            modelVersion={currentResult.modelVersion}
          />

          {/* Analysis Summary & Key Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Summary & Recommendations */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-semibold text-[#172033]">Analytical Summary</h3>
                <p className="text-xs text-[#475569] mt-1.5 leading-relaxed bg-[#F8FAFC] p-3 rounded-md border border-[#E2E8F0]">
                  {currentResult.explanationSummary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#172033] uppercase tracking-wider mb-2">
                  Recommended Mitigation Protocol
                </h4>
                <ul className="space-y-1.5 text-xs text-[#334155]">
                  {currentResult.recommendedActions.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4169E1] shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Top Indicators */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 space-y-3 shadow-xs">
              <h3 className="text-sm font-semibold text-[#172033]">
                Strongest Detected Signals ({currentResult.topIndicators.length})
              </h3>
              <div className="space-y-2">
                {currentResult.topIndicators.map((ind, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                    <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
                      currentResult.riskLevel === 'High Risk' ? 'text-red-600' : 'text-[#4169E1]'
                    }`} />
                    <span className="font-medium text-[#172033]">{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explainable AI SHAP Waterfall */}
          <ShapWaterfall explanations={currentResult.shapExplanations} />

          {/* Extracted Feature Vector */}
          <FeatureTable features={currentResult.features} />

          {/* Disclaimer */}
          <DisclaimerBanner />
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-md w-full p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-[#172033]">
              Submit Model Prediction Feedback
            </h3>
            <p className="text-xs text-[#64748B]">
              Provide feedback for retraining validation. User feedback is audited before inclusion in training sets.
            </p>

            {feedbackSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-md text-center font-medium">
                Feedback submitted successfully. Thank you for improving PhishNet AI!
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-[#172033] block mb-1">
                    What should the correct classification be?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="correctLabel"
                        checked={feedbackLabel === 'legitimate'}
                        onChange={() => setFeedbackLabel('legitimate')}
                      />
                      <span>Legitimate (Benign / Ham)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="correctLabel"
                        checked={feedbackLabel === 'phishing'}
                        onChange={() => setFeedbackLabel('phishing')}
                      />
                      <span>Phishing / Malicious</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-medium text-[#172033] block mb-1">
                    Cybersecurity Analyst Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe why this prediction was false positive or false negative..."
                    value={feedbackNotes}
                    onChange={e => setFeedbackNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#172033]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#172033]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#4169E1] hover:bg-[#3657C3] text-white text-xs font-medium rounded-md"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
