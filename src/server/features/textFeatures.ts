import { ExtractedFeature, ShapExplanation } from '../../types/index.js';

export interface TextAnalysisInput {
  text: string;
  subject?: string;
  senderEmail?: string;
  senderName?: string;
  inputType: 'email' | 'message' | 'text';
}

export interface TextAnalysisFeatures {
  features: ExtractedFeature[];
  shapExplanations: ShapExplanation[];
  riskWeightScore: number;
  detectedBrands: string[];
  urgencyScore: number;
  financialScore: number;
  topTerms: { term: string; weight: number }[];
}

const URGENCY_TRIGGERS = [
  'immediate action', 'immediately', 'suspended', 'suspension', 'deactivated',
  'within 24 hours', 'within 12 hours', 'expires today', 'final notice',
  'urgent notice', 'legal action', 'law enforcement', 'arrest warrant',
  'security alert', 'unauthorized access', 'account termination', 'locked'
];

const FINANCIAL_TRIGGERS = [
  'wire transfer', 'cryptocurrency', 'bitcoin', 'usdt', 'gift card',
  'apple card', 'steam card', 'direct deposit', 'tax refund', 'lottery winner',
  'inheritance', 'western union', 'moneygram', 'cash app', 'zelle',
  'bank account', 'routing number', 'credit card', 'cvv', 'ssn', 'social security'
];

const CREDENTIAL_TRIGGERS = [
  'password', 'passcode', 'one-time password', 'otp', 'security pin',
  'verify identity', 'confirm your credentials', 'reset your password',
  'sign in to verify', 'update your account', 'validation code'
];

const BRANDS = [
  { name: 'PayPal', patterns: ['paypal', 'pay-pal'], trustedDomain: 'paypal.com' },
  { name: 'Microsoft / Office 365', patterns: ['microsoft', 'office 365', 'outlook', 'azure', 'sharepoint'], trustedDomain: 'microsoft.com' },
  { name: 'Apple / iCloud', patterns: ['apple', 'icloud', 'apple id', 'itunes'], trustedDomain: 'apple.com' },
  { name: 'Amazon', patterns: ['amazon', 'prime membership'], trustedDomain: 'amazon.com' },
  { name: 'Netflix', patterns: ['netflix', 'subscription renewal'], trustedDomain: 'netflix.com' },
  { name: 'Chase Bank', patterns: ['chase', 'jpmorgan'], trustedDomain: 'chase.com' },
  { name: 'Bank of America', patterns: ['bank of america', 'bofa'], trustedDomain: 'bankofamerica.com' },
  { name: 'Wells Fargo', patterns: ['wells fargo'], trustedDomain: 'wellsfargo.com' },
  { name: 'USPS / Postal', patterns: ['usps', 'postal service', 'delivery package', 'undelivered parcel'], trustedDomain: 'usps.com' },
  { name: 'DHL Express', patterns: ['dhl', 'shipment tracking'], trustedDomain: 'dhl.com' },
  { name: 'Geek Squad', patterns: ['geek squad', 'best buy renewal', 'antivirus renewal'], trustedDomain: 'bestbuy.com' }
];

export function extractTextFeatures(input: TextAnalysisInput): TextAnalysisFeatures {
  const fullText = `${input.subject ? input.subject + '\n' : ''}${input.text}`.trim();
  const lowerText = fullText.toLowerCase();

  const features: ExtractedFeature[] = [];
  const shapExplanations: ShapExplanation[] = [];
  let riskWeight = 0;

  // 1. Urgency & Coercion Detection
  const matchedUrgency = URGENCY_TRIGGERS.filter(trigger => lowerText.includes(trigger));
  const urgencyCount = matchedUrgency.length;
  if (urgencyCount > 0) {
    const w = Math.min(0.85, 0.35 + urgencyCount * 0.15);
    features.push({
      name: 'High Urgency / Coercive Psychological Trigger',
      category: 'urgency',
      value: matchedUrgency.slice(0, 3).join(', '),
      impact: 'phishing',
      weight: w,
      description: `Pressure tactics detected: [${matchedUrgency.slice(0, 3).join(', ')}]. Scammers engineer false urgency to bypass cognitive scrutiny.`
    });
    shapExplanations.push({
      featureName: 'Urgency Language',
      contribution: Number(w.toFixed(2)),
      featureValue: `${urgencyCount} triggers (${matchedUrgency[0]})`,
      direction: 'increases_risk'
    });
    riskWeight += w;
  } else {
    features.push({
      name: 'Urgency & Pressure Language',
      category: 'urgency',
      value: 'None detected',
      impact: 'legitimate',
      weight: -0.15,
      description: 'Tone is standard without artificial time pressures or threats of sudden account termination.'
    });
    shapExplanations.push({
      featureName: 'Absence of Urgency Triggers',
      contribution: -0.15,
      featureValue: 'Calm narrative',
      direction: 'decreases_risk'
    });
    riskWeight -= 0.15;
  }

  // 2. Financial & Payment Solicitations
  const matchedFinancial = FINANCIAL_TRIGGERS.filter(trigger => lowerText.includes(trigger));
  if (matchedFinancial.length > 0) {
    const w = Math.min(0.9, 0.4 + matchedFinancial.length * 0.15);
    features.push({
      name: 'Financial / Monetary / Gift Card Request',
      category: 'financial',
      value: matchedFinancial.slice(0, 3).join(', '),
      impact: 'phishing',
      weight: w,
      description: `Unusual financial transfer or gift card demand detected: [${matchedFinancial.slice(0, 3).join(', ')}].`
    });
    shapExplanations.push({
      featureName: 'Financial / Payment Request',
      contribution: Number(w.toFixed(2)),
      featureValue: matchedFinancial.slice(0, 2).join(', '),
      direction: 'increases_risk'
    });
    riskWeight += w;
  }

  // 3. Credential Harvesting Signals
  const matchedCredentials = CREDENTIAL_TRIGGERS.filter(trigger => lowerText.includes(trigger));
  if (matchedCredentials.length > 0) {
    const w = Math.min(0.8, 0.4 + matchedCredentials.length * 0.12);
    features.push({
      name: 'Credential & Authentication Solicitation',
      category: 'semantic',
      value: matchedCredentials.slice(0, 3).join(', '),
      impact: 'phishing',
      weight: w,
      description: `Targeting sensitive credentials/OTP: [${matchedCredentials.slice(0, 3).join(', ')}].`
    });
    shapExplanations.push({
      featureName: 'Credential Solicitation',
      contribution: Number(w.toFixed(2)),
      featureValue: matchedCredentials[0],
      direction: 'increases_risk'
    });
    riskWeight += w;
  }

  // 4. Brand Impersonation & Sender Alignment
  const detectedBrands: string[] = [];
  for (const brand of BRANDS) {
    if (brand.patterns.some(p => lowerText.includes(p))) {
      detectedBrands.push(brand.name);
    }
  }

  if (detectedBrands.length > 0) {
    let senderMismatch = false;
    if (input.senderEmail) {
      const senderDomain = input.senderEmail.split('@')[1]?.toLowerCase() || '';
      const matchingBrandObj = BRANDS.find(b => detectedBrands.includes(b.name));
      if (matchingBrandObj && !senderDomain.endsWith(matchingBrandObj.trustedDomain)) {
        senderMismatch = true;
      }
    }

    if (senderMismatch) {
      const w = 0.95;
      features.push({
        name: 'Brand Impersonation & Sender Domain Mismatch',
        category: 'domain',
        value: `Claims: ${detectedBrands.join(', ')} | From: ${input.senderEmail}`,
        impact: 'phishing',
        weight: w,
        description: `CRITICAL: The content references ${detectedBrands.join(', ')}, but sender (${input.senderEmail}) is not an authentic brand infrastructure domain.`
      });
      shapExplanations.push({
        featureName: 'Brand Domain Mismatch',
        contribution: 0.95,
        featureValue: `${detectedBrands[0]} vs ${input.senderEmail}`,
        direction: 'increases_risk'
      });
      riskWeight += w;
    } else {
      features.push({
        name: 'Targeted High-Value Brand References',
        category: 'semantic',
        value: detectedBrands.join(', '),
        impact: 'phishing',
        weight: 0.25,
        description: `Entity recognition identified brand targets: [${detectedBrands.join(', ')}]. Highly targeted in social engineering.`
      });
      riskWeight += 0.25;
    }
  }

  // 5. Stylometry & Structural Anomalies
  // ALL-CAPS ratio
  const letters = fullText.replace(/[^a-zA-Z]/g, '');
  const uppercaseLetters = fullText.replace(/[^A-Z]/g, '');
  const capsRatio = letters.length > 0 ? uppercaseLetters.length / letters.length : 0;
  if (capsRatio > 0.28 && letters.length > 20) {
    features.push({
      name: 'Elevated Uppercase Character Ratio (Shouting)',
      category: 'structural',
      value: `${(capsRatio * 100).toFixed(1)}% uppercase`,
      impact: 'phishing',
      weight: 0.3,
      description: 'Abnormal uppercase capitalization used to induce alarm or simulate urgent notifications.'
    });
    riskWeight += 0.3;
  }

  // Exclamation and currency marks
  const exclamationCount = (fullText.match(/!/g) || []).length;
  if (exclamationCount >= 3) {
    features.push({
      name: 'Excessive Exclamation Density',
      category: 'structural',
      value: `${exclamationCount} exclamation marks`,
      impact: 'phishing',
      weight: 0.2,
      description: 'Multiple exclamation points commonly used in scam calls to action.'
    });
    riskWeight += 0.2;
  }

  // Currency symbols
  const currencyCount = (fullText.match(/[\$€£₹]/g) || []).length;
  if (currencyCount >= 2) {
    features.push({
      name: 'Currency Symbol Frequency',
      category: 'financial',
      value: `${currencyCount} currency symbols`,
      impact: 'phishing',
      weight: 0.25,
      description: 'Presence of direct money/currency symbols.'
    });
    riskWeight += 0.25;
  }

  // 6. Embedded URLs detection in message/email text
  const urlMatches = fullText.match(/https?:\/\/[^\s]+/gi) || [];
  if (urlMatches.length > 0) {
    features.push({
      name: 'Embedded Action Links Count',
      category: 'structural',
      value: `${urlMatches.length} link(s) embedded`,
      impact: 'phishing',
      weight: 0.3,
      description: `Contains ${urlMatches.length} hyperlink(s). Phishing campaigns rely on clickable calls-to-action.`
    });
    shapExplanations.push({
      featureName: 'Embedded Hyperlink Payload',
      contribution: 0.3,
      featureValue: `${urlMatches.length} URLs`,
      direction: 'increases_risk'
    });
    riskWeight += 0.3;
  }

  // Word token extraction for TF-IDF ranking
  const words = lowerText
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3);

  const wordFreq = new Map<string, number>();
  for (const w of words) {
    wordFreq.set(w, (wordFreq.get(w) || 0) + 1);
  }

  // Top terms contribution
  const topTerms: { term: string; weight: number }[] = [];
  const spamLexicon = new Set([...URGENCY_TRIGGERS, ...FINANCIAL_TRIGGERS, ...CREDENTIAL_TRIGGERS, 'free', 'win', 'claim', 'winner', 'click', 'account']);
  
  for (const [w, count] of wordFreq.entries()) {
    if (spamLexicon.has(w)) {
      topTerms.push({ term: w, weight: count * 0.18 });
    }
  }

  if (topTerms.length > 0) {
    shapExplanations.push({
      featureName: 'TF-IDF Lexical Feature Contributions',
      contribution: Number((topTerms.reduce((acc, t) => acc + t.weight, 0) / topTerms.length).toFixed(2)),
      featureValue: topTerms.slice(0, 3).map(t => t.term).join(', '),
      direction: 'increases_risk'
    });
  }

  return {
    features,
    shapExplanations,
    riskWeightScore: riskWeight,
    detectedBrands,
    urgencyScore: urgencyCount,
    financialScore: matchedFinancial.length,
    topTerms
  };
}
