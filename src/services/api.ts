import { 
  AnalysisResult, 
  OverviewMetrics, 
  ModelMetricComparison, 
  ThreatIndicatorItem, 
  PipelineRun, 
  DatasetItem, 
  SystemHealth,
  User,
  AuthResponse 
} from '../types/index.js';

const TOKEN_KEY = 'phishnet_auth_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function removeAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

function getHeaders(contentType: boolean = true): HeadersInit {
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Login failed');
  }
  const data: AuthResponse = await res.json();
  setAuthToken(data.token);
  return data;
}

export async function signupUser(name: string, email: string, password: string, role?: string): Promise<AuthResponse> {
  const res = await fetch('/api/v1/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Signup failed');
  }
  const data: AuthResponse = await res.json();
  setAuthToken(data.token);
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/v1/auth/me', {
      headers: getHeaders(false)
    });
    if (!res.ok) {
      removeAuthToken();
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function checkSystemHealth(): Promise<SystemHealth> {
  const res = await fetch('/health');
  if (!res.ok) throw new Error('Health check failed: ' + res.statusText);
  return res.json();
}

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  const res = await fetch('/api/v1/analyze/url', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ url })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze URL');
  }
  return res.json();
}

export async function analyzeEmail(payload: {
  subject?: string;
  body: string;
  senderEmail?: string;
  senderName?: string;
}): Promise<AnalysisResult> {
  const res = await fetch('/api/v1/analyze/email', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze email');
  }
  return res.json();
}

export async function analyzeMessage(message: string, phone?: string): Promise<AnalysisResult> {
  const res = await fetch('/api/v1/analyze/message', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message, senderPhone: phone })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze message');
  }
  return res.json();
}

export async function analyzeBatch(items: string[], type: 'url' | 'email' | 'message'): Promise<{
  total: number;
  summary: { high: number; medium: number; low: number };
  results: AnalysisResult[];
}> {
  const res = await fetch('/api/v1/analyze/batch', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ items, type })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to process batch');
  }
  return res.json();
}

export async function getAnalyses(params?: {
  inputType?: string;
  riskLevel?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: AnalysisResult[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.inputType) query.set('inputType', params.inputType);
  if (params?.riskLevel) query.set('riskLevel', params.riskLevel);
  if (params?.search) query.set('search', params.search);
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));

  const res = await fetch(`/api/v1/analyses?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch analyses');
  return res.json();
}

export async function getAnalysisById(id: string): Promise<AnalysisResult> {
  const res = await fetch(`/api/v1/analyses/${id}`);
  if (!res.ok) throw new Error('Failed to fetch analysis details');
  return res.json();
}

export async function deleteAnalysis(id: string): Promise<void> {
  const res = await fetch(`/api/v1/analyses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete analysis');
}

export async function getOverviewMetrics(): Promise<OverviewMetrics> {
  const res = await fetch('/api/v1/analytics/overview');
  if (!res.ok) throw new Error('Failed to fetch overview metrics');
  return res.json();
}

export async function getModelMetrics(): Promise<{
  championModel: string;
  evaluationMethod: string;
  testDatasetSize: number;
  models: ModelMetricComparison[];
}> {
  const res = await fetch('/api/v1/analytics/models');
  if (!res.ok) throw new Error('Failed to fetch model metrics');
  return res.json();
}

export async function getThreatIntel(): Promise<{ indicators: ThreatIndicatorItem[] }> {
  const res = await fetch('/api/v1/threat-intel');
  if (!res.ok) throw new Error('Failed to fetch threat intel');
  return res.json();
}

export async function addThreatIndicator(payload: {
  type: string;
  value: string;
  severity: string;
  source: string;
  description: string;
}): Promise<ThreatIndicatorItem> {
  const res = await fetch('/api/v1/threat-intel/add', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to add threat indicator');
  return res.json();
}

export async function getPipelines(): Promise<{ pipelines: PipelineRun[] }> {
  const res = await fetch('/api/v1/pipelines', { headers: getHeaders(false) });
  if (!res.ok) throw new Error('Failed to fetch pipelines');
  return res.json();
}

export async function runPipeline(name: string): Promise<PipelineRun> {
  const res = await fetch('/api/v1/pipelines/run', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Failed to run pipeline');
  return res.json();
}

export async function getDatasets(): Promise<{ datasets: DatasetItem[] }> {
  const res = await fetch('/api/v1/datasets', { headers: getHeaders(false) });
  if (!res.ok) throw new Error('Failed to fetch datasets');
  return res.json();
}

export async function uploadDataset(payload: {
  name: string;
  type: string;
  recordsCount: number;
  phishingCount: number;
  legitimateCount: number;
  license?: string;
}): Promise<DatasetItem> {
  const res = await fetch('/api/v1/datasets/upload', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to upload dataset');
  return res.json();
}

export async function submitScanFeedback(analysisId: string, suggestedLabel: 'phishing' | 'legitimate', notes: string) {
  const res = await fetch('/api/v1/feedback', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ analysisId, suggestedLabel, userNotes: notes })
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}
