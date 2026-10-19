import React from 'react';
import { X, Sparkles, Copy, Play, Bookmark, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DiscoverStoryModal: React.FC = () => {
  const { activeStory, closeStory, showToast, setCurrentScreen, setAiActiveTab } = useApp();

  if (!activeStory) return null;

  return (
    <div className="absolute inset-0 z-40 bg-slate-950 flex flex-col animate-in fade-in slide-in-from-bottom duration-250 select-none">
      {/* Cover Header */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src={activeStory.coverImage}
          alt={activeStory.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <button
          onClick={closeStory}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white backdrop-blur-md"
        >
          <X size={18} />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-1 rounded-full">
            {activeStory.tag}
          </span>
          <h2 className="text-base font-extrabold text-white mt-1.5 leading-snug">
            {activeStory.title}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">{activeStory.subtitle}</p>
        </div>
      </div>

      {/* Story Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-white/10">
          <span>Curated by {activeStory.author}</span>
          <span>{activeStory.readCount}</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          To achieve top-tier fidelity with generative models, modern prompt architects calibrate three key axes: camera focal length, volumetric light decay, and negative constraint filters.
        </p>

        {/* Prompt Card Inside Story */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
              Featured Prompt Formula
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(activeStory.promptSnippet);
                showToast('Prompt snippet copied!');
              }}
              className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              <Copy size={12} />
              <span>Copy</span>
            </button>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 leading-relaxed">
            {activeStory.promptSnippet}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <button
          onClick={() => {
            closeStory();
            setCurrentScreen('aistudio');
            setAiActiveTab('image');
          }}
          className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <Play size={14} className="fill-current" />
          <span>Test in AI Studio</span>
        </button>
      </div>
    </div>
  );
};
