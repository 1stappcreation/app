import React, { useState, useEffect } from 'react';
import {
  Menu,
  Sparkles,
  User as UserIcon,
  Copy,
  Bookmark,
  Share2,
  Check,
  CheckCircle2,
  MapPin,
  Clock,
  Compass,
  Play,
  Tv,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FAMOUS_NEWS_CHANNELS } from '../../data/mockData';
import { NewsChannel } from '../../types';

export const HomeScreen: React.FC = () => {
  const {
    dailyPrompt,
    dailyCountdown,
    copyPromptToClipboard,
    openPromptDetail,
    toggleBookmark,
    toggleBookmarkNews,
    user,
    newsArticles,
    openNewsArticle,
    currentLocation,
    setCurrentLocationCity,
    locationUpdates,
    discoverStories,
    openStory,
    setIsDrawerOpen,
    setIsProfileModalOpen,
    setCurrentScreen,
    showToast,
  } = useApp();

  const [copied, setCopied] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<NewsChannel>(FAMOUS_NEWS_CHANNELS[0]);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState<boolean>(false);

  // Sync selected news channel with current location
  useEffect(() => {
    const match = FAMOUS_NEWS_CHANNELS.find(
      (ch) => ch.id === currentLocation.featuredChannelId || ch.city.toLowerCase() === currentLocation.city.toLowerCase()
    );
    if (match) {
      setSelectedChannel(match);
    }
  }, [currentLocation]);

  // Filter channels based on country/city
  const locationChannels = FAMOUS_NEWS_CHANNELS.filter(
    (c) => c.country === currentLocation.country || c.country === 'Global' || currentLocation.country === 'Pakistan'
  );

  const handleCopyPrompt = async () => {
    if (!dailyPrompt) return;
    const success = await copyPromptToClipboard(dailyPrompt);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSharePrompt = () => {
    if (!dailyPrompt) return;
    if (navigator.share) {
      navigator.share({
        title: dailyPrompt.title,
        text: `PromptPulse Daily: ${dailyPrompt.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('Share link copied to clipboard!');
    }
  };

  const isDailySaved = dailyPrompt ? user.savedPromptIds.includes(dailyPrompt.id) : false;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 pb-20 custom-scrollbar select-none">
      {/* ================= TOP BAR ================= */}
      <div className="sticky top-0 bg-slate-950/85 backdrop-blur-2xl px-4 py-3 z-20 border-b border-white/5 flex items-center justify-between shadow-sm">
        {/* Left: Hamburger Menu */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all"
          title="Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Center: App Logo and Name */}
        <div
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles size={16} className="text-cyan-300" />
            </div>
          </div>
          <span className="text-base font-black tracking-tight text-white font-sans">
            Prompt<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Pulse</span>
          </span>
        </div>

        {/* Right: User Profile Icon */}
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="relative p-1 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 active:scale-95 transition-all"
          title="Profile & Location Settings"
        >
          <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-xl object-cover" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* ================= SECTION 1: FEATURED DAILY PROMPT CARD ================= */}
        {dailyPrompt && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-500" />

            <div className="relative rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-5 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold tracking-wider uppercase">
                  <Sparkles size={13} className="text-amber-300" />
                  <span>Featured Daily Prompt</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-950/70 border border-white/5 px-2.5 py-1 rounded-full">
                  <Clock size={12} className="text-amber-400" />
                  <span>{dailyCountdown}</span>
                </div>
              </div>

              <h2
                onClick={() => openPromptDetail(dailyPrompt)}
                className="text-lg font-extrabold text-white hover:text-cyan-300 transition-colors cursor-pointer leading-snug line-clamp-2"
              >
                {dailyPrompt.title}
              </h2>

              <p className="text-xs text-slate-300/90 mt-2 leading-relaxed line-clamp-3">
                {dailyPrompt.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                <span className="text-[10px] font-mono font-semibold bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-lg border border-slate-700">
                  {dailyPrompt.modelTarget}
                </span>
                <span className="text-[10px] font-medium bg-white/5 text-slate-300 px-2 py-0.5 rounded-lg">
                  {dailyPrompt.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {dailyPrompt.copyCount.toLocaleString()} uses
                </span>
              </div>

              {/* Required Buttons: Copy, Save, Share */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPrompt}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                    }`}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(dailyPrompt.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                      isDailySaved
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
                        : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    <Bookmark size={14} className={isDailySaved ? 'fill-current' : ''} />
                    <span>{isDailySaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={handleSharePrompt}
                    className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95"
                    title="Share Daily Prompt"
                  >
                    <Share2 size={15} />
                  </button>
                </div>

                <button
                  onClick={() => openPromptDetail(dailyPrompt)}
                  className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-white bg-cyan-950/40 border border-cyan-500/30 px-3 py-2 rounded-xl transition-all"
                >
                  <Play size={12} className="fill-current" />
                  <span>Test Run</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= LOCATION-BASED UPDATES ================= */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-3.5 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <MapPin size={14} />
              <span>Location Pulse:</span>
              <button
                onClick={() => setIsCitySelectorOpen(!isCitySelectorOpen)}
                className="text-white hover:text-cyan-300 underline font-semibold flex items-center gap-0.5"
              >
                <span>{currentLocation.city}, {currentLocation.country}</span>
                <span className="text-[10px]">▼</span>
              </button>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
              {currentLocation.temperature} • {currentLocation.weatherCondition}
            </span>
          </div>

          {isCitySelectorOpen && (
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-1.5 text-xs animate-in fade-in duration-150">
              {locationUpdates.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setCurrentLocationCity(loc.city);
                    setIsCitySelectorOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-medium transition-all ${
                    currentLocation.city === loc.city
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {loc.city} ({loc.country})
                </button>
              ))}
            </div>
          )}

          <div className="text-xs">
            <h4 className="font-bold text-white">{currentLocation.pulseHeadline}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              {currentLocation.pulseDescription}
            </p>
          </div>
        </div>

        {/* ================= SECTION 2: VERIFIED NEWS FEED & EMBEDDED NEWS CHANNELS ================= */}
        {/* 
          Requested:
          "small changes in news section here we add embed famous news channels of Pakistan or location wise where user actually lives"
        */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tv size={16} className="text-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Live News & Tech Radar</h3>
            </div>
            <button
              onClick={() => setCurrentScreen('news')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Full Radar →
            </button>
          </div>

          {/* Embedded Famous News Channel Player of Pakistan / Location */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl space-y-3 p-3.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: selectedChannel.color }}
                />
                <span className="font-bold text-white text-xs">{selectedChannel.name}</span>
                <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded font-black tracking-wider uppercase">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                {currentLocation.country} Broadcast ({selectedChannel.city})
              </span>
            </div>

            {/* Embedded Video Iframe Player */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner border border-slate-800">
              <iframe
                title={selectedChannel.name}
                src={`https://www.youtube-nocookie.com/embed/${selectedChannel.embedVideoId}?autoplay=0&rel=0&modestbranding=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Vertical Bullets List for Famous Channels (Matching AI Studio Style) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Radio size={11} className="text-red-400" />
                  <span>Live Channels (Tap Bullet to Stream):</span>
                </span>
                <span className="font-mono text-slate-500">{FAMOUS_NEWS_CHANNELS.length} Broadcasters</span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5 custom-scrollbar">
                {FAMOUS_NEWS_CHANNELS.map((ch) => {
                  const isSelected = selectedChannel.id === ch.id;
                  return (
                    <div
                      key={ch.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isSelected
                          ? 'bg-slate-900 border-red-500/60 shadow-md shadow-red-600/15 ring-1 ring-red-500/30'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <button
                        onClick={() => {
                          setSelectedChannel(ch);
                          showToast(`Switched stream to ${ch.name}`);
                        }}
                        className="w-full p-2.5 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {/* Glowing Bullet Dot */}
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${
                              isSelected ? 'animate-ping' : ''
                            }`}
                            style={{ backgroundColor: ch.color || '#E53E3E' }}
                          />

                          {/* Broadcaster Logo Badge */}
                          <div
                            className="w-8 h-8 rounded-xl border flex items-center justify-center font-black text-[9px] shrink-0"
                            style={{
                              backgroundColor: `${ch.color || '#E53E3E'}18`,
                              borderColor: `${ch.color || '#E53E3E'}40`,
                              color: ch.color || '#E53E3E',
                            }}
                          >
                            {ch.logoText || 'TV'}
                          </div>

                          {/* Meta */}
                          <div className="min-w-0 flex-1 pr-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h5 className="text-[11px] font-bold text-white truncate">{ch.name}</h5>
                              <span className="text-[7px] bg-red-600 text-white px-1 py-0.2 rounded font-black tracking-wider uppercase">
                                LIVE
                              </span>
                              {isSelected && (
                                <span className="text-[7px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1 py-0.2 rounded font-bold">
                                  PLAYING
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5 truncate">
                              {ch.city}, {ch.country} • {ch.category}
                            </p>
                          </div>
                        </div>

                        {/* Action Pill */}
                        <div className="pl-1 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all ${
                              isSelected
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            <Play size={9} className={isSelected ? 'fill-current' : ''} />
                            <span>{isSelected ? 'Live' : 'Watch'}</span>
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Ticker */}
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-2">
              <span className="font-bold text-red-400 shrink-0 uppercase tracking-wider">Headline:</span>
              <span className="truncate">{selectedChannel.headline}</span>
            </div>
          </div>

          {/* Verified News Articles List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Journalism ({currentLocation.country} & Global)
            </h4>

            {newsArticles.slice(0, 3).map((article) => {
              const isSaved = user.savedNewsIds.includes(article.id);

              return (
                <div
                  key={article.id}
                  onClick={() => openNewsArticle(article)}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-3.5 transition-all cursor-pointer shadow-lg hover:bg-slate-900 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                      <img
                        src={article.thumbnailUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <div className="flex items-center gap-1 font-semibold text-slate-300">
                          <span>{article.source.name}</span>
                          {article.source.isVerified && (
                            <CheckCircle2 size={11} className="text-cyan-400 fill-cyan-400/20" />
                          )}
                        </div>
                        <span>{article.publishedAt}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="bg-slate-950 px-2 py-0.5 rounded text-slate-400">
                      {article.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmarkNews(article.id);
                        }}
                        className={`p-1 rounded-lg ${
                          isSaved ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Bookmark size={13} className={isSaved ? 'fill-current' : ''} />
                      </button>
                      <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                        Read Story →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
