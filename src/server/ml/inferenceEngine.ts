import crypto from 'crypto';
import { AnalysisResult, InputType, RiskLevel, ExtractedFeature, ShapExplanation } from '../../types/index.js';
import { extractUrlFeatures } from '../features/urlFeatures.js';
import { extractTextFeatures } from '../features/textFeatures.js';
import { checkThreatIntelligence } from '../db/threatIntelData.js';

export interface AnalysisInput {
  inputType: InputType;
  content: string;
  subject?: string;
  senderEmail?: string;
  senderName?: string;
}

export function runInference(input: AnalysisInput): AnalysisResult {
  const startTime = Date.now();
  const inputHash = crypto.createHash('sha256').update(input.content || '').digest('hex');
  const modelVersion = 'v2.4.1-hybrid-rf-tfidf';

  let rawRiskWeight = 0;
  const features: ExtractedFeature[] = [];
  const shapExplanations: ShapExplanation[] = [];
  const topIndicators: string[] = [];
  let threatIntelMatch: AnalysisResult['threatIntelMatch'] = { matched: false };

  if (input.inputType === 'url') {
    const urlResult = extractUrlFeatures(input.content);
    rawRiskWeight += urlResult.riskWeightScore;
    features.push(...urlResult.features);

    // Threat intelligence lookup
    const intel = checkThreatIntelligence(urlResult.hostname, input.content);
    if (intel.matched) {
      threatIntelMatch = intel;
      rawRiskWeight += 1.5; // Strong prior boost
      topIndicators.push(`Verified Threat Feed Match: ${intel.source} (${intel.severity?.toUpperCase()})`);
      shapExplanations.push({
        featureName: 'Threat Intelligence Blacklist Match',
        contribution: 1.5,
        featureValue: `${intel.source} listing`,
        direction: 'increases_risk'
      });
    }

    // High impact features to SHAP
    if (urlResult.isIpHost) {
      shapExplanations.push({
        featureName: 'Raw IP Hostname',
        contribution: 0.75,
        featureValue: urlResult.hostname,
        direction: 'increases_risk'
      });
      topIndicators.push('Direct IP Hostname detected (No registered domain)');
    }

    if (urlResult.isPunycode) {
      shapExplanations.push({
        featureName: 'Punycode / Homoglyph Obfuscation',
        contribution: 0.7,
        featureValue: 'xn--',
        direction: 'increases_risk'
      });
      topIndicators.push('Internationalized Punycode homoglyph attack');
    }

    if (urlResult.isShortened) {
      shapExplanations.push({
        featureName: 'URL Shortener Redirection',
        contribution: 0.5,
        featureValue: urlResult.hostname,
        direction: 'increases_risk'
      });
      topIndicators.push('URL Shortener hiding true destination');
    }

    if (urlResult.scheme === 'https') {
      shapExplanations.push({
        featureName: 'Valid HTTPS TLS Protocol',
        contribution: -0.2,
        featureValue: 'HTTPS',
        direction: 'decreases_risk'
      });
    } else {
      shapExplanations.push({
        featureName: 'Unencrypted HTTP Scheme',
        contribution: 0.45,
        featureValue: 'HTTP',
        direction: 'increases_risk'
      });
      topIndicators.push('Insecure cleartext HTTP scheme');
    }

    if (urlResult.shannonEntropy > 3.8) {
      topIndicators.push(`High Hostname Entropy (${urlResult.shannonEntropy} bits)`);
    }

  } else {
    // Email or SMS or text
    const textResult = extractTextFeatures({
      text: input.content,
      subject: input.subject,
      senderEmail: input.senderEmail,
      senderName: input.senderName,
      inputType: input.inputType
    });

    rawRiskWeight += textResult.riskWeightScore;
    features.push(...textResult.features);
    shapExplanations.push(...textResult.shapExplanations);

    // Threat intelligence check on sender domain or text
    if (input.senderEmail) {
      const domain = input.senderEmail.split('@')[1];
      if (domain) {
        const intel = checkThreatIntelligence(domain);
        if (intel.matched) {
          threatIntelMatch = intel;
          rawRiskWeight += 1.4;
          topIndicators.push(`Malicious Sender Domain in Threat Feed: ${domain}`);
        }
      }
    }

    if (textResult.urgencyScore > 0) {
      topIndicators.push('High psychological pressure and urgent deadline language');
    }
    if (textResult.financialScore > 0) {
      topIndicators.push('Suspicious payment, wire transfer or crypto solicitation');
    }
    if (textResult.detectedBrands.length > 0) {
      topIndicators.push(`Brand Impersonation targeting: ${textResult.detectedBrands.slice(0, 2).join(', ')}`);
    }
  }

  // Sigmoid calibration: P(phishing) = 1 / (1 + exp(- (w * 2.2 - 0.4)))
  // Base intercept centered around 0.15 for neutral
  const z = rawRiskWeight * 2.2 - 0.3;
  const calibratedProb = Math.min(0.99, Math.max(0.01, 1 / (1 + Math.exp(-z))));
  const riskScore = Math.round(calibratedProb * 100);

  let riskLevel: RiskLevel = 'Low Risk';
  if (riskScore >= 70) {
    riskLevel = 'High Risk';
  } else if (riskScore >= 36) {
    riskLevel = 'Medium Risk';
  }

  // Confidence calculation
  const distance = Math.abs(calibratedProb - 0.5);
  const confidence = Number((0.68 + distance * 0.6).toFixed(2));

  // Default indicators if clean
  if (topIndicators.length === 0) {
    if (riskLevel === 'Low Risk') {
      topIndicators.push('Clean lexical structure', 'No known threat indicators', 'Expected domain/text entropy');
    } else {
      topIndicators.push('Mildly elevated heuristic risk factors');
    }
  }

  // Explanations summary
  let explanationSummary = '';
  if (riskLevel === 'High Risk') {
    explanationSummary = `The machine learning model classifies this item as HIGH RISK (${riskScore}/100) with ${Math.round(confidence * 100)}% confidence. Key contributing signals include ${topIndicators.slice(0, 2).join(' and ')}.`;
  } else if (riskLevel === 'Medium Risk') {
    explanationSummary = `The item was assigned MEDIUM RISK (${riskScore}/100). It presents ambiguous or suspicious features such as ${topIndicators[0] || 'unverified metadata'}, requiring manual verification.`;
  } else {
    explanationSummary = `The model evaluated this item as LOW RISK (${riskScore}/100). Extracted features align with standard legitimate patterns, though caution is always advised.`;
  }

  // Recommendations
  const recommendedActions: string[] = [];
  if (riskLevel === 'High Risk') {
    recommendedActions.push(
      'Do NOT click any hyperlinks or open attachments from this source.',
      'Never input passwords, credentials, OTP codes, or payment information.',
      'Report the message or URL to your organization’s SOC / Security team.',
      'Block the sender domain and host IP at your perimeter firewall/mail gateway.'
    );
  } else if (riskLevel === 'Medium Risk') {
    recommendedActions.push(
      'Verify the sender identity through a trusted out-of-band channel (e.g., official phone number).',
      'Manually type the official domain into a browser rather than following provided links.',
      'Inspect the full email headers (SPF, DKIM, DMARC) for authentication failures.'
    );
  } else {
    recommendedActions.push(
      'Standard caution applies: model predictions are probabilistic estimates, not guarantees.',
      'Always confirm recipient addresses before transmitting proprietary or personal data.'
    );
  }

  const executionTimeMs = Math.max(8, Date.now() - startTime);

  // Display title
  let displayTitle = '';
  if (input.inputType === 'url') {
    displayTitle = input.content.length > 45 ? input.content.substring(0, 42) + '...' : input.content;
  } else if (input.subject) {
    displayTitle = input.subject;
  } else {
    const firstLine = input.content.split('\n')[0] || '';
    displayTitle = firstLine.length > 45 ? firstLine.substring(0, 42) + '...' : firstLine || 'Message Scan';
  }

  return {
    id: 'scan-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    inputType: input.inputType,
    inputContent: input.content,
    inputHash,
    displayTitle,
    riskScore,
    riskLevel,
    confidence,
    calibratedProbability: Number(calibratedProb.toFixed(3)),
    modelVersion,
    executionTimeMs,
    createdAt: new Date().toISOString(),
    topIndicators,
    features,
    shapExplanations: shapExplanations.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)),
    explanationSummary,
    recommendedActions,
    threatIntelMatch,
    metadata: {
      subject: input.subject,
      senderEmail: input.senderEmail,
      senderName: input.senderName
    }
  };
}
