import React, { useState } from 'react';
import {
  Bot,
  Image as ImageIcon,
  Briefcase,
  Megaphone,
  Code2,
  GraduationCap,
  Zap,
  Palette,
  ChevronRight,
  Search,
  Copy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PromptCategory } from '../../types';

interface CategoryMeta {
  id: PromptCategory;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  description: string;
  subcategories: string[];
}

const CATEGORIES_DATA: CategoryMeta[] = [
  {
    id: 'ChatGPT',
    name: 'ChatGPT',
    icon: Bot,
    color: '#10A37F',
    gradient: 'from-emerald-950 to-teal-900',
    description: 'Autonomous reasoning, GPT-4o system personas, and chain-of-thought workflows.',
    subcategories: ['Custom GPTs', 'Data Analysis', 'Writing', 'Logic & Math'],
  },
  {
    id: 'Midjourney',
    name: 'Midjourney',
    icon: ImageIcon,
    color: '#EC4899',
    gradient: 'from-pink-950 to-purple-900',
    description: 'v6.1 cinematic aesthetics, lens lighting formulas, photorealism, and parameter tuning.',
    subcategories: ['Cinematic', 'Architecture', 'Portraits', 'Character Design'],
  },
  {
    id: 'Coding',
    name: 'Coding & Architecture',
    icon: Code2,
    color: '#6366F1',
    gradient: 'from-indigo-950 to-blue-900',
    description: 'Jetpack Compose, Clean Architecture, multi-agent frameworks, and test automation.',
    subcategories: ['Android / Kotlin', 'Python', 'System Design', 'DevOps'],
  },
  {
    id: 'Marketing',
    name: 'Marketing & Growth',
    icon: Megaphone,
    color: '#F59E0B',
    gradient: 'from-amber-950 to-orange-900',
    description: 'Direct response copywriting, viral hook matrices, email funnels, and ad creative.',
    subcategories: ['Viral Hooks', 'Cold Outreach', 'Landing Pages', 'PPC Ads'],
  },
  {
    id: 'Business',
    name: 'Business & Strategy',
    icon: Briefcase,
    color: '#3B82F6',
    gradient: 'from-blue-950 to-cyan-900',
    description: 'High-stakes negotiation, term sheets, board decks, and business model generation.',
    subcategories: ['Negotiation', 'Pitch Decks', 'Pricing Strategy', 'M&A'],
  },
  {
    id: 'Education',
    name: 'Education & Learning',
    icon: GraduationCap,
    color: '#8B5CF6',
    gradient: 'from-purple-950 to-violet-900',
    description: 'Feynman technique accelerators, socratic mentors, and complex STEM breakdown.',
    subcategories: ['First Principles', 'STEM Mentors', 'Language Learning'],
  },
  {
    id: 'Productivity',
    name: 'Productivity & GTD',
    icon: Zap,
    color: '#14B8A6',
    gradient: 'from-teal-950 to-emerald-900',
    description: 'PARA framework organization, Notion/Obsidian engines, and automation routines.',
    subcategories: ['Second Brain', 'Time Blocking', 'Meeting Summaries'],
  },
  {
    id: 'Creative',
    name: 'Creative Writing',
    icon: Palette,
    color: '#F43F5E',
    gradient: 'from-rose-950 to-pink-900',
    description: 'Sci-fi worldbuilding, screenplay dialogue, character backstories, and poetry.',
    subcategories: ['Worldbuilding', 'Screenwriting', 'Plot Outlines'],
  },
];

export const CategoriesScreen: React.FC = () => {
  const { prompts, openPromptDetail, copyPromptToClipboard } = useApp();
  const [selectedCat, setSelectedCat] = useState<PromptCategory | null>(null);
  const [catSearch, setCatSearch] = useState<string>('');

  const displayedPrompts = selectedCat
    ? prompts.filter((p) => p.category === selectedCat)
    : prompts;

  const filtered = catSearch
    ? displayedPrompts.filter(
        (p) =>
          p.title.toLowerCase().includes(catSearch.toLowerCase()) ||
          p.description.toLowerCase().includes(catSearch.toLowerCase())
      )
    : displayedPrompts;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 pb-20 custom-scrollbar">
      {/* Top App Bar */}
      <div className="sticky top-0 bg-slate-950/90 backdrop-blur-xl px-4 py-3 z-10 border-b border-white/5 flex items-center justify-between">
        <div>
          <h1 className="text-base font-extrabold tracking-tight">AI Categories</h1>
          <p className="text-[10px] text-slate-400">7 Core Disciplines • Curated Prompts</p>
        </div>

        {selectedCat && (
          <button
            onClick={() => setSelectedCat(null)}
            className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20"
          >
            Show All
          </button>
        )}
      </div>

      <div className="p-4 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder={selectedCat ? `Search in ${selectedCat}...` : 'Search across all categories...'}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Categories Grid (if no category selected) */}
        {!selectedCat && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Browse Categories
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES_DATA.map((cat) => {
                const count = prompts.filter((p) => p.category === cat.id).length;
                const IconComp = cat.icon;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`rounded-2xl p-4 bg-gradient-to-br ${cat.gradient} border border-white/10 hover:border-white/25 transition-all cursor-pointer shadow-lg hover:scale-[1.02] flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                          style={{ backgroundColor: `${cat.color}25`, border: `1px solid ${cat.color}50` }}
                        >
                          <IconComp size={18} style={{ color: cat.color }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded-full font-mono">
                          {count}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white tracking-tight">{cat.name}</h4>
                      <p className="text-[10px] text-slate-300/80 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-semibold text-slate-300">
                      <span>Explore</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Category Header Banner */}
        {selectedCat && (
          <div>
            {(() => {
              const currentMeta = CATEGORIES_DATA.find((c) => c.id === selectedCat);
              if (!currentMeta) return null;
              const IconComp = currentMeta.icon;

              return (
                <div
                  className={`rounded-2xl p-4 bg-gradient-to-br ${currentMeta.gradient} border border-white/15 mb-4 shadow-xl`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${currentMeta.color}30` }}
                    >
                      <IconComp size={22} style={{ color: currentMeta.color }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">{currentMeta.name}</h2>
                      <p className="text-[11px] text-slate-300">{currentMeta.description}</p>
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
                    {currentMeta.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] bg-black/30 text-slate-200 px-2 py-0.5 rounded-full font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Prompts in {selectedCat} ({filtered.length})
            </h3>
          </div>
        )}

        {/* Prompt Cards in Category */}
        <div className="space-y-3">
          {filtered.map((prompt) => (
            <div
              key={prompt.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 hover:border-slate-700 transition-all flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 text-[10px]">
                  <span className="font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {prompt.modelTarget}
                  </span>
                </div>

                <h4
                  onClick={() => openPromptDetail(prompt)}
                  className="text-xs font-bold text-white hover:text-indigo-400 cursor-pointer line-clamp-1"
                >
                  {prompt.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {prompt.description}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => openPromptDetail(prompt)}
                  className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 font-semibold text-xs rounded-xl transition-all"
                >
                  View
                </button>
                <button
                  onClick={() => copyPromptToClipboard(prompt)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all self-center"
                  title="Copy"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
