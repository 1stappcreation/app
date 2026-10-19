import React from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Bot,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewsArticleModal: React.FC = () => {
  const {
    activeNewsArticle,
    closeNewsArticle,
    toggleBookmarkNews,
    user,
    showToast,
    setCurrentScreen,
    setAiActiveTab,
    sendChatMessage,
  } = useApp();

  if (!activeNewsArticle) return null;

  const isSaved = user.savedNewsIds.includes(activeNewsArticle.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeNewsArticle.title,
        text: `${activeNewsArticle.title} via PromptPulse`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('Article link copied to clipboard!');
    }
  };

  const handleSynthesizePrompt = () => {
    const promptDraft = `Based on the verified report "${activeNewsArticle.title}" by ${activeNewsArticle.source.name}:\n\nAnalyze the technical implications of: ${activeNewsArticle.summary}\n\nGenerate:\n1. 3 actionable prompt strategies\n2. Key engineering opportunities\n3. Strategic risks`;
    
    closeNewsArticle();
    setCurrentScreen('aistudio');
    setAiActiveTab('chat');
    sendChatMessage(promptDraft, 'gemini-3.8-flash', 'You are an elite Research & Technology Analyst at PromptPulse.');
    showToast('Synthesizing prompt with Gemini...');
  };

  return (
    <div className="absolute inset-0 bg-slate-950 z-30 flex flex-col animate-in fade-in slide-in-from-right-4 duration-200 select-none">
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={closeNewsArticle}
          className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleBookmarkNews(activeNewsArticle.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark size={18} className={isSaved ? 'fill-current' : ''} />
          </button>
          <button onClick={handleShare} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-24">
        {/* Source Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white">{activeNewsArticle.source.name}</span>
            {activeNewsArticle.source.isVerified && (
              <CheckCircle2 size={13} className="text-cyan-400 fill-cyan-400/20" />
            )}
            <span className="text-[10px] text-slate-400 font-mono">({activeNewsArticle.source.domain})</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock size={11} />
            <span>{activeNewsArticle.publishedAt}</span>
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg">
          <img
            src={activeNewsArticle.thumbnailUrl}
            alt={activeNewsArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Category & Read Time */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {activeNewsArticle.category}
          </span>
          <span className="text-[10px] text-slate-400">
            {activeNewsArticle.readTimeMinutes} min read
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-base font-extrabold text-white leading-snug">
          {activeNewsArticle.title}
        </h1>

        {/* Lead Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium italic border-l-4 border-l-cyan-400">
          {activeNewsArticle.summary}
        </div>

        {/* Article Body */}
        <div className="text-xs text-slate-200 leading-relaxed space-y-3 font-sans">
          <p>{activeNewsArticle.content}</p>
          <p>
            Industry consensus indicates that hardware-accelerated multimodal architectures are becoming standard on consumer Android devices. Software developers who optimize for low-power inference will capture significant early-mover advantages across consumer and enterprise markets.
          </p>
        </div>
      </div>

      {/* Floating Bottom Bar: Synthesize Prompt with AI */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 z-20 flex items-center gap-2.5">
        <button
          onClick={handleSynthesizePrompt}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95"
        >
          <Sparkles size={15} />
          <span>Synthesize AI Prompt from Story</span>
        </button>
      </div>
    </div>
  );
};
