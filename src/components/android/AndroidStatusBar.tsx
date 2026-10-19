import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Bell, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AndroidStatusBar: React.FC = () => {
  const { user, notifications, setIsNotificationShadeOpen } = useApp();
  const [time, setTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md px-5 pt-2 pb-1.5 flex items-center justify-between text-slate-300 text-xs font-medium select-none z-30 border-b border-white/5">
      {/* Left: Clock & Notifications */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[13px] tracking-tight text-white">{time}</span>
        
        {/* Streak indicator icon in status bar */}
        <div className="flex items-center gap-0.5 text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-full text-[10px]">
          <Flame size={11} className="fill-amber-400" />
          <span>{user.streakCount}d</span>
        </div>

        {/* Unread notification icon with button to pull shade */}
        <button
          onClick={() => setIsNotificationShadeOpen(true)}
          className="relative text-indigo-400 hover:text-indigo-300 transition-colors p-0.5"
          title="Open Android Notification Drawer"
        >
          <Bell size={13} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          )}
        </button>
      </div>

      {/* Center Camera Punch-Hole cut-out aesthetic */}
      <div className="w-3.5 h-3.5 bg-black rounded-full ring-1 ring-slate-800 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
      </div>

      {/* Right: Signals & Battery */}
      <div className="flex items-center gap-2 text-slate-300">
        <span className="text-[10px] font-bold text-emerald-400 tracking-wider">5G</span>
        <Wifi size={13} className="text-slate-300" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-mono">94%</span>
          <BatteryMedium size={15} className="text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
