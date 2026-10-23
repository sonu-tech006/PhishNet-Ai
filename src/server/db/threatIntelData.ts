import { ThreatIndicatorItem } from '../../types/index.js';

let threatIndicators: ThreatIndicatorItem[] = [
  {
    id: 'ti-1',
    type: 'domain',
    value: 'paypal-security-update.xyz',
    severity: 'critical',
    source: 'OpenPhish Feed',
    description: 'Active credential phishing campaign targeting PayPal users via spoofed security notices.',
    createdAt: '2026-10-18T10:15:00Z',
    matchedCount: 24,
    active: true
  },
  {
    id: 'ti-2',
    type: 'domain',
    value: 'appleid-support-icloud.top',
    severity: 'critical',
    source: 'PhishTank Feed #89421',
    description: 'iCloud 2FA interception portal harvesting Apple credentials and verification codes.',
    createdAt: '2026-10-19T14:22:00Z',
    matchedCount: 38,
    active: true
  },
  {
    id: 'ti-3',
    type: 'ip',
    value: '185.220.101.5',
    severity: 'high',
    source: 'CISA Alert AA24-301',
    description: 'Bulletproof hosting infrastructure associated with automated smishing payload delivery.',
    createdAt: '2026-10-12T08:00:00Z',
    matchedCount: 15,
    active: true
  },
  {
    id: 'ti-4',
    type: 'domain',
    value: 'usps-tracking-redelivery.info',
    severity: 'high',
    source: 'US-CERT Suspicious Domains',
    description: 'Package redelivery smishing scam harvesting credit cards for nominal 30 cent redelivery fees.',
    createdAt: '2026-10-20T16:45:00Z',
    matchedCount: 52,
    active: true
  },
  {
    id: 'ti-5',
    type: 'sender_email',
    value: 'alert@security-chasebank-online.com',
    severity: 'critical',
    source: 'Anti-Phishing Working Group (APWG)',
    description: 'Fraudulent bank alert notification purporting to originate from Chase Fraud Prevention.',
    createdAt: '2026-10-15T11:30:00Z',
    matchedCount: 19,
    active: true
  },
  {
    id: 'ti-6',
    type: 'domain',
    value: 'netflix-billing-reactivate.club',
    severity: 'high',
    source: 'PhishTank Community Feed',
    description: 'Payment renewal page capturing credit card details with fake Netflix branded styling.',
    createdAt: '2026-10-21T09:10:00Z',
    matchedCount: 11,
    active: true
  },
  {
    id: 'ti-7',
    type: 'domain',
    value: 'microsoft-onedrive-document-verify.com',
    severity: 'critical',
    source: 'Microsoft Security Intelligence',
    description: 'Consent phishing and OAuth token theft campaign masquerading as a shared OneDrive PDF.',
    createdAt: '2026-10-16T12:00:00Z',
    matchedCount: 43,
    active: true
  }
];

export function getThreatIndicators(): ThreatIndicatorItem[] {
  return [...threatIndicators];
}

export function addThreatIndicator(item: Omit<ThreatIndicatorItem, 'id' | 'createdAt' | 'matchedCount'>): ThreatIndicatorItem {
  const newIndicator: ThreatIndicatorItem = {
    ...item,
    id: 'ti-' + (threatIndicators.length + 1) + '-' + Date.now().toString(36),
    createdAt: new Date().toISOString(),
    matchedCount: 0
  };
  threatIndicators.unshift(newIndicator);
  return newIndicator;
}

export function checkThreatIntelligence(hostnameOrDomain: string, rawUrl?: string): {
  matched: boolean;
  indicator?: string;
  source?: string;
  severity?: string;
} {
  const cleanHost = hostnameOrDomain.toLowerCase().trim();
  for (const item of threatIndicators) {
    if (!item.active) continue;
    const itemVal = item.value.toLowerCase().trim();
    if (item.type === 'domain' && (cleanHost === itemVal || cleanHost.endsWith('.' + itemVal))) {
      item.matchedCount++;
      return {
        matched: true,
        indicator: item.value,
        source: item.source,
        severity: item.severity
      };
    }
    if (item.type === 'ip' && cleanHost === itemVal) {
      item.matchedCount++;
      return {
        matched: true,
        indicator: item.value,
        source: item.source,
        severity: item.severity
      };
    }
    if (rawUrl && item.type === 'url' && rawUrl.toLowerCase().includes(itemVal)) {
      item.matchedCount++;
      return {
        matched: true,
        indicator: item.value,
        source: item.source,
        severity: item.severity
      };
    }
  }
  return { matched: false };
}
