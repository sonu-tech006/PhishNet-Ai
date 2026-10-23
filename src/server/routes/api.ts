import { Router, Request, Response } from 'express';
import { runInference } from '../ml/inferenceEngine.js';
import { 
  saveAnalysis, 
  getAnalyses, 
  getAnalysisById, 
  deleteAnalysis,
  getOverviewMetrics,
  getModelMetrics,
  getPipelineRuns,
  triggerNewPipelineRun,
  getDatasets,
  addDataset,
  saveFeedback,
  getSystemHealth,
  createUser,
  authenticateUser,
  getUserByToken
} from '../db/database.js';
import { getThreatIndicators, addThreatIndicator } from '../db/threatIntelData.js';

export const apiRouter = Router();

// Helper to extract authenticated user from Bearer header
async function extractUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7).trim();
  return getUserByToken(token);
}

// Health endpoint
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json(getSystemHealth());
});

// Authentication endpoints
apiRouter.post('/api/v1/auth/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const result = await createUser(name, email, password, role);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Signup failed' });
  }
});

apiRouter.post('/api/v1/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = await authenticateUser(email, password);
    return res.json(result);
  } catch (err: any) {
    return res.status(401).json({ error: err.message || 'Login failed' });
  }
});

apiRouter.get('/api/v1/auth/me', async (req: Request, res: Response) => {
  try {
    const user = await extractUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    return res.json({ user });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve profile: ' + err.message });
  }
});

// Single URL analysis
apiRouter.post('/api/v1/analyze/url', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({ error: 'URL field is required and must not be empty.' });
    }
    const user = await extractUser(req);
    const result = runInference({ inputType: 'url', content: url.trim() });
    if (user) {
      result.userId = user.id;
      result.userEmail = user.email;
    }
    await saveAnalysis(result);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to analyze URL: ' + err.message });
  }
});

// Single Email analysis
apiRouter.post('/api/v1/analyze/email', async (req: Request, res: Response) => {
  try {
    const { subject, body, senderEmail, senderName } = req.body;
    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return res.status(400).json({ error: 'Email body is required and must not be empty.' });
    }
    const user = await extractUser(req);
    const result = runInference({
      inputType: 'email',
      content: body.trim(),
      subject: subject?.trim(),
      senderEmail: senderEmail?.trim(),
      senderName: senderName?.trim()
    });
    if (user) {
      result.userId = user.id;
      result.userEmail = user.email;
    }
    await saveAnalysis(result);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to analyze email: ' + err.message });
  }
});

// Single Message / SMS analysis
apiRouter.post('/api/v1/analyze/message', async (req: Request, res: Response) => {
  try {
    const { message, senderPhone } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required.' });
    }
    const user = await extractUser(req);
    const result = runInference({
      inputType: 'message',
      content: message.trim(),
      senderName: senderPhone?.trim()
    });
    if (user) {
      result.userId = user.id;
      result.userEmail = user.email;
    }
    await saveAnalysis(result);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to analyze message: ' + err.message });
  }
});

// Batch CSV / multi-item analysis
apiRouter.post('/api/v1/analyze/batch', async (req: Request, res: Response) => {
  try {
    const { items, type } = req.body; // array of strings or objects { content, type }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items array is required and must not be empty.' });
    }
    if (items.length > 500) {
      return res.status(400).json({ error: 'Batch limit exceeded. Max 500 rows per request.' });
    }

    const batchResults = [];
    const inputType = type === 'email' ? 'email' : (type === 'message' ? 'message' : 'url');

    for (const item of items) {
      const text = typeof item === 'string' ? item : item.content || item.url || item.text;
      if (!text || String(text).trim().length === 0) continue;
      const resItem = runInference({
        inputType,
        content: String(text).trim()
      });
      await saveAnalysis(resItem);
      batchResults.push(resItem);
    }

    const high = batchResults.filter(r => r.riskLevel === 'High Risk').length;
    const med = batchResults.filter(r => r.riskLevel === 'Medium Risk').length;
    const low = batchResults.filter(r => r.riskLevel === 'Low Risk').length;

    return res.json({
      total: batchResults.length,
      summary: { high, medium: med, low },
      results: batchResults
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process batch: ' + err.message });
  }
});

// List Analyses with filtering, searching & pagination
apiRouter.get('/api/v1/analyses', async (req: Request, res: Response) => {
  try {
    const { inputType, riskLevel, search, limit, offset } = req.query;
    const result = await getAnalyses({
      inputType: inputType as string,
      riskLevel: riskLevel as string,
      search: search as string,
      limit: limit ? parseInt(limit as string, 10) : 50,
      offset: offset ? parseInt(offset as string, 10) : 0
    });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve analyses: ' + err.message });
  }
});

// Single analysis details
apiRouter.get('/api/v1/analyses/:id', async (req: Request, res: Response) => {
  try {
    const analysis = await getAnalysisById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    return res.json(analysis);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch analysis: ' + err.message });
  }
});

// Delete analysis
apiRouter.delete('/api/v1/analyses/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await deleteAnalysis(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    return res.json({ success: true, message: 'Analysis deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete analysis: ' + err.message });
  }
});

// Analytics Overview
apiRouter.get('/api/v1/analytics/overview', async (_req: Request, res: Response) => {
  try {
    const overview = await getOverviewMetrics();
    return res.json(overview);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch analytics: ' + err.message });
  }
});

// Model Metrics & Evaluation
apiRouter.get('/api/v1/analytics/models', (_req: Request, res: Response) => {
  return res.json({
    championModel: 'v2.4.1-xgb-champion',
    evaluationMethod: 'Stratified 80/10/10 Train/Validation/Test Split',
    testDatasetSize: 12000,
    models: getModelMetrics()
  });
});

// Threat Intelligence
apiRouter.get('/api/v1/threat-intel', (_req: Request, res: Response) => {
  return res.json({ indicators: getThreatIndicators() });
});

apiRouter.post('/api/v1/threat-intel/add', (req: Request, res: Response) => {
  try {
    const { type, value, severity, source, description } = req.body;
    if (!type || !value) {
      return res.status(400).json({ error: 'Type and Value are required fields.' });
    }
    const indicator = addThreatIndicator({
      type,
      value: value.trim(),
      severity: severity || 'high',
      source: source || 'Analyst Manual Entry',
      description: description || 'User-submitted threat indicator',
      active: true
    });
    return res.json(indicator);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add indicator: ' + err.message });
  }
});

// Pipelines
apiRouter.get('/api/v1/pipelines', (_req: Request, res: Response) => {
  return res.json({ pipelines: getPipelineRuns() });
});

apiRouter.post('/api/v1/pipelines/run', (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const run = triggerNewPipelineRun(name);
    return res.json(run);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to run pipeline: ' + err.message });
  }
});

// Datasets
apiRouter.get('/api/v1/datasets', (_req: Request, res: Response) => {
  return res.json({ datasets: getDatasets() });
});

apiRouter.post('/api/v1/datasets/upload', (req: Request, res: Response) => {
  try {
    const { name, type, recordsCount, phishingCount, legitimateCount, license } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'Dataset Name and Type are required.' });
    }
    const ds = addDataset({
      name,
      type,
      totalRecords: recordsCount || 5000,
      phishingCount: phishingCount || 2500,
      legitimateCount: legitimateCount || 2500,
      imbalanceRatio: '1 : 1.0 (Balanced)',
      version: 'v1.0-custom',
      license: license || 'Private Organization',
      featuresCount: type === 'url' ? 24 : 32,
      sampleRows: []
    });
    return res.json(ds);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to upload dataset: ' + err.message });
  }
});

// User Feedback for scans
apiRouter.post('/api/v1/feedback', (req: Request, res: Response) => {
  try {
    const { analysisId, suggestedLabel, userNotes } = req.body;
    if (!analysisId || !suggestedLabel) {
      return res.status(400).json({ error: 'analysisId and suggestedLabel are required.' });
    }
    const feedback = saveFeedback({
      analysisId,
      suggestedLabel,
      userNotes: userNotes || ''
    });
    return res.json({ success: true, feedback });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to record feedback: ' + err.message });
  }
});
