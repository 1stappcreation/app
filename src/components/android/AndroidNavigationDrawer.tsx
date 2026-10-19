import React from 'react';
import {
  X,
  Home,
  Compass,
  Cpu,
  Newspaper,
  Bookmark,
  MapPin,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Flame,
  Smartphone,
  QrCode,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AndroidNavigationDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    currentScreen,
    setCurrentScreen,
    user,
    currentLocation,
    claimDailyDrop,
    setIsTestOnPhoneModalOpen,
  } = useApp();

  if (!isDrawerOpen) return null;

  const navLinks = [
    { id: 'home' as const, label: 'Home Feed', icon: Home, desc: 'Daily Drop & Tech Radar' },
    { id: 'discover' as const, label: 'Discover & Stories', icon: Compass, desc: 'Snapchat-style visual cards' },
    { id: 'aistudio' as const, label: 'AI Studio', icon: Cpu, badge: '5 Tools', desc: 'Chat, Images, Veo Video & Search' },
    { id: 'news' as const, label: 'Verified News', icon: Newspaper, desc: 'Reuters, MIT Tech, Bloomberg' },
    { id: 'library' as const, label: 'Saved & Library', icon: Bookmark, desc: 'Bookmarked Prompts & News' },
    { id: 'admin' as const, label: 'Admin CMS', icon: ShieldAlert, desc: 'Upload & Schedule Drops' },
  ];

  const handleNav = (screenId: any) => {
    setCurrentScreen(screenId);
    setIsDrawerOpen(false);
  };

  return (
    <div className="absolute inset-0 z-40 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Drawer Container (Material 3 Navigation Drawer) */}
      <div className="absolute top-0 bottom-0 left-0 w-[82%] max-w-[320px] bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-left duration-250">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles size={16} className="text-cyan-300" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">PromptPulse</h3>
                <p className="text-[10px] text-slate-400">Android M3 Edition</p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <X size={18} />
            </button>
          </div>

          {/* User Profile Mini Card in Drawer */}
          <div className="my-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-cyan-400">
                <MapPin size={10} />
                <span>{currentLocation.city}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{user.streakCount}d Streak</span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
              Navigation
            </span>

            {navLinks.map((item) => {
              const isActive = currentScreen === item.id;
              const IconComp = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-2xl transition-all flex items-center justify-between text-xs group ${
                    isActive
                      ? 'bg-indigo-600/25 text-cyan-300 border border-indigo-500/40 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp size={16} className={isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'} />
                    <div>
                      <div className="font-semibold leading-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                    </div>
                  </div>

                  {item.badge ? (
                    <span className="text-[9px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <button
            onClick={() => {
              setIsDrawerOpen(false);
              setIsTestOnPhoneModalOpen(true);
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Smartphone size={14} className="text-emerald-400" />
            <span>Test on Real Phone (QR)</span>
          </button>

          <button
            onClick={() => {
              claimDailyDrop();
              setIsDrawerOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95"
          >
            <Flame size={14} className="fill-current" />
            <span>Claim Daily Drop</span>
          </button>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">PromptPulse v2.4 (Material 3)</p>
        </div>
      </div>
    </div>
  );
};
