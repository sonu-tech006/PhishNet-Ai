export type InputType = 'url' | 'email' | 'message' | 'text';
export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';
export type ThemeMode = 'cyber-blue' | 'emerald-guard' | 'electric-violet' | 'midnight-dark';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SOC Analyst' | 'Security Engineer' | 'Threat Researcher' | 'Admin';
  createdAt: string;
  scanCount: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ExtractedFeature {
  name: string;
  category: 'lexical' | 'domain' | 'semantic' | 'urgency' | 'financial' | 'structural';
  value: string | number | boolean;
  impact: 'phishing' | 'neutral' | 'legitimate';
  weight: number; // -1.0 to 1.0 (contribution score)
  description: string;
}

export interface ShapExplanation {
  featureName: string;
  contribution: number; // positive increases phishing risk, negative decreases
  featureValue: string | number;
  direction: 'increases_risk' | 'decreases_risk';
}

export interface AnalysisResult {
  id: string;
  inputType: InputType;
  inputContent: string;
  inputHash: string;
  displayTitle: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence: number; // 0 - 1.0
  calibratedProbability: number; // 0 - 1.0
  modelVersion: string;
  executionTimeMs: number;
  createdAt: string;
  topIndicators: string[];
  features: ExtractedFeature[];
  shapExplanations: ShapExplanation[];
  explanationSummary: string;
  recommendedActions: string[];
  userId?: string;
  userEmail?: string;
  threatIntelMatch?: {
    matched: boolean;
    indicator?: string;
    source?: string;
    severity?: string;
  };
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'error';
  database: 'mongodb' | 'embedded';
  dbConnected: boolean;
  totalAnalyses: number;
  modelsLoaded: string[];
  uptimeSeconds: number;
  version: string;
}

export interface OverviewMetrics {
  totalScans: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  avgLatencyMs: number;
  accuracy: number;
  f1Score: number;
  riskDistribution: { name: string; count: number; color: string }[];
  scansOverTime: { date: string; low: number; medium: number; high: number }[];
  topIndicators: { indicator: string; count: number; category: string }[];
  recentScans: AnalysisResult[];
}

export interface ModelMetricComparison {
  modelName: string;
  modelType: string;
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  prAuc: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  avgLatencyMs: number;
  trainingSamples: number;
  testSamples: number;
  trainedAt: string;
  isChampion: boolean;
}

export interface ConfusionMatrixData {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
}

export interface ThreatIndicatorItem {
  id: string;
  type: 'domain' | 'ip' | 'url' | 'sender_email' | 'keyword';
  value: string;
  severity: 'high' | 'critical' | 'medium';
  source: string;
  description: string;
  createdAt: string;
  matchedCount: number;
  active: boolean;
}

export interface PipelineRun {
  id: string;
  name: string;
  stage: 'Ingestion' | 'Validation' | 'Normalization' | 'Deduplication' | 'FeaturePrep' | 'Completed' | 'Failed';
  status: 'running' | 'success' | 'failed';
  totalRecords: number;
  validRecords: number;
  duplicateRecords: number;
  invalidRecords: number;
  dataQualityScore: number; // 0 - 100
  startedAt: string;
  completedAt: string;
  executionSeconds: number;
  logs: string[];
}

export interface DatasetItem {
  id: string;
  name: string;
  type: 'url' | 'email' | 'sms';
  totalRecords: number;
  phishingCount: number;
  legitimateCount: number;
  imbalanceRatio: string;
  version: string;
  lastUpdated: string;
  license: string;
  featuresCount: number;
  sampleRows: any[];
}

export interface ScanFeedback {
  id: string;
  analysisId: string;
  suggestedLabel: 'phishing' | 'legitimate';
  userNotes: string;
  submittedAt: string;
  reviewed: boolean;
}
