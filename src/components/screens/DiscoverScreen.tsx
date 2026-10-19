import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Flame,
  Award,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Play,
  X,
  Share2,
  Bookmark,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TRENDY_AI_ACHIEVEMENTS, DISCOVER_STORIES } from '../../data/mockData';
import { AiAchievement } from '../../types';

export const DiscoverScreen: React.FC = () => {
  const { openStory, openPromptDetail, prompts, copyPromptToClipboard, setCurrentScreen, setAiActiveTab, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeAchievement, setActiveAchievement] = useState<AiAchievement | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const categories = [
    'All',
    'Biotechnology',
    'Video Synthesis',
    'Autonomous Agents',
    'LLM Reasoning',
    'Robotics & Vision',
  ];

  const filteredAchievements = TRENDY_AI_ACHIEVEMENTS.filter((ach) => {
    if (selectedCategory === 'All') return true;
    return ach.category === selectedCategory;
  });

  const heroAchievement = TRENDY_AI_ACHIEVEMENTS[0]; // AlphaFold 3

  const handleCopySnippet = (ach: AiAchievement) => {
    if (ach.relatedPromptSnippet) {
      navigator.clipboard.writeText(ach.relatedPromptSnippet);
      setCopiedSnippetId(ach.id);
      showToast(`Prompt formula copied for ${ach.title}`);
      setTimeout(() => setCopiedSnippetId(null), 2000);
    }
  };

  const handleTestInStudio = (ach: AiAchievement) => {
    if (ach.relatedPromptSnippet) {
      navigator.clipboard.writeText(ach.relatedPromptSnippet);
    }
    setActiveAchievement(null);
    setCurrentScreen('aistudio');
    showToast(`Loaded ${ach.title} into AI Studio`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 pb-20 custom-scrollbar select-none">
      {/* Top Sticky Header */}
      <div className="sticky top-0 bg-slate-950/90 backdrop-blur-xl px-4 py-3 z-10 border-b border-white/5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Compass size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight">Discover</h1>
            <p className="text-[10px] text-slate-400">Trendy AI Achievements & Frontier Milestones</p>
          </div>
        </div>

        <span className="text-[10px] bg-violet-500/15 text-violet-300 border border-violet-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
          <Flame size={11} className="text-amber-400 fill-amber-400" />
          <span>2026 Breakthroughs</span>
        </span>
      </div>

      <div className="p-4 space-y-6">
        {/* ================= SNAPCHAT DISCOVER STORIES CAROUSEL ================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles size={13} className="text-violet-400" />
              <span>PromptPulse Visual Stories</span>
            </span>
            <span className="text-[10px] text-slate-500">Snapchat Discover Feed</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar -mx-4 px-4">
            {DISCOVER_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => openStory(story)}
                className="relative rounded-2xl overflow-hidden w-36 h-48 shrink-0 cursor-pointer group shadow-xl border border-white/10 hover:border-violet-500/40 transition-all"
              >
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-2 left-2">
                  <span className="text-[8px] font-black uppercase tracking-wider bg-violet-600 text-white px-2 py-0.5 rounded-full">
                    {story.tag}
                  </span>
                </div>

                <div className="absolute bottom-2 inset-x-2 text-white">
                  <h4 className="text-[11px] font-bold line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                    {story.title}
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">{story.readCount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= TRENDY AI ACHIEVEMENTS SECTION ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Award size={16} className="text-amber-400" />
                <span>Trendy AI Achievements</span>
              </h2>
              <p className="text-[10px] text-slate-400">
                Frontier breakthroughs, scientific milestones & benchmark records
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              {filteredAchievements.length} Milestones
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ================= SPOTLIGHT HERO ACHIEVEMENT CARD ================= */}
          {selectedCategory === 'All' && (
            <div
              onClick={() => setActiveAchievement(heroAchievement)}
              className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border border-violet-500/30 hover:border-violet-500/60 transition-all bg-slate-900"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={heroAchievement.coverImage}
                  alt={heroAchievement.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-violet-600 text-white px-2.5 py-1 rounded-full shadow">
                    FEATURED BREAKTHROUGH
                  </span>
                  <span className="text-[9px] font-bold bg-black/60 text-emerald-400 border border-emerald-500/40 px-2 py-1 rounded-full backdrop-blur-md">
                    {heroAchievement.impactMetric}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-indigo-300">
                    {heroAchievement.organization} • {heroAchievement.year}
                  </span>
                  <span>{heroAchievement.readTime}</span>
                </div>

                <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {heroAchievement.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {heroAchievement.description}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {heroAchievement.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-violet-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Inspect Milestone</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= ACHIEVEMENTS GRID ================= */}
          <div className="space-y-3.5">
            {filteredAchievements.map((ach) => (
              <div
                key={ach.id}
                onClick={() => setActiveAchievement(ach)}
                className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 transition-all cursor-pointer shadow-lg hover:bg-slate-850 group space-y-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <img
                      src={ach.coverImage}
                      alt={ach.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold text-violet-400 uppercase tracking-wider">
                        {ach.category}
                      </span>
                      <span className="font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                        {ach.impactMetric}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                      {ach.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {ach.subtitle}
                    </p>
                  </div>
                </div>

                {/* Footer with actions */}
                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="text-slate-400">
                    {ach.organization} • {ach.year}
                  </span>

                  <div className="flex items-center gap-2">
                    {ach.relatedPromptSnippet && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopySnippet(ach);
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1 font-semibold"
                      >
                        {copiedSnippetId === ach.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedSnippetId === ach.id ? 'Copied' : 'Prompt'}</span>
                      </button>
                    )}

                    <span className="text-indigo-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Breakdown</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= ACHIEVEMENT DETAIL MODAL ================= */}
      {activeAchievement && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Cover Image */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900 shrink-0">
              <img
                src={activeAchievement.coverImage}
                alt={activeAchievement.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setActiveAchievement(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-3 left-4 right-4">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-violet-600 text-white px-2.5 py-0.5 rounded-full">
                    {activeAchievement.category}
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {activeAchievement.impactMetric}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1.5 leading-snug">
                  {activeAchievement.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                <span>By {activeAchievement.organization}</span>
                <span>Milestone Year: {activeAchievement.year}</span>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs mb-1">Breakthrough Overview</h4>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {activeAchievement.description}
                </p>
              </div>

              {/* Related Prompt Formula Box */}
              {activeAchievement.relatedPromptSnippet && (
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-violet-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>Replicable Prompt Formula</span>
                    </span>
                    <button
                      onClick={() => handleCopySnippet(activeAchievement)}
                      className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 font-semibold"
                    >
                      {copiedSnippetId === activeAchievement.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedSnippetId === activeAchievement.id ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-200 border border-slate-800 leading-relaxed">
                    {activeAchievement.relatedPromptSnippet}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeAchievement.tags.map((t) => (
                  <span key={t} className="text-[10px] bg-slate-900 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopySnippet(activeAchievement)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Copy size={14} />
                <span>Copy Prompt</span>
              </button>

              <button
                onClick={() => handleTestInStudio(activeAchievement)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all active:scale-95"
              >
                <Play size={13} className="fill-current" />
                <span>Test in AI Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
