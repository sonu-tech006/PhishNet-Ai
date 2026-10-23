import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

type ToastListener = (toast: ToastMessage) => void;
const listeners: ToastListener[] = [];

export function toast(message: string, type: ToastType = 'info') {
  const item: ToastMessage = {
    id: 'toast-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    message,
    type
  };
  listeners.forEach(l => l(item));
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler: ToastListener = (t) => {
      setToasts(prev => [t, ...prev].slice(0, 4));
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const handleDismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => handleDismiss(t.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3800);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400'
        };
      case 'error':
        return {
          bg: 'bg-red-950/90 border-red-500/40 text-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/90 border-amber-500/40 text-amber-200',
          icon: AlertTriangle,
          iconColor: 'text-amber-400'
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#0F172A]/95 border-blue-500/40 text-slate-200',
          icon: Info,
          iconColor: 'text-[#4169E1]'
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className={`pointer-events-auto p-3.5 rounded-lg border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all duration-200 ease-out animate-in slide-in-from-bottom-2 ${style.bg}`}>
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${style.iconColor}`} />
      <div className="flex-1 text-xs font-medium leading-relaxed">
        {toast.message}
      </div>
      <button
        onClick={onDismiss}
        className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-white rounded-md cursor-pointer transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
