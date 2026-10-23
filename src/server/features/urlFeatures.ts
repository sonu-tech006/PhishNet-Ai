import { ExtractedFeature } from '../../types/index.js';

export interface UrlAnalysisFeatures {
  url: string;
  scheme: string;
  hostname: string;
  port: string;
  path: string;
  query: string;
  features: ExtractedFeature[];
  shannonEntropy: number;
  isShortened: boolean;
  isIpHost: boolean;
  isPunycode: boolean;
  riskWeightScore: number;
}

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 
  'adf.ly', 'bit.do', 'cutt.ly', 'shorte.st', 'rb.gy', 'v.gd', 'trib.al'
]);

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'work', 'loan', 'zip', 'mov', 'click', 'country', 'stream',
  'gq', 'cf', 'tk', 'ml', 'ga', 'buzz', 'rest', 'fit', 'racing', 'icu'
]);

const PHISHING_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'account', 'update',
  'banking', 'authenticate', 'wallet', 'confirm', 'password', 'suspend',
  'security', 'billing', 'invoice', 'free-gift', 'prize', 'claim', 'service',
  'appleid', 'microsoft-online', 'paypal', 'chase-security', 'wellsfargo'
];

// Shannon Entropy calculation for domain/path randomness
export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  const frequencies = new Map<string, number>();
  for (const char of str) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }
  let entropy = 0;
  const len = str.length;
  for (const count of frequencies.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

export function extractUrlFeatures(inputUrl: string): UrlAnalysisFeatures {
  let normalized = inputUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'http://' + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    // Fallback for malformed URLs
    parsed = new URL('http://malformed-url.local');
  }

  const hostname = parsed.hostname.toLowerCase();
  const path = parsed.pathname;
  const query = parsed.search;
  const scheme = parsed.protocol.replace(':', '').toLowerCase();
  const port = parsed.port;

  const features: ExtractedFeature[] = [];
  let riskWeight = 0;

  // 1. HTTPS Scheme Presence
  const isHttps = scheme === 'https';
  features.push({
    name: 'Protocol Scheme (HTTPS)',
    category: 'lexical',
    value: scheme.toUpperCase(),
    impact: isHttps ? 'legitimate' : 'phishing',
    weight: isHttps ? -0.2 : 0.45,
    description: isHttps 
      ? 'Encrypted TLS communication detected.'
      : 'Insecure unencrypted HTTP scheme. Common in opportunistic credential harvesting.'
  });
  riskWeight += isHttps ? -0.2 : 0.45;

  // 2. IP Address as Hostname
  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[');
  features.push({
    name: 'IP Address as Hostname',
    category: 'domain',
    value: isIp ? 'Yes (Raw IP)' : 'No (Registered Domain)',
    impact: isIp ? 'phishing' : 'legitimate',
    weight: isIp ? 0.75 : -0.1,
    description: isIp 
      ? 'Direct IP access bypasses domain reputation and DNS security controls.'
      : 'Valid alphanumeric domain name structure.'
  });
  if (isIp) riskWeight += 0.75;

  // 3. URL Length
  const urlLen = inputUrl.length;
  const isLong = urlLen > 75;
  features.push({
    name: 'URL Total Length',
    category: 'lexical',
    value: `${urlLen} characters`,
    impact: isLong ? 'phishing' : 'neutral',
    weight: isLong ? 0.35 : 0.0,
    description: isLong 
      ? 'Unusually long URL (>75 chars), often used to obscure malicious destination or embed tokens.'
      : 'Standard length URL.'
  });
  if (isLong) riskWeight += 0.35;

  // 4. Subdomain Count
  const hostParts = hostname.split('.');
  const subdomainCount = Math.max(0, hostParts.length - 2);
  const excessiveSubdomains = subdomainCount >= 3;
  features.push({
    name: 'Subdomain Count',
    category: 'domain',
    value: subdomainCount,
    impact: excessiveSubdomains ? 'phishing' : 'legitimate',
    weight: excessiveSubdomains ? 0.45 : -0.05,
    description: excessiveSubdomains 
      ? `Excessive subdomains (${subdomainCount}) frequently used to mimic legitimate services.`
      : 'Normal subdomain hierarchy.'
  });
  if (excessiveSubdomains) riskWeight += 0.45;

  // 5. Special Characters in URL (@, -, _, %)
  const atCount = (normalized.match(/@/g) || []).length;
  if (atCount > 0) {
    features.push({
      name: 'Deceptive "@" Symbol in URL',
      category: 'lexical',
      value: `${atCount} occurrence(s)`,
      impact: 'phishing',
      weight: 0.8,
      description: 'The "@" character in URL forces browsers to treat preceding text as user info, masking the real domain.'
    });
    riskWeight += 0.8;
  }

  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 2) {
    features.push({
      name: 'Domain Hyphen Density',
      category: 'domain',
      value: `${hyphenCount} hyphens`,
      impact: 'phishing',
      weight: 0.3,
      description: 'Multiple hyphens in domain name are a standard trait of typosquatting & brand spoofing.'
    });
    riskWeight += 0.3;
  }

  // 6. Shannon Entropy (Randomness/DGA detection)
  const domainEntropy = calculateShannonEntropy(hostname);
  const isHighEntropy = domainEntropy > 3.8;
  features.push({
    name: 'Hostname Shannon Entropy',
    category: 'domain',
    value: `${domainEntropy} bits`,
    impact: isHighEntropy ? 'phishing' : 'legitimate',
    weight: isHighEntropy ? 0.4 : -0.1,
    description: isHighEntropy 
      ? 'High entropy indicates algorithmically generated domains (DGA) or randomized character sequences.'
      : 'Natural lexical entropy expected in legitimate brand domains.'
  });
  if (isHighEntropy) riskWeight += 0.4;

  // 7. URL Shortening Services
  const isShortened = SHORTENERS.has(hostname);
  features.push({
    name: 'URL Shortener Redirection',
    category: 'domain',
    value: isShortened ? 'Shortening Service Detected' : 'Direct Link',
    impact: isShortened ? 'phishing' : 'neutral',
    weight: isShortened ? 0.5 : 0.0,
    description: isShortened 
      ? 'Obfuscated link via public shortener; hides true destination from email gateways.'
      : 'Direct fully qualified URL.'
  });
  if (isShortened) riskWeight += 0.5;

  // 8. Punycode / Internationalized Domain (IDN Homograph)
  const isPunycode = hostname.includes('xn--');
  features.push({
    name: 'Punycode / Homograph Obfuscation',
    category: 'domain',
    value: isPunycode ? 'Punycode (xn--) Present' : 'Standard ASCII',
    impact: isPunycode ? 'phishing' : 'legitimate',
    weight: isPunycode ? 0.7 : -0.05,
    description: isPunycode 
      ? 'IDN punycode detected. Often used for Cyrillic/Greek homoglyph attacks impersonating major brands.'
      : 'Standard Latin ASCII characters.'
  });
  if (isPunycode) riskWeight += 0.7;

  // 9. TLD Reputation
  const tld = hostParts[hostParts.length - 1];
  const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
  features.push({
    name: 'Top-Level Domain (TLD) Risk',
    category: 'domain',
    value: `.${tld}`,
    impact: isSuspiciousTld ? 'phishing' : 'legitimate',
    weight: isSuspiciousTld ? 0.5 : -0.15,
    description: isSuspiciousTld 
      ? `High-risk TLD (.${tld}) heavily abused in automated scam and phishing campaigns.`
      : `Reputable top-level domain (.${tld}).`
  });
  if (isSuspiciousTld) riskWeight += 0.5;

  // 10. Phishing Target Keywords in Domain or Path
  const lowerUrl = normalized.toLowerCase();
  const matchedKeywords = PHISHING_KEYWORDS.filter(kw => lowerUrl.includes(kw));
  if (matchedKeywords.length > 0) {
    const isHostMatch = matchedKeywords.some(kw => hostname.includes(kw));
    features.push({
      name: 'Sensitive Credential & Security Keywords',
      category: 'semantic',
      value: matchedKeywords.slice(0, 4).join(', '),
      impact: 'phishing',
      weight: isHostMatch ? 0.6 : 0.35,
      description: `Contains high-risk bait words: [${matchedKeywords.slice(0, 3).join(', ')}] targeted at credentials or urgency.`
    });
    riskWeight += isHostMatch ? 0.6 : 0.35;
  }

  // 11. Unusual Port
  if (port && port !== '80' && port !== '443') {
    features.push({
      name: 'Non-Standard Web Port',
      category: 'structural',
      value: `Port ${port}`,
      impact: 'phishing',
      weight: 0.55,
      description: `Targeting unusual non-standard port ${port}. Typical of ephemeral phishing infrastructure.`
    });
    riskWeight += 0.55;
  }

  // 12. Path Depth & Query Parameter Count
  const queryParams = Array.from(parsed.searchParams.keys());
  if (queryParams.length >= 4) {
    features.push({
      name: 'Complex Query Parameters',
      category: 'structural',
      value: `${queryParams.length} parameters`,
      impact: 'phishing',
      weight: 0.25,
      description: 'Heavy parameter chaining frequently used to bypass static URL filters or carry encoded victim IDs.'
    });
    riskWeight += 0.25;
  }

  return {
    url: normalized,
    scheme,
    hostname,
    port,
    path,
    query,
    features,
    shannonEntropy: domainEntropy,
    isShortened,
    isIpHost: isIp,
    isPunycode,
    riskWeightScore: riskWeight
  };
}
