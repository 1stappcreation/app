import React, { useState } from 'react';
import {
  UploadCloud,
  Calendar,
  BarChart3,
  Users,
  Copy,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PromptCategory, PromptVariable } from '../../types';

export const AdminDashboardScreen: React.FC = () => {
  const { analytics, createAdminPrompt, prompts, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'upload' | 'analytics' | 'queue'>('upload');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PromptCategory>('ChatGPT');
  const [modelTarget, setModelTarget] = useState<'ChatGPT-4o' | 'Midjourney v6.1' | 'Claude 3.5 Sonnet' | 'DALL-E 3' | 'Gemini 1.5 Pro'>('ChatGPT-4o');
  const [rawPrompt, setRawPrompt] = useState('');
  const [isDaily, setIsDaily] = useState(true);
  const [isTrending, setIsTrending] = useState(false);
  const [isEditorsChoice, setIsEditorsChoice] = useState(true);
  const [tagsInput, setTagsInput] = useState('Daily Drop, Strategy');
  const [variables, setVariables] = useState<PromptVariable[]>([
    { key: 'target_goal', label: 'Target Goal', defaultValue: 'Scale to 10k MRR', placeholder: 'e.g. Reduce churn' },
  ]);

  const handleAddVariable = () => {
    setVariables((prev) => [
      ...prev,
      {
        key: `var_${Date.now().toString().slice(-4)}`,
        label: 'New Variable',
        defaultValue: 'Default sample',
        placeholder: 'Placeholder text',
      },
    ]);
  };

  const handleRemoveVariable = (index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawPrompt.trim()) {
      showToast('Title and prompt template are required');
      return;
    }

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    createAdminPrompt({
      title,
      description,
      category,
      modelTarget,
      rawPrompt,
      variables,
      tags,
      isDaily,
      isTrending,
      isEditorsChoice,
    });

    setTitle('');
    setDescription('');
    setRawPrompt('');
    showToast('Prompt successfully published to active feed!');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 pb-20 custom-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 bg-slate-950/90 backdrop-blur-xl px-4 py-3 z-10 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-amber-400" />
          <div>
            <h1 className="text-base font-extrabold tracking-tight">Admin & CMS</h1>
            <p className="text-[10px] text-slate-400">Prompt Curation, Schedule & Analytics</p>
          </div>
        </div>

        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
          ADMIN ACCESS
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud size={14} />
            <span>Upload Drop</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 size={14} />
            <span>Live Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'queue' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar size={14} />
            <span>Schedule ({prompts.length})</span>
          </button>
        </div>

        {/* Tab 1: Upload Prompt Form */}
        {activeTab === 'upload' && (
          <form onSubmit={handlePublish} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                <span>Prompt Metadata</span>
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Prompt Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Autonomous AI System Architect"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary for feed"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PromptCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ChatGPT">ChatGPT</option>
                    <option value="Midjourney">Midjourney</option>
                    <option value="Coding">Coding</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Creative">Creative</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Target Model</label>
                  <select
                    value={modelTarget}
                    onChange={(e) => setModelTarget(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ChatGPT-4o">ChatGPT-4o</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    <option value="Midjourney v6.1">Midjourney v6.1</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                    <option value="DALL-E 3">DALL-E 3</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Raw Prompt Template (Use [variable_name] syntax)
                </label>
                <textarea
                  rows={4}
                  value={rawPrompt}
                  onChange={(e) => setRawPrompt(e.target.value)}
                  placeholder="Act as a Principal Engineer. Build a [target_goal]..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Variable Builder */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Template Variables ({variables.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddVariable}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Add Variable</span>
                </button>
              </div>

              {variables.map((v, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    value={v.label}
                    onChange={(e) => {
                      const newVars = [...variables];
                      newVars[i].label = e.target.value;
                      newVars[i].key = e.target.value.toLowerCase().replace(/\s+/g, '_');
                      setVariables(newVars);
                    }}
                    placeholder="Label"
                    className="w-1/3 bg-transparent text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={v.defaultValue}
                    onChange={(e) => {
                      const newVars = [...variables];
                      newVars[i].defaultValue = e.target.value;
                      setVariables(newVars);
                    }}
                    placeholder="Default Value"
                    className="flex-1 bg-transparent text-xs text-slate-300 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveVariable(i)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Flags */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDaily}
                  onChange={(e) => setIsDaily(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
                />
                <span className="font-semibold text-white">Daily Drop</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
                />
                <span className="font-semibold text-slate-300">Trending</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditorsChoice}
                  onChange={(e) => setIsEditorsChoice(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
                />
                <span className="font-semibold text-slate-300">Editor's Pick</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <UploadCloud size={16} />
              <span>Publish Prompt to Android Feed</span>
            </button>
          </form>
        )}

        {/* Tab 2: Live Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>Daily Active Users</span>
                  <Users size={12} className="text-indigo-400" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  {analytics.dailyActiveUsers.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">+14.2% today</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>Total Prompt Copies</span>
                  <Copy size={12} className="text-amber-400" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  {(analytics.totalCopies / 1000000).toFixed(2)}M
                </div>
                <span className="text-[10px] text-indigo-400 font-semibold">12.4k copies/hr</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>Avg User Streak</span>
                  <Clock size={12} className="text-orange-400" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  {analytics.averageStreak} Days
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">78% D1-D7 retention</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>Monthly Actives</span>
                  <Users size={12} className="text-cyan-400" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  {analytics.monthlyActiveUsers.toLocaleString()}
                </div>
                <span className="text-[10px] text-cyan-400 font-semibold">All features free</span>
              </div>
            </div>

            {/* Category breakdown bar chart */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Category Popularity (Copies by Category)
              </h4>

              <div className="space-y-2">
                {analytics.categoryBreakdown.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">{item.category}</span>
                      <span className="text-slate-400 font-mono">
                        {item.percentage}% ({item.count.toLocaleString()})
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Scheduled Queue */}
        {activeTab === 'queue' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Prompts in Feed ({prompts.length})
            </h4>

            <div className="space-y-2">
              {prompts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded">
                        {p.category}
                      </span>
                      {p.isDaily && (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                          DAILY
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-white truncate">{p.title}</h5>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {p.copyCount.toLocaleString()} uses
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
