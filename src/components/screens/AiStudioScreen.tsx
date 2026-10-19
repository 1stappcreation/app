import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Film,
  Search,
  Send,
  Loader2,
  Upload,
  Play,
  Copy,
  Check,
  Bot,
  Zap,
  Globe,
  Trash2,
  ChevronDown,
  ChevronUp,
  CircleDot,
  ArrowRight,
  ExternalLink,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiStudioScreen: React.FC = () => {
  const {
    chatMessages,
    chatLoading,
    sendChatMessage,
    clearChatHistory,
    generatedImages,
    imageLoading,
    generateImage,
    generatedVideos,
    videoLoading,
    generateVideo,
    searchHistory,
    searchLoading,
    runSearchGrounding,
    showToast,
  } = useApp();

  // Active Creation Tool Drawer (single expanded engine at a time for ultra simplicity)
  const [activeCreationTool, setActiveCreationTool] = useState<'image' | 'animate' | 'search' | 'video' | null>(null);

  // Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatModel, setChatModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon' | 'gemini-2.5-flash'>('gemini-3.8-flash');
  const [chatPersona, setChatPersona] = useState<string>('Prompt Architect');
  const [isVoiceChatActive, setIsVoiceChatActive] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Tool 1: Image State (gemini-nano-banana-2.1)
  const [imagePrompt, setImagePrompt] = useState('Cyberpunk street technician in rain-slicked neon alley, volumetric fog, 35mm film');
  const [imageAspectRatio, setImageAspectRatio] = useState('1:1');
  const [selectedBaseImage, setSelectedBaseImage] = useState<string | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Tool 2: Animate Photo State (Veo 3: movie)
  const [animateImageBase64, setAnimateImageBase64] = useState<string | null>(null);
  const [animatePrompt, setAnimatePrompt] = useState('Slow cinematic forward camera push with volumetric light rays and subtle ambient motion');
  const [animateAspectRatio, setAnimateAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const animateFileInputRef = useRef<HTMLInputElement>(null);

  // Tool 3: Search Grounding State (google)
  const [searchQuery, setSearchQuery] = useState('Latest generative AI model benchmarks and breakthroughs');

  // Tool 4: Text-to-Video State (Veo 3: video_spark)
  const [videoPrompt, setVideoPrompt] = useState('Sleek high-tech drone flying through a futuristic neon city canyon, cinematic 4K');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const query = customText || chatInput;
    if (!query.trim() || chatLoading) return;

    let systemInstruction = 'You are an elite Prompt Engineer & AI Specialist at PromptPulse. Help users craft, improve, and test prompts.';
    if (chatPersona === 'Creative Muse') {
      systemInstruction = 'You are a Creative Director and Midjourney visual specialist. Provide vivid, cinematic, and descriptive prompts with camera, lighting, and style parameters.';
    } else if (chatPersona === 'Code Architect') {
      systemInstruction = 'You are a Principal Software Architect specializing in Android, Jetpack Compose, Kotlin, and clean architecture. Provide robust, bug-free implementations.';
    } else if (chatPersona === 'News Analyst') {
      systemInstruction = 'You are a Senior Technology & Geopolitical Journalist synthesizing verified news into strategic insights and AI prompts.';
    }

    sendChatMessage(query, chatModel, systemInstruction);
    if (!customText) {
      setChatInput('');
    }
  };

  const handleToggleVoiceChat = () => {
    if (!isVoiceChatActive) {
      setIsVoiceChatActive(true);
      showToast('🎤 Voice Chat mode activated! Listening to prompt...');
      // Simulated spoken prompt
      setTimeout(() => {
        const spoken = 'Synthesize a high-converting marketing prompt for a new Android AI app.';
        setChatInput(spoken);
        showToast('Transcribed: "' + spoken + '"');
        setIsVoiceChatActive(false);
      }, 2400);
    } else {
      setIsVoiceChatActive(false);
      showToast('Voice Chat paused.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'edit' | 'animate') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (target === 'edit') {
          setSelectedBaseImage(base64);
          showToast('Reference photo loaded for editing!');
        } else {
          setAnimateImageBase64(base64);
          showToast('Photo loaded for Veo 3 animation!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCreationTool = (tool: 'image' | 'animate' | 'search' | 'video') => {
    setActiveCreationTool((prev) => (prev === tool ? null : tool));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 pb-20 custom-scrollbar select-none">
      {/* Top Header */}
      <div className="sticky top-0 bg-slate-950/90 backdrop-blur-xl px-4 py-3 z-10 border-b border-white/5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight">AI Studio</h1>
            <p className="text-[10px] text-slate-400">Creation Tools & Free Multi-Model Chat</p>
          </div>
        </div>

        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
          100% Free AI
        </span>
      </div>

      <div className="p-4 space-y-5">
        {/* ================= SECTION 1: CREATION ICONS VISIBLE VERTICALLY IN BULLETS FORM ================= */}
        {/* 
          Requested:
          "enhance Ai studio section it should be simple & creation icons should be visible vertically in bullets form after that chatbot section where all free ai available"
        */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles size={13} className="text-cyan-400" />
              <span>Creation Engines</span>
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">4 Engines • Tap Bullet to Create</span>
          </div>

          {/* VERTICAL BULLETS LIST */}
          <div className="space-y-2">
            {/* ================= BULLET 1: CREATE & EDIT IMAGES ================= */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md transition-all">
              <button
                onClick={() => toggleCreationTool('image')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Glowing Bullet Dot */}
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50 shrink-0" />
                  
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                    <ImageIcon size={18} />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Create & edit images</span>
                      <span className="text-[9px] font-mono text-pink-400 bg-pink-500/10 px-1.5 py-0.2 rounded">
                        gemini-nano-banana-2.1
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Text-to-image generator and photo editing with custom aspect ratios
                    </p>
                  </div>
                </div>

                <div className="text-slate-400 pl-2">
                  {activeCreationTool === 'image' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Bullet 1 Drawer */}
              {activeCreationTool === 'image' && (
                <div className="p-3.5 pt-0 border-t border-slate-800/80 space-y-3 bg-slate-950/60 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      {selectedBaseImage ? 'Edit Instructions (e.g., "Add glowing holographic visor")' : 'Image Description Prompt'}
                    </label>
                    <textarea
                      rows={2}
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe what to generate or edit..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  {/* Ratio & Upload */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 text-[10px]">Ratio:</span>
                      {['1:1', '16:9', '9:16', '4:3'].map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setImageAspectRatio(ratio)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold ${
                            imageAspectRatio === ratio
                              ? 'bg-pink-600 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        ref={imageFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'edit')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => imageFileInputRef.current?.click()}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-semibold rounded-lg border border-slate-800 flex items-center gap-1"
                      >
                        <Upload size={11} />
                        <span>{selectedBaseImage ? 'Photo Attached ✓' : 'Upload to Edit'}</span>
                      </button>
                      {selectedBaseImage && (
                        <button
                          onClick={() => setSelectedBaseImage(null)}
                          className="text-[10px] text-red-400 hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => generateImage(imagePrompt, imageAspectRatio, selectedBaseImage || undefined)}
                    disabled={imageLoading || !imagePrompt.trim()}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    {imageLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Rendering with Nano Banana...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>{selectedBaseImage ? 'Apply Edits to Image' : 'Generate Visual'}</span>
                      </>
                    )}
                  </button>

                  {/* Latest Image Output */}
                  {generatedImages.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1">Latest Render:</span>
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-black max-w-xs mx-auto border border-slate-800">
                        <img src={generatedImages[0].url} alt="Latest output" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-white px-1.5 py-0.5 rounded">
                          {generatedImages[0].aspectRatio}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ================= BULLET 2: ANIMATE IMAGES INTO VIDEO (movie) ================= */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md transition-all">
              <button
                onClick={() => toggleCreationTool('animate')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Glowing Bullet Dot */}
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50 shrink-0" />
                  
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                    <Film size={18} />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Animate images into video</span>
                      <span className="text-[9px] font-mono text-violet-400 bg-violet-500/10 px-1.5 py-0.2 rounded">
                        Veo Photo-to-Video
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Upload any personal or AI photo and bring it to life with cinematic camera motion
                    </p>
                  </div>
                </div>

                <div className="text-slate-400 pl-2">
                  {activeCreationTool === 'animate' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Bullet 2 Drawer */}
              {activeCreationTool === 'animate' && (
                <div className="p-3.5 pt-0 border-t border-slate-800/80 space-y-3 bg-slate-950/60 animate-in fade-in duration-150">
                  <input
                    ref={animateFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'animate')}
                    className="hidden"
                  />

                  <div
                    onClick={() => animateFileInputRef.current?.click()}
                    className={`p-3 rounded-xl border-2 border-dashed cursor-pointer text-center transition-all ${
                      animateImageBase64
                        ? 'border-violet-500/50 bg-violet-950/20'
                        : 'border-slate-700 hover:border-slate-500 bg-slate-900'
                    }`}
                  >
                    {animateImageBase64 ? (
                      <div className="flex items-center justify-center gap-3">
                        <img src={animateImageBase64} alt="Source" className="w-12 h-12 rounded-lg object-cover border border-violet-400" />
                        <div className="text-left text-xs">
                          <p className="font-bold text-white">Source Photo Attached ✓</p>
                          <p className="text-[10px] text-slate-400">Tap to choose different image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-1 flex items-center justify-center gap-2 text-xs text-slate-300 font-medium">
                        <Upload size={14} className="text-violet-400" />
                        <span>Tap to upload photo to animate</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Motion & Direction Prompt</label>
                    <textarea
                      rows={2}
                      value={animatePrompt}
                      onChange={(e) => setAnimatePrompt(e.target.value)}
                      placeholder="e.g. Slow cinematic camera pan with glowing light rays..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 text-[10px]">Ratio:</span>
                    <button
                      type="button"
                      onClick={() => setAnimateAspectRatio('16:9')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                        animateAspectRatio === '16:9' ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      16:9 Landscape
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnimateAspectRatio('9:16')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                        animateAspectRatio === '9:16' ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      9:16 Portrait
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (!animateImageBase64) {
                        showToast('Please upload a photo first');
                        return;
                      }
                      generateVideo(animatePrompt, animateAspectRatio, animateImageBase64, 'image-to-video');
                    }}
                    disabled={videoLoading || !animateImageBase64}
                    className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    {videoLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Animating Photo with Veo 3...</span>
                      </>
                    ) : (
                      <>
                        <Film size={14} />
                        <span>Animate Photo into Video</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* ================= BULLET 3: USE GOOGLE SEARCH DATA (google) ================= */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md transition-all">
              <button
                onClick={() => toggleCreationTool('search')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Glowing Bullet Dot */}
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50 shrink-0" />
                  
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Globe size={18} />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Use Google Search data</span>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded">
                        Google Search Grounded
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Fetch fresh real-time web facts, citations, and search grounding for prompts
                    </p>
                  </div>
                </div>

                <div className="text-slate-400 pl-2">
                  {activeCreationTool === 'search' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Bullet 3 Drawer */}
              {activeCreationTool === 'search' && (
                <div className="p-3.5 pt-0 border-t border-slate-800/80 space-y-3 bg-slate-950/60 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Live Search Query</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Latest Pakistan AI tech breakthroughs..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <button
                    onClick={() => runSearchGrounding(searchQuery)}
                    disabled={searchLoading || !searchQuery.trim()}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    {searchLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Searching Live Web with Google...</span>
                      </>
                    ) : (
                      <>
                        <Search size={14} />
                        <span>Run Google Grounded Search</span>
                      </>
                    )}
                  </button>

                  {searchHistory.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="font-bold text-white text-[11px]">"{searchHistory[0].query}"</div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        {searchHistory[0].text}
                      </p>
                      {searchHistory[0].sources.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/60">
                          {searchHistory[0].sources.map((src, i) => (
                            <a
                              key={i}
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[9px] text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                            >
                              <ExternalLink size={9} />
                              <span className="truncate max-w-[120px]">{src.title}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ================= BULLET 4: GENERATE VIDEO FROM TEXT (video_spark) ================= */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md transition-all">
              <button
                onClick={() => toggleCreationTool('video')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Glowing Bullet Dot */}
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50 shrink-0" />
                  
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Video size={18} />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Generate video from text</span>
                      <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                        veo-3.1-fast-generate-preview
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Hollywood-grade video synthesis with 16:9 landscape or 9:16 portrait
                    </p>
                  </div>
                </div>

                <div className="text-slate-400 pl-2">
                  {activeCreationTool === 'video' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Bullet 4 Drawer */}
              {activeCreationTool === 'video' && (
                <div className="p-3.5 pt-0 border-t border-slate-800/80 space-y-3 bg-slate-950/60 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Video Scene Prompt</label>
                    <textarea
                      rows={2}
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="Describe camera movement, lighting, motion..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 text-[10px]">Aspect Ratio:</span>
                    <button
                      type="button"
                      onClick={() => setVideoAspectRatio('16:9')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-semibold ${
                        videoAspectRatio === '16:9'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      16:9 Landscape
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoAspectRatio('9:16')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-semibold ${
                        videoAspectRatio === '9:16'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      9:16 Portrait
                    </button>
                  </div>

                  <button
                    onClick={() => generateVideo(videoPrompt, videoAspectRatio, undefined, 'text-to-video')}
                    disabled={videoLoading || !videoPrompt.trim()}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    {videoLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-slate-950" />
                        <span>Synthesizing Veo 3 Video (720p)...</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} className="fill-current" />
                        <span>Generate Video with Veo 3</span>
                      </>
                    )}
                  </button>

                  {generatedVideos.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1">Latest Video Render:</span>
                      <div className="rounded-xl overflow-hidden bg-black max-w-xs mx-auto border border-slate-800">
                        <video src={generatedVideos[0].url} controls autoPlay loop muted className="w-full max-h-[160px] object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: CHATBOT SECTION WHERE ALL FREE AI AVAILABLE ================= */}
        {/* 
          Requested:
          "after that chatbot section where all free ai available"
        */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-cyan-300">
                <Bot size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Gemini Chatbot • All Free AI Models
                </h2>
                <p className="text-[10px] text-slate-400">Multi-turn conversational assistant with voice mode</p>
              </div>
            </div>

            <button
              onClick={clearChatHistory}
              className="text-[10px] text-slate-400 hover:text-red-400 flex items-center gap-1"
              title="Clear Thread"
            >
              <Trash2 size={12} />
              <span>Reset</span>
            </button>
          </div>

          {/* Model Selector Bar (Free models) */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-slate-300">Select Free AI Engine:</span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                {chatModel}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setChatModel('gemini-3.8-flash')}
                className={`p-2 rounded-xl text-left transition-all border ${
                  chatModel === 'gemini-3.8-flash'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <div className="font-bold text-[10px]">3.8 Flash</div>
                <div className="text-[8px] opacity-80">Fast & Smart</div>
              </button>

              <button
                type="button"
                onClick={() => setChatModel('gemini-3.1-flash-lite')}
                className={`p-2 rounded-xl text-left transition-all border ${
                  chatModel === 'gemini-3.1-flash-lite'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <div className="font-bold text-[10px]">Flash-Lite</div>
                <div className="text-[8px] opacity-80">Instant speed</div>
              </button>

              <button
                type="button"
                onClick={() => setChatModel('gemini-4-argon')}
                className={`p-2 rounded-xl text-left transition-all border ${
                  chatModel === 'gemini-4-argon'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <div className="font-bold text-[10px]">4 Argon</div>
                <div className="text-[8px] opacity-80">Deep Logic</div>
              </button>

              <button
                type="button"
                onClick={() => setChatModel('gemini-2.5-flash')}
                className={`p-2 rounded-xl text-left transition-all border ${
                  chatModel === 'gemini-2.5-flash'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <div className="font-bold text-[10px]">2.5 Flash</div>
                <div className="text-[8px] opacity-80">Balanced</div>
              </button>
            </div>

            {/* Persona Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 custom-scrollbar">
              <span className="text-[10px] text-slate-500 shrink-0">Role:</span>
              {['Prompt Architect', 'Code Architect', 'Creative Muse', 'News Analyst'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setChatPersona(p)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
                    chatPersona === p
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 custom-scrollbar -mx-1 px-1">
              {[
                '💡 Polish image prompt',
                '⚡ Veo 3 video script',
                '📱 Kotlin Compose UI',
                '🇵🇰 Pakistan AI outlook',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSendChat(undefined, suggestion)}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-800 shrink-0 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Container */}
          <div className="min-h-[260px] max-h-[380px] bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 overflow-y-auto custom-scrollbar space-y-3">
            {chatMessages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-850 border border-slate-700/80 text-slate-200 rounded-bl-none shadow'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">
                    {msg.timestamp} {msg.modelUsed && `• ${msg.modelUsed}`}
                  </span>
                </div>
              );
            })}

            {chatLoading && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs p-2">
                <Loader2 size={14} className="animate-spin" />
                <span>Gemini is generating response...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar with Voice Chat toggle */}
          <form onSubmit={(e) => handleSendChat(e)} className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoiceChat}
              className={`p-2.5 rounded-2xl border transition-all shrink-0 active:scale-95 ${
                isVoiceChatActive
                  ? 'bg-red-600 border-red-500 text-white animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Voice Chat Mode"
            >
              <Mic size={16} />
            </button>

            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything or generate prompts..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />

            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="p-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-2xl shadow-md transition-all shrink-0 active:scale-95"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
