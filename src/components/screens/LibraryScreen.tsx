import React from 'react';
import {
  Bookmark,
  Flame,
  Sparkles,
  ChevronRight,
  Clock,
  Trash2,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LibraryScreen: React.FC = () => {
  const {
    user,
    prompts,
    openPromptDetail,
    toggleBookmark,
    generatedImages,
    generatedVideos,
    setAiActiveTab,
    setCurrentScreen,
    setIsProfileModalOpen,
    showToast,
  } = useApp();

  const savedPrompts = prompts.filter((p) => user.savedPromptIds.includes(p.id));

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 pb-20 custom-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 bg-slate-950/90 backdrop-blur-xl px-4 py-3 z-10 border-b border-white/5 flex items-center justify-between">
        <div>
          <h1 className="text-base font-extrabold tracking-tight">Library & Saved</h1>
          <p className="text-[10px] text-slate-400">Offline Prompts & AI Creations</p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold">
          <Flame size={13} className="fill-amber-400" />
          <span>{user.streakCount} Day Streak</span>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* User Profile Summary & AI Twin Portal */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-violet-500/30 shadow-xl space-y-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-violet-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-white truncate">{user.name}</h3>
                <span className="text-[8px] bg-violet-500/20 text-cyan-300 border border-violet-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                  AI Twin Level 5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              <p className="text-[10px] text-indigo-300 font-medium mt-0.5">
                {savedPrompts.length} Saved Prompts • {generatedImages.length + generatedVideos.length} AI Generations
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[11px] rounded-xl shadow-md shadow-violet-600/25 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Sparkles size={13} className="text-pink-300" />
            <span>Meet & Converse with Your AI Version →</span>
          </button>
        </div>

        {/* 1. Saved Prompts Collection */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bookmarked Prompts ({savedPrompts.length})
            </h4>
          </div>

          {savedPrompts.length === 0 ? (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
              <Bookmark size={20} className="text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">No saved prompts yet.</p>
              <p className="text-[10px] text-slate-500">
                Tap the bookmark icon on any prompt to save it to your local library.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
                >
                  <div
                    onClick={() => openPromptDetail(prompt)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <span className="text-[9px] font-bold text-indigo-400 uppercase">
                      {prompt.category} • {prompt.modelTarget}
                    </span>
                    <h5 className="text-xs font-bold text-white truncate">{prompt.title}</h5>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {prompt.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleBookmark(prompt.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400"
                      title="Remove"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => openPromptDetail(prompt)}
                      className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Recent AI Creations (Images & Videos) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent AI Creations
            </h4>
            <button
              onClick={() => setCurrentScreen('aistudio')}
              className="text-[10px] text-indigo-400 font-semibold hover:underline"
            >
              Open AI Studio →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {generatedImages.slice(0, 2).map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  setAiActiveTab('image');
                  setCurrentScreen('aistudio');
                }}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden cursor-pointer hover:border-slate-700 transition-all"
              >
                <div className="aspect-video bg-slate-950 overflow-hidden">
                  <img src={img.url} alt="Gen" className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <span className="text-[9px] font-bold text-pink-400 flex items-center gap-1">
                    <ImageIcon size={9} /> Image
                  </span>
                  <p className="text-[10px] text-slate-300 truncate mt-0.5">{img.prompt}</p>
                </div>
              </div>
            ))}

            {generatedVideos.slice(0, 2).map((vid) => (
              <div
                key={vid.id}
                onClick={() => {
                  setAiActiveTab('video');
                  setCurrentScreen('aistudio');
                }}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden cursor-pointer hover:border-slate-700 transition-all"
              >
                <div className="aspect-video bg-slate-950 flex items-center justify-center">
                  <video src={vid.url} className="w-full h-full object-cover" muted />
                </div>
                <div className="p-2">
                  <span className="text-[9px] font-bold text-amber-400 flex items-center gap-1">
                    <Video size={9} /> Veo Video
                  </span>
                  <p className="text-[10px] text-slate-300 truncate mt-0.5">{vid.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
