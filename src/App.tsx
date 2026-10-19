import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNav } from './components/layout/HeaderNav';
import { AndroidDeviceFrame } from './components/android/AndroidDeviceFrame';
import { AndroidStudioHub } from './components/studio/AndroidStudioHub';
import { TestOnPhoneModal } from './components/android/TestOnPhoneModal';

const MainLayout: React.FC = () => {
  const { viewMode } = useApp();

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Universal Control Header */}
      <HeaderNav />

      {/* Main Workspace based on selected ViewMode */}
      <main className="flex-1 overflow-hidden">
        {/* Mode 1: Split View (Device on Left, Kotlin Studio on Right) */}
        {viewMode === 'split' && (
          <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Android Pixel 8 Pro Device Simulator */}
            <div className="w-full lg:w-[460px] xl:w-[490px] shrink-0 bg-slate-950/95 border-b lg:border-b-0 lg:border-r border-slate-800 flex items-center justify-center overflow-y-auto p-2 sm:p-4 custom-scrollbar">
              <AndroidDeviceFrame />
            </div>

            {/* Right: Android Studio Architecture & Kotlin Code Hub */}
            <div className="flex-1 h-full overflow-hidden bg-slate-950 flex flex-col">
              <AndroidStudioHub />
            </div>
          </div>
        )}

        {/* Mode 2: Mobile Device Only */}
        {viewMode === 'mobile' && (
          <div className="h-full w-full flex items-center justify-center p-2 sm:p-6 bg-slate-950 overflow-y-auto custom-scrollbar">
            <AndroidDeviceFrame />
          </div>
        )}

        {/* Mode 3: Kotlin Studio Only */}
        {viewMode === 'studio' && (
          <div className="h-full w-full overflow-hidden bg-slate-950">
            <AndroidStudioHub />
          </div>
        )}
      </main>

      {/* Test On Phone QR Code & PWA Install Modal */}
      <TestOnPhoneModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
