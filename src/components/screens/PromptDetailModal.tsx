import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Copy,
  Check,
  Play,
  Sparkles,
  Sliders,
  Terminal,
  Loader2,
  Bot,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PromptDetailModal: React.FC = () => {
  const {
    activeDetailPrompt,
    closePromptDetail,
    copyPromptToClipboard,
    testPromptLive,
    toggleBookmark,
    user,
    showToast,
    setCurrentScreen,
    setAiActiveTab,
  } = useApp();

  const [variables, setVariables] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'variables' | 'preview' | 'ai_output'>('variables');
  const [aiOutput, setAiOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (activeDetailPrompt) {
      const initialVars: Record<string, string> = {};
      activeDetailPrompt.variables.forEach((v) => {
        initialVars[v.key] = v.defaultValue;
      });
      setVariables(initialVars);
      setAiOutput(activeDetailPrompt.sampleOutput || '');
    }
  }, [activeDetailPrompt]);

  if (!activeDetailPrompt) return null;

  const isSaved = user.savedPromptIds.includes(activeDetailPrompt.id);

  const getInterpolatedPrompt = () => {
    let result = activeDetailPrompt.rawPrompt;
    Object.entries(variables).forEach(([key, val]) => {
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      result = result.replace(regex, val || `[${key}]`);
    });
    return result;
  };

  const handleCopy = async () => {
    const text = getInterpolatedPrompt();
    const success = await copyPromptToClipboard(activeDetailPrompt, text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTestRun = async () => {
    setIsGenerating(true);
    setActiveTab('ai_output');
    try {
      const promptText = getInterpolatedPrompt();
      const output = await testPromptLive(promptText, activeDetailPrompt.category, variables);
      setAiOutput(output);
    } catch (err) {
      console.error(err);
      showToast('Error executing prompt');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenInAiChat = () => {
    closePromptDetail();
    setCurrentScreen('aistudio');
    setAiActiveTab('chat');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeDetailPrompt.title,
        text: `Check out this AI Prompt on PromptVerse: ${activeDetailPrompt.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('Share link copied to clipboard!');
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950 z-30 flex flex-col animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={closePromptDetail}
          className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
            {activeDetailPrompt.category}
          </span>
          <button
            onClick={() => toggleBookmark(activeDetailPrompt.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark size={18} className={isSaved ? 'fill-indigo-400' : ''} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-24">
        {/* Title & Metadata */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {activeDetailPrompt.modelTarget}
            </span>
            {activeDetailPrompt.isDaily && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Daily Drop
              </span>
            )}
          </div>

          <h2 className="text-base font-bold text-white leading-tight">
            {activeDetailPrompt.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {activeDetailPrompt.description}
          </p>
        </div>

        {/* Author pill */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
          <img
            src={activeDetailPrompt.author.avatar}
            alt={activeDetailPrompt.author.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white truncate">
              {activeDetailPrompt.author.name}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">{activeDetailPrompt.author.role}</p>
          </div>
          <button
            onClick={handleOpenInAiChat}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <Bot size={13} />
            <span>Chatbot</span>
          </button>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('variables')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'variables'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders size={13} />
            <span>Customize ({activeDetailPrompt.variables.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal size={13} />
            <span>Ready Prompt</span>
          </button>
          <button
            onClick={() => setActiveTab('ai_output')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ai_output'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} className="text-amber-400" />
            <span>Live Output</span>
          </button>
        </div>

        {/* Tab 1: Dynamic Variables */}
        {activeTab === 'variables' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Prompt Variables</span>
              <span>Edit to customize your output</span>
            </div>

            {activeDetailPrompt.variables.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">
                This prompt is self-contained and ready to execute.
              </div>
            ) : (
              activeDetailPrompt.variables.map((variable) => (
                <div key={variable.key} className="space-y-1">
                  <label className="text-[11px] font-semibold text-indigo-300">
                    {variable.label}
                  </label>
                  <textarea
                    rows={2}
                    value={variables[variable.key] ?? variable.defaultValue}
                    onChange={(e) =>
                      setVariables((prev) => ({ ...prev, [variable.key]: e.target.value }))
                    }
                    placeholder={variable.placeholder}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono"
                  />
                </div>
              ))
            )}

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('preview')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 flex items-center justify-center gap-1.5"
              >
                <span>Preview Ready Prompt</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Full Interpolated Prompt */}
        {activeTab === 'preview' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Interpolated Prompt</span>
              <span className="text-[10px] font-mono">
                {getInterpolatedPrompt().length} characters
              </span>
            </div>

            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-text shadow-inner">
              {getInterpolatedPrompt()}
            </div>

            {activeDetailPrompt.midjourneyParams && (
              <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs">
                <span className="font-bold text-purple-300">Midjourney Flags: </span>
                <span className="font-mono text-purple-200">
                  {activeDetailPrompt.midjourneyParams}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: AI Test Output */}
        {activeTab === 'ai_output' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>Gemini Execution Sandbox</span>
              </span>
              {isGenerating && (
                <span className="text-indigo-400 flex items-center gap-1 text-[11px]">
                  <Loader2 size={12} className="animate-spin" />
                  Generating...
                </span>
              )}
            </div>

            <div className="w-full min-h-[160px] bg-slate-900 border border-indigo-500/30 rounded-2xl p-3.5 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-text font-mono">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 space-y-2">
                  <Loader2 size={24} className="animate-spin text-indigo-400" />
                  <p className="text-xs">Processing prompt with Gemini...</p>
                </div>
              ) : aiOutput ? (
                aiOutput
              ) : (
                <div className="text-slate-500 text-center py-8">
                  Tap "Test with AI" below to execute this prompt live!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Bar in Android M3 */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 z-20 flex items-center gap-2.5">
        <button
          onClick={handleTestRun}
          disabled={isGenerating}
          className="flex-1 py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
        >
          {isGenerating ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Play size={14} className="fill-current text-amber-400" />
          )}
          <span>{isGenerating ? 'Testing...' : 'Test with AI'}</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 active:scale-95"
        >
          {copied ? <Check size={15} className="text-emerald-300" /> : <Copy size={15} />}
          <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
        </button>
      </div>
    </div>
  );
};
