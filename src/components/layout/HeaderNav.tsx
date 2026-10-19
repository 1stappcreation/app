import React from 'react';
import {
  Smartphone,
  Code2,
  Columns,
  Flame,
  Sparkles,
  Bell,
  Cpu,
  QrCode,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeaderNav: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    user,
    claimDailyDrop,
    setIsNotificationShadeOpen,
    notifications,
    setCurrentScreen,
    currentScreen,
    setIsTestOnPhoneModalOpen,
  } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30 select-none">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1">
              <span>PromptPulse</span>
              <span className="text-[10px] bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 font-mono px-1.5 py-0.5 rounded">
                v3.0 • AI & News
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400">
            Daily Prompts • AI Studio • Verified Tech News • Location Pulse
          </p>
        </div>
      </div>

      {/* Mode Switcher: Mobile / Split / Studio */}
      <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => setViewMode('split')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
            viewMode === 'split'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
          title="Side-by-side Live Android Simulator + Kotlin IDE"
        >
          <Columns size={14} />
          <span className="hidden sm:inline">Split View</span>
        </button>

        <button
          onClick={() => setViewMode('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
            viewMode === 'mobile'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
          title="Android Phone Simulator Only"
        >
          <Smartphone size={14} />
          <span>Device</span>
        </button>

        <button
          onClick={() => setViewMode('studio')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
            viewMode === 'studio'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
          title="Android Studio Code & Architecture Only"
        >
          <Code2 size={14} />
          <span>Kotlin Studio</span>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {/* Streak Flame Pill */}
        <button
          onClick={claimDailyDrop}
          className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition-all"
          title="Daily Prompt Streak"
        >
          <Flame size={15} className="fill-current text-amber-400" />
          <span>{user.streakCount}d Streak</span>
        </button>

        {/* Test on Phone (QR Code & PWA) */}
        <button
          onClick={() => setIsTestOnPhoneModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40"
          title="Scan QR Code to Test on your Android Phone"
        >
          <QrCode size={14} className="text-emerald-100" />
          <span className="hidden sm:inline">Test on Phone</span>
          <span className="sm:hidden">Test</span>
        </button>

        {/* AI Studio Launcher */}
        <button
          onClick={() => setCurrentScreen('aistudio')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
            currentScreen === 'aistudio'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white ring-1 ring-violet-400'
              : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
          }`}
        >
          <Cpu size={14} />
          <span>AI Studio</span>
        </button>

        {/* Notification Bell (Simulate FCM) */}
        <button
          onClick={() => setIsNotificationShadeOpen(true)}
          className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
          title="Test Android Push Notification Shade"
        >
          <Bell size={15} />
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          )}
        </button>
      </div>
    </header>
  );
};
