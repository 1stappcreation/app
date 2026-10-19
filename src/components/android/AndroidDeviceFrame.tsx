import React, { useState, useEffect } from 'react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNavigationBar } from './AndroidNavigationBar';
import { AndroidNotificationShade } from './AndroidNotificationShade';
import { ToastNotification } from './ToastNotification';
import { AndroidNavigationDrawer } from './AndroidNavigationDrawer';
import { UserProfileModal } from './UserProfileModal';
import { HomeScreen } from '../screens/HomeScreen';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { AiStudioScreen } from '../screens/AiStudioScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { PromptDetailModal } from '../screens/PromptDetailModal';
import { NewsArticleModal } from '../screens/NewsArticleModal';
import { DiscoverStoryModal } from '../screens/DiscoverStoryModal';
import { useApp } from '../../context/AppContext';

export const AndroidDeviceFrame: React.FC = () => {
  const { currentScreen } = useApp();
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // On real mobile screens (< 640px width), render edge-to-edge full screen
  if (isMobileScreen) {
    return (
      <div className="relative w-full h-[calc(100dvh-56px)] bg-slate-950 flex flex-col overflow-hidden select-none">
        {/* 1. Android Status Bar */}
        <AndroidStatusBar />

        {/* 2. Main Screen Viewport */}
        <div className="relative flex-1 overflow-hidden flex flex-col">
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'discover' && <DiscoverScreen />}
          {currentScreen === 'aistudio' && <AiStudioScreen />}
          {currentScreen === 'news' && <NewsScreen />}
          {currentScreen === 'library' && <LibraryScreen />}
          {currentScreen === 'admin' && <AdminDashboardScreen />}

          {/* Overlays / Modal Screens */}
          <AndroidNavigationDrawer />
          <UserProfileModal />
          <PromptDetailModal />
          <NewsArticleModal />
          <DiscoverStoryModal />
          <AndroidNotificationShade />
          <ToastNotification />
        </div>

        {/* 3. Android Material 3 Bottom Navigation Bar */}
        <AndroidNavigationBar />
      </div>
    );
  }

  // On desktop and tablet simulators, render Google Pixel 8 Pro hardware rim
  return (
    <div className="relative flex justify-center items-center p-2 sm:p-4 select-none">
      {/* Outer Metallic Phone Rim & Hardware Bezel (Google Pixel 8 Pro style) */}
      <div className="relative w-full max-w-[390px] h-[810px] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1),0_0_40px_rgba(99,102,241,0.15)] ring-1 ring-slate-800 flex flex-col justify-between overflow-hidden">
        {/* Hardware side button aesthetics */}
        <div className="absolute -right-1 top-24 w-1 h-12 bg-slate-700 rounded-r-md opacity-80" />
        <div className="absolute -right-1 top-40 w-1 h-20 bg-slate-700 rounded-r-md opacity-80" />
        <div className="absolute -left-1 top-28 w-1 h-8 bg-slate-700 rounded-l-md opacity-80" />

        {/* Screen Bezel Inner Border */}
        <div className="relative w-full h-full bg-slate-950 rounded-[38px] overflow-hidden flex flex-col border border-white/10 shadow-inner">
          {/* 1. Android Status Bar */}
          <AndroidStatusBar />

          {/* 2. Main Screen Viewport */}
          <div className="relative flex-1 overflow-hidden flex flex-col">
            {currentScreen === 'home' && <HomeScreen />}
            {currentScreen === 'discover' && <DiscoverScreen />}
            {currentScreen === 'aistudio' && <AiStudioScreen />}
            {currentScreen === 'news' && <NewsScreen />}
            {currentScreen === 'library' && <LibraryScreen />}
            {currentScreen === 'admin' && <AdminDashboardScreen />}

            {/* Overlays / Modal Screens */}
            <AndroidNavigationDrawer />
            <UserProfileModal />
            <PromptDetailModal />
            <NewsArticleModal />
            <DiscoverStoryModal />
            <AndroidNotificationShade />
            <ToastNotification />
          </div>

          {/* 3. Android Material 3 Bottom Navigation Bar */}
          <AndroidNavigationBar />
        </div>
      </div>
    </div>
  );
};
