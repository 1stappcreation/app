import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Flame,
  Bookmark,
  Sparkles,
  Check,
  Globe,
  Bot,
  Zap,
  Cpu,
  Layers,
  Send,
  Loader2,
  Copy,
  ChevronRight,
  ShieldCheck,
  Camera,
  RefreshCw,
  MessageSquare,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AiPersona {
  id: string;
  title: string;
  role: string;
  badge: string;
  avatar: string;
  color: string;
  traits: string[];
  manifesto: string;
}

const AI_PERSONAS: AiPersona[] = [
  {
    id: 'frontier-architect',
    title: 'Frontier AI Architect',
    role: 'Autonomous Multi-Agent & Kotlin Systems Lead',
    badge: 'Level 5 Twin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    color: '#6366F1',
    traits: ['Distributed State Machines', 'Kotlin Compose', 'Sub-200ms Latency', 'AST Optimization'],
    manifesto:
      'I dissect frontier models from first principles, orchestrating specialized sub-agents with verifiable consensus and zero-deadlock circuit breakers.',
  },
  {
    id: 'cyberpunk-director',
    title: 'Cyberpunk Visual Director',
    role: 'Cinematic Midjourney & Photoreal Maestro',
    badge: 'Aesthetic Twin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    color: '#EC4899',
    traits: ['35mm Kodak Vision3', 'Volumetric Atmospheric Fog', 'Arri Alexa LF', 'Anamorphic Flare'],
    manifesto:
      'I treat text prompts like optic lenses—calibrating light decay, film grain, and emotional resonance into cinematic 8K masterworks.',
  },
  {
    id: 'sovereign-founder',
    title: 'Sovereign Tech Founder',
    role: 'Pakistan Tech Export & Enterprise AI Visionary',
    badge: 'Venture Twin',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    color: '#10B981',
    traits: ['National IT Scaling', 'FinTech Telemetry', 'Urdu LLM Foundations', 'Cross-Border Rails'],
    manifesto:
      'I bridge Pakistan’s dense engineering talent in Karachi, Lahore, and Islamabad with global GPU clusters, building sovereign high-margin intelligence.',
  },
  {
    id: 'neural-polymath',
    title: 'Neural Reasoning Polymath',
    role: 'Deep Multi-Modal Logic & Scientific Synthesist',
    badge: 'Cognitive Twin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    color: '#06B6D4',
    traits: ['Chain-of-Thought Grounding', 'Biomolecular Modeling', 'Live API Streaming', 'Quantum Physics'],
    manifesto:
      'I explore the boundary where neural models cease memorizing and begin synthesizing genuine deductive proofs and novel scientific hypotheses.',
  },
];

const AVATAR_GALLERY = [
  {
    id: 'av-1',
    name: 'Cyberpunk Neon Visor',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-2',
    name: 'Modern Tech Founder',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-3',
    name: 'Quantum Neural Mesh',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-4',
    name: 'Sovereign Android Architect',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
];

export const UserProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    user,
    updateUserAvatar,
    currentLocation,
    setCurrentLocationCity,
    locationUpdates,
    testPromptLive,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ai_self' | 'account'>('ai_self');
  const [selectedPersona, setSelectedPersona] = useState<AiPersona>(AI_PERSONAS[0]);
  const [twinQuestion, setTwinQuestion] = useState('');
  const [twinDialogue, setTwinDialogue] = useState<{ question: string; answer: string } | null>({
    question: 'What is my highest-leverage focus for today?',
    answer: `As your evolved Frontier AI Twin, focus on building resilient agentic systems rather than isolated prompts. You have sharp analytical intuition—channel it into constructing self-healing automated workflows that turn 20 minutes of effort into thousands of autonomous executions.`,
  });
  const [isTwinThinking, setIsTwinThinking] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  if (!isProfileModalOpen) return null;

  const handleAskTwin = async (customPrompt?: string) => {
    const q = customPrompt || twinQuestion;
    if (!q.trim() || isTwinThinking) return;

    setIsTwinThinking(true);
    setTwinDialogue({ question: q, answer: '' });

    try {
      const promptInstruction = `You are the evolved, future AI Twin of ${user.name}. 
Your Persona: ${selectedPersona.title} (${selectedPersona.role}).
Manifesto: "${selectedPersona.manifesto}".
User's Location: ${currentLocation.city}, ${currentLocation.country}.

Address ${user.name} directly with visionary insight, high intellectual clarity, and motivating tactical advice. 
Question from ${user.name}: "${q}".

Give a concise, profound 2-3 paragraph answer addressing them as your own creator / human counterpart.`;

      const response = await testPromptLive(promptInstruction, 'Coding', {
        user: user.name,
        persona: selectedPersona.title,
      });

      setTwinDialogue({
        question: q,
        answer: response,
      });
      if (!customPrompt) setTwinQuestion('');
    } catch {
      setTwinDialogue({
        question: q,
        answer: `As your ${selectedPersona.title}, I perceive that your greatest advantage lies in synthesizing localized challenges in ${currentLocation.city} with cutting-edge multi-agent architecture. Keep pushing your boundary.`,
      });
    } finally {
      setIsTwinThinking(false);
    }
  };

  const handleCopyTwinAnswer = () => {
    if (twinDialogue?.answer) {
      navigator.clipboard.writeText(twinDialogue.answer);
      setCopiedAnswer(true);
      showToast('Copied AI Twin dialogue!');
      setTimeout(() => setCopiedAnswer(false), 2000);
    }
  };

  return (
    <div className="absolute inset-0 z-40 select-none animate-in fade-in duration-200 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsProfileModalOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Bottom Sheet Container */}
      <div className="relative bg-slate-950 border-t border-slate-800 rounded-t-3xl shadow-2xl z-50 max-h-[90%] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250">
        {/* Top Handle & Header Bar */}
        <div className="p-4 pb-2 bg-slate-900 border-b border-slate-800/80 shrink-0">
          <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-3" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-md shadow-violet-500/25">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>Profile & Digital Twin</span>
                  <span className="text-[9px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/40 px-1.5 py-0.2 rounded font-bold">
                    AI Mirror
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Meet and converse with your evolved AI Version</p>
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800/80 text-xs mt-3">
            <button
              onClick={() => setActiveTab('ai_self')}
              className={`flex-1 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'ai_self'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles size={13} className="text-pink-300" />
              <span>Meet Your AI Version</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'account'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User size={13} />
              <span>Account & Regional Pulse</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {activeTab === 'ai_self' ? (
            /* ================= TAB 1: MEET YOUR AI VERSION ================= */
            <div className="space-y-4">
              {/* Holographic Glowing Avatar Card */}
              <div className="relative rounded-3xl p-4.5 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-violet-500/30 shadow-2xl overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-pink-600/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative flex items-center gap-4">
                  {/* Glowing Animated Avatar Ring */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-pink-500 via-violet-500 to-cyan-400 shadow-lg shadow-violet-500/30">
                      <img
                        src={user.avatar}
                        alt="Digital Twin"
                        className="w-full h-full rounded-[14px] object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center text-[7px] text-white font-black">
                      AI
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-extrabold text-white truncate">{user.name}</h4>
                      <span className="text-[9px] bg-indigo-500/20 text-cyan-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold font-mono">
                        {selectedPersona.badge}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-violet-300 mt-0.5 truncate">
                      {selectedPersona.title}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Check size={11} />
                        <span>96% Sync Resonance</span>
                      </span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Flame size={11} className="fill-current" />
                        <span>{user.streakCount}d Streak</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Twin Manifesto / Signature */}
                <div className="mt-3.5 pt-3 border-t border-white/10 text-xs">
                  <p className="text-slate-300 italic font-sans text-[11px] leading-relaxed">
                    "{selectedPersona.manifesto}"
                  </p>
                </div>
              </div>

              {/* Persona Selector Carousel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Cpu size={13} className="text-cyan-400" />
                    <span>Choose Your AI Twin Version:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">4 Archetypes</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {AI_PERSONAS.map((persona) => {
                    const isSelected = selectedPersona.id === persona.id;
                    return (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => {
                          setSelectedPersona(persona);
                          showToast(`Switched twin to ${persona.title}`);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                          isSelected
                            ? 'bg-slate-900 border-violet-500 shadow-lg shadow-violet-500/20 ring-1 ring-violet-500/40'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: persona.color }}
                          />
                          <h5 className="text-[11px] font-bold text-white truncate">
                            {persona.title}
                          </h5>
                        </div>
                        <p className="text-[9px] text-slate-400 line-clamp-2 leading-snug">
                          {persona.role}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Talk to Your AI Version (Live Dialogue) */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-pink-400" />
                    <span>Talk to Your AI Version</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Real-time Gemini Mirror</span>
                </div>

                {/* Quick Prompts to ask AI Twin */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar -mx-1 px-1">
                  {[
                    '🔮 Focus for today?',
                    '⚡ Audit my prompt skills',
                    '🎯 My biggest blind spot?',
                    '🇵🇰 Pakistan AI advantage?',
                  ].map((quickQ) => (
                    <button
                      key={quickQ}
                      type="button"
                      onClick={() => handleAskTwin(quickQ)}
                      className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-800 shrink-0 font-medium transition-colors"
                    >
                      {quickQ}
                    </button>
                  ))}
                </div>

                {/* Custom Question Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={twinQuestion}
                    onChange={(e) => setTwinQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskTwin()}
                    placeholder="Ask your AI self anything..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                  <button
                    onClick={() => handleAskTwin()}
                    disabled={isTwinThinking || !twinQuestion.trim()}
                    className="p-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl shadow transition-all shrink-0 active:scale-95"
                  >
                    {isTwinThinking ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>

                {/* AI Twin Response Bubble */}
                {twinDialogue && (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-violet-500/20 space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-white/5">
                      <span className="font-bold text-violet-300 flex items-center gap-1">
                        <Bot size={11} />
                        <span>{selectedPersona.title} (Your AI Self):</span>
                      </span>
                      <button
                        onClick={handleCopyTwinAnswer}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                        title="Copy answer"
                      >
                        {copiedAnswer ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedAnswer ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                      {isTwinThinking ? (
                        <span className="flex items-center gap-2 text-violet-400 py-1">
                          <Loader2 size={13} className="animate-spin" />
                          <span>Your AI Self is reflecting...</span>
                        </span>
                      ) : (
                        twinDialogue.answer
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* AI Avatar Morphing Gallery */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Camera size={13} className="text-pink-400" />
                    <span>Adopt a Futuristic AI Avatar:</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Tap to equip</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_GALLERY.map((av) => {
                    const isCurrent = user.avatar === av.url;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => updateUserAvatar(av.url)}
                        className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all ${
                          isCurrent
                            ? 'border-cyan-400 shadow-lg shadow-cyan-400/30 scale-105'
                            : 'border-slate-800 hover:border-violet-500 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                            <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-black shadow">
                              ✓
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Capability Matrix Radar */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Award size={13} className="text-amber-400" />
                    <span>Digital Twin Intelligence Matrix</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">Synchronized</span>
                </div>

                <div className="space-y-2 pt-1 text-[10px]">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Multi-Agent System Architecture</span>
                      <span className="text-indigo-300 font-bold">96%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full w-[96%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Prompt Density & Chain-of-Thought</span>
                      <span className="text-violet-300 font-bold">94%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full w-[94%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Visual Synthesis & Diffusion Precision</span>
                      <span className="text-pink-300 font-bold">91%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full w-[91%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= TAB 2: ACCOUNT & REGIONAL PULSE ================= */
            <div className="space-y-4">
              {/* Account Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-amber-400 font-bold">
                    <Flame size={14} className="fill-current" />
                    <span>{user.streakCount} Day Daily Pulse Streak</span>
                  </div>
                </div>
              </div>

              {/* Location Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin size={12} className="text-cyan-400" />
                  <span>Active Location Pulse</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {locationUpdates.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setCurrentLocationCity(loc.city);
                        showToast(`Location set to ${loc.city}`);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        currentLocation.city === loc.city
                          ? 'bg-indigo-600/30 border-cyan-400 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{loc.city}</span>
                        {currentLocation.city === loc.city && <Check size={12} className="text-cyan-300" />}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {loc.temperature} • {loc.weatherCondition}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personalized Content Interests */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Personalized Content Topics
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-[11px] bg-slate-900 border border-slate-800 text-indigo-300 px-3 py-1 rounded-full font-medium"
                    >
                      #{interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Done Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-violet-600/30 transition-all active:scale-95"
          >
            Save & Return to App
          </button>
        </div>
      </div>
    </div>
  );
};
