import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Sparkles } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage, clearToast } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="absolute bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-slate-900/95 text-slate-100 border border-indigo-500/30 shadow-2xl backdrop-blur-xl px-4 py-2.5 rounded-full flex items-center gap-2.5 text-xs font-medium max-w-sm pointer-events-auto">
        <Sparkles size={14} className="text-amber-400 shrink-0" />
        <span className="flex-1 truncate">{toastMessage}</span>
        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-white text-[11px] font-bold px-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
