import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Layers, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const ModelMonitoringPage: React.FC = () => {
  // Latency monitoring samples (hourly over last 24h)
  const latencyData = [
    { hour: '00:00', latency: 12.1, p99: 21.4, volume: 140 },
    { hour: '04:00', latency: 11.8, p99: 19.8, volume: 85 },
    { hour: '08:00', latency: 13.5, p99: 24.1, volume: 320 },
    { hour: '12:00', latency: 14.8, p99: 28.5, volume: 640 },
    { hour: '16:00', latency: 13.9, p99: 26.0, volume: 510 },
    { hour: '20:00', latency: 12.6, p99: 22.3, volume: 290 }
  ];

  const driftIndicators = [
    { feature: 'Shannon Entropy Mean', baseline: '3.12 bits', current: '3.18 bits', shift: '+1.9%', status: 'Normal' },
    { feature: 'New TLD Frequency (.top, .icu)', baseline: '4.2%', current: '5.8%', shift: '+38.1%', status: 'Monitored' },
    { feature: 'Brand Impersonation Density', baseline: '8.4%', current: '8.6%', shift: '+2.3%', status: 'Normal' },
    { feature: 'Shortener Redirection Ratio', baseline: '2.1%', current: '2.3%', shift: '+9.5%', status: 'Normal' }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">
          Model Drift & Inference Operations Monitoring
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Real-time telemetry tracking distribution drift, inference latency percentiles (p50/p99), and analyst false-positive feedback ratios.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs">
          <span className="text-xs text-[#64748B] block">P50 Median Latency</span>
          <span className="text-2xl font-bold font-mono text-[#172033] mt-1 block">13.2 ms</span>
          <span className="text-[10px] text-emerald-600 font-medium">SLA Target &lt; 50ms</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs">
          <span className="text-xs text-[#64748B] block">P99 Tail Latency</span>
          <span className="text-2xl font-bold font-mono text-[#4169E1] mt-1 block">28.5 ms</span>
          <span className="text-[10px] text-emerald-600 font-medium">No timeouts recorded</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs">
          <span className="text-xs text-[#64748B] block">Feedback False-Positive Rate</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">1.8%</span>
          <span className="text-[10px] text-[#64748B]">Audited by SOC Analysts</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs">
          <span className="text-xs text-[#64748B] block">Data Drift Status</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block flex items-center gap-1.5 text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Stable
          </span>
          <span className="text-[10px] text-[#64748B]">Wasserstein distance &lt; 0.05</span>
        </div>
      </div>

      {/* Latency and Volume Chart */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#172033]">
              Inference Latency Profile (p50 vs p99)
            </h3>
            <p className="text-xs text-[#64748B]">Average execution time per request in milliseconds</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#4169E1] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4169E1]" /> p50 Latency (ms)
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> p99 Latency (ms)
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" domain={[0, 35]} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '6px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="latency" name="p50 Latency" stroke="#4169E1" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="p99" name="p99 Latency" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Distribution Drift Audit */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#172033]">
              Feature Drift & Covariate Shift Diagnostics
            </h3>
            <p className="text-xs text-[#64748B]">Comparing current live production inference vector against training baseline</p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
            Retraining Threshold: 15% Shift
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Tracked Feature</th>
                <th className="px-4 py-2.5 font-semibold">Training Baseline</th>
                <th className="px-4 py-2.5 font-semibold">Live Production Vector</th>
                <th className="px-4 py-2.5 font-semibold">Measured Shift</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {driftIndicators.map((d, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-2.5 font-medium text-[#172033]">{d.feature}</td>
                  <td className="px-4 py-2.5 font-mono text-[#475569]">{d.baseline}</td>
                  <td className="px-4 py-2.5 font-mono text-[#172033] font-semibold">{d.current}</td>
                  <td className="px-4 py-2.5 font-mono text-[#4169E1] font-semibold">{d.shift}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-sm ${
                      d.status === 'Normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
