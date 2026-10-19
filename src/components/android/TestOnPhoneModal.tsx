import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  X,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  ArrowRight,
  Code2,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TestOnPhoneModal: React.FC = () => {
  const { isTestOnPhoneModalOpen, setIsTestOnPhoneModalOpen, showToast, setViewMode } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeStepTab, setActiveStepTab] = useState<'instant' | 'pwa' | 'apk'>('instant');

  // Determine current active URL
  const appUrl =
    typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
      ? window.location.href
      : 'https://ais-pre-wxykuawqath4b36xnoywew-330319772591.asia-east1.run.app';

  useEffect(() => {
    if (!isTestOnPhoneModalOpen) return;

    // Generate high resolution QR Code with dark styling
    QRCode.toDataURL(
      appUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [isTestOnPhoneModalOpen, appUrl]);

  if (!isTestOnPhoneModalOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      showToast('App link copied to clipboard!');
      setTimeout(() => setCopied(false), 2200);
    } catch {
      showToast('Could not copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PromptPulse - Android App',
          text: 'Test PromptPulse on your Android device:',
          url: appUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Smartphone size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Test on Android Phone</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Scan QR Code or install directly on your device</p>
            </div>
          </div>

          <button
            onClick={() => setIsTestOnPhoneModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 pt-3 bg-slate-900/50 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveStepTab('instant')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
              activeStepTab === 'instant'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode size={14} />
            <span>1. Scan QR Code</span>
          </button>

          <button
            onClick={() => setActiveStepTab('pwa')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
              activeStepTab === 'pwa'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download size={14} />
            <span>2. Install as App (PWA)</span>
          </button>

          <button
            onClick={() => setActiveStepTab('apk')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
              activeStepTab === 'apk'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 size={14} />
            <span>3. Kotlin / APK Build</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* TAB 1: Scan QR Code */}
          {activeStepTab === 'instant' && (
            <div className="flex flex-col items-center text-center space-y-4">
              {/* QR Code Container */}
              <div className="p-3 bg-white rounded-2xl shadow-xl shadow-black/40 ring-4 ring-indigo-500/20">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Scan to open PromptPulse on Android"
                    className="w-48 h-48 rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-xl text-slate-400 text-xs">
                    Generating QR Code...
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                  <span>Point your Android camera at the QR code</span>
                </p>
                <p className="text-xs text-slate-400 max-w-sm">
                  Opens instantaneously in Chrome, Brave, or Samsung Internet with full hardware touch, video, and audio acceleration.
                </p>
              </div>

              {/* URL Box */}
              <div className="w-full flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 bg-transparent text-slate-300 font-mono text-[11px] truncate px-2 outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shrink-0"
                >
                  {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Share Link"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PWA Install Guide */}
          {activeStepTab === 'pwa' && (
            <div className="space-y-4 text-left">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Full-Screen Standalone App</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    You can install PromptPulse directly onto your Android Home Screen without needing the Google Play Store. It runs in full-screen standalone mode with its own app icon and splash screen.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Open in Chrome on Android</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Scan the QR code or type the link into Google Chrome on your phone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Tap Menu (⋮) &gt; &quot;Install app&quot;</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tap the three vertical dots in the top right corner of Chrome and select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Launch PromptPulse from your Home Screen</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      The PromptPulse icon appears on your Android launcher. Tap it anytime to open full-screen!
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Copy size={14} />
                  <span>{copied ? 'Link Copied!' : 'Copy Link to Send to Phone'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Kotlin Jetpack Compose & APK */}
          {activeStepTab === 'apk' && (
            <div className="space-y-4 text-left">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck size={16} />
                  <span>Native Jetpack Compose 2.0 Codebase Included</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  PromptPulse includes the complete native Android project source code built with Kotlin, Jetpack Compose, Material 3, Room SQLite, and Firebase Authentication.
                </p>
              </div>

              <div className="space-y-2.5">
                <h5 className="text-xs font-bold text-slate-200">How to generate a native APK in Android Studio:</h5>
                <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside pl-1">
                  <li>
                    Switch to the <strong className="text-indigo-400">Kotlin Studio</strong> tab in the top header.
                  </li>
                  <li>
                    Download or copy the project files (<code className="text-slate-300">MainActivity.kt</code>, <code className="text-slate-300">PromptPulseDatabase.kt</code>, <code className="text-slate-300">build.gradle.kts</code>).
                  </li>
                  <li>
                    Open the project in <strong>Android Studio Ladybug / Meerkat</strong>.
                  </li>
                  <li>
                    Connect your Android phone with a USB cable or wireless debugging.
                  </li>
                  <li>
                    Tap <strong>Run (▶)</strong> or execute <code className="text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">./gradlew assembleDebug</code> to install the debug APK directly!
                  </li>
                </ol>
              </div>

              <button
                onClick={() => {
                  setIsTestOnPhoneModalOpen(false);
                  setViewMode('studio');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Code2 size={14} className="text-indigo-400" />
                <span>Open Kotlin Studio Source Files</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>Responsive for Android 10, 11, 12, 13, 14, 15+</span>
          </div>

          <button
            onClick={() => setIsTestOnPhoneModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
