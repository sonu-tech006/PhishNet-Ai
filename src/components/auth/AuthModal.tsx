import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Mail, 
  Lock, 
  User as UserIcon, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { loginUser, signupUser } from '../../services/api.js';
import { User } from '../../types/index.js';
import { toast } from '../common/Toast.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'SOC Analyst' | 'Security Engineer' | 'Threat Researcher' | 'Admin'>('SOC Analyst');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginUser(email.trim(), password);
        toast(`Welcome back, ${res.user.name}!`, 'success');
        onAuthSuccess(res.user);
        onClose();
      } else {
        if (!name.trim()) {
          setError('Full name is required.');
          setLoading(false);
          return;
        }
        const res = await signupUser(name.trim(), email.trim(), password, role);
        toast(`Account created successfully! Signed in as ${res.user.name}`, 'success');
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser('sonukr7435@gmail.com', 'Password@123');
      toast(`Signed in as ${res.user.name} (${res.user.role})`, 'success');
      onAuthSuccess(res.user);
      onClose();
    } catch {
      // If user doesn't exist yet, sign up as Sonu Kumar
      try {
        const res = await signupUser('Sonu Kumar', 'sonukr7435@gmail.com', 'Password@123', 'SOC Analyst');
        toast(`Signed in as ${res.user.name} (${res.user.role})`, 'success');
        onAuthSuccess(res.user);
        onClose();
      } catch (e: any) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4169E1] flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172033]">
                {mode === 'login' ? 'SOC Analyst Sign In' : 'Create PhishNet Account'}
              </h3>
              <p className="text-[11px] text-[#64748B]">Persistent MongoDB Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Quick Demo Login Banner */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-blue-50/70 hover:bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-[#4169E1] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4169E1]" />
              <span>1-Click Sign In: Sonu Kumar (SOC Analyst)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E2E8F0] w-full" />
            <span className="bg-white px-3 text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
              Or with credentials
            </span>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="font-semibold text-[#172033] block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sonu Kumar"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-semibold text-[#172033] block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  placeholder="analyst@enterprise.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#172033] block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="font-semibold text-[#172033] block mb-1">Role / Designation</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#172033] focus:outline-hidden focus:ring-1 focus:ring-[#4169E1]"
                >
                  <option value="SOC Analyst">SOC Analyst (Level 1/2)</option>
                  <option value="Security Engineer">Security Engineer</option>
                  <option value="Threat Researcher">Threat Researcher</option>
                  <option value="Admin">SOC Administrator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#4169E1] hover:bg-[#3657C3] disabled:opacity-50 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer text-xs mt-2"
            >
              {loading ? 'Authenticating with MongoDB...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-[#64748B]">
            {mode === 'login' ? (
              <span>
                Don't have an analyst account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="text-[#4169E1] font-semibold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-[#4169E1] font-semibold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
