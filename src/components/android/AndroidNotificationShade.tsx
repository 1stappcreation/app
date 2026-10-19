import React from 'react';
import { Bell, Flame, Sparkles, X, ChevronDown, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AndroidNotificationShade: React.FC = () => {
  const { notifications, isNotificationShadeOpen, setIsNotificationShadeOpen, openPromptDetail, prompts, showToast } =
    useApp();

  if (!isNotificationShadeOpen) return null;

  const handleNotificationClick = (promptId?: string) => {
    if (promptId) {
      const targetPrompt = prompts.find((p) => p.id === promptId);
      if (targetPrompt) {
        openPromptDetail(targetPrompt);
        setIsNotificationShadeOpen(false);
        return;
      }
    }
    showToast('Notification viewed');
    setIsNotificationShadeOpen(false);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl z-40 flex flex-col animate-in fade-in slide-in-from-top-6 duration-200">
      {/* Top Header of Android Quick Settings */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-indigo-400" />
          <span className="font-semibold text-sm">Android Push Notifications (FCM)</span>
        </div>
        <button
          onClick={() => setIsNotificationShadeOpen(false)}
          className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>PromptVerse • Today</span>
          <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            FCM Channel: daily_drops
          </span>
        </div>

        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleNotificationClick(notif.promptId)}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/80 transition-all cursor-pointer shadow-lg group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                {notif.category === 'streak_alert' ? (
                  <Flame size={16} className="text-amber-400" />
                ) : (
                  <Sparkles size={16} className="text-indigo-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {notif.body}
                </p>

                {notif.promptId && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>Tap to view prompt drop & claim XP</span>
                    <span>→</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-2 text-center">
          <button
            onClick={() => {
              showToast('Notifications marked as read');
              setIsNotificationShadeOpen(false);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Clear all notifications
          </button>
        </div>
      </div>

      {/* Close Drawer Button */}
      <div className="p-3 border-t border-slate-800/80 flex justify-center">
        <button
          onClick={() => setIsNotificationShadeOpen(false)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
        >
          <ChevronDown size={14} />
          <span>Swipe up to dismiss</span>
        </button>
      </div>
    </div>
  );
};
