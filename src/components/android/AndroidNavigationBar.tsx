import React from 'react';
import { Home, Compass, Cpu, Newspaper, Bookmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AndroidNavigationBar: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'discover' as const, label: 'Discover', icon: Compass },
    { id: 'aistudio' as const, label: 'AI Studio', icon: Cpu, badge: '5' },
    { id: 'news' as const, label: 'News', icon: Newspaper },
    { id: 'library' as const, label: 'Library', icon: Bookmark },
  ];

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 z-20 select-none pb-1 shrink-0">
      {/* Material 3 Bottom Navigation Bar */}
      <div className="flex items-center justify-around pt-2 pb-1 px-1">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className="relative flex flex-col items-center justify-center flex-1 py-1 transition-all group"
            >
              {/* Material 3 Active Pill Container */}
              <div
                className={`flex items-center justify-center px-3.5 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/30 text-cyan-300 ring-1 ring-cyan-500/40 shadow-sm'
                    : 'text-slate-400 group-hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <IconComponent
                  size={19}
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium mt-1 tracking-tight transition-colors ${
                  isActive ? 'text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* Badge */}
              {item.badge && !isActive && (
                <span className="absolute top-0 right-2 bg-indigo-500 text-white text-[8px] font-bold px-1 rounded-full scale-90">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Android 14/15 Gesture Bar Indicator Pill */}
      <div className="w-full flex justify-center items-center py-1.5">
        <div className="w-28 h-1 bg-slate-600/70 rounded-full hover:bg-slate-400 transition-colors cursor-pointer" />
      </div>
    </div>
  );
};
