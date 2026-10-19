import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  CheckCircle2,
  Bookmark,
  Search,
  Tv,
  Radio,
  ExternalLink,
  MapPin,
  Flame,
  Volume2,
  VolumeX,
  Maximize2,
  Share2,
  ChevronDown,
  RefreshCw,
  Globe,
  Play,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FAMOUS_NEWS_CHANNELS } from '../../data/mockData';
import { NewsChannel } from '../../types';

export const NewsScreen: React.FC = () => {
  const {
    newsArticles,
    openNewsArticle,
    toggleBookmarkNews,
    user,
    currentLocation,
    setCurrentLocationCity,
    locationUpdates,
    showToast,
  } = useApp();

  const [selectedChannel, setSelectedChannel] = useState<NewsChannel>(FAMOUS_NEWS_CHANNELS[0]);
  const [channelTab, setChannelTab] = useState<'pakistan' | 'local' | 'all'>('pakistan');
  const [newsFilter, setNewsFilter] = useState('All');
  const [newsQuery, setNewsQuery] = useState('');
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);

  // Sync default channel with user's selected location city
  useEffect(() => {
    const match = FAMOUS_NEWS_CHANNELS.find(
      (ch) => ch.id === currentLocation.featuredChannelId || ch.city.toLowerCase() === currentLocation.city.toLowerCase()
    );
    if (match) {
      setSelectedChannel(match);
    }
  }, [currentLocation]);

  const categories = [
    'All',
    'Pakistan Tech & Economy',
    'AI & Machine Learning',
    'Robotics',
    'Cybersecurity',
  ];

  // Filter channels according to tab and location
  const displayedChannels = FAMOUS_NEWS_CHANNELS.filter((ch) => {
    if (channelTab === 'pakistan') return ch.country === 'Pakistan';
    if (channelTab === 'local') {
      return (
        ch.city.toLowerCase() === currentLocation.city.toLowerCase() ||
        ch.country.toLowerCase() === currentLocation.country.toLowerCase()
      );
    }
    return true;
  });

  const filteredArticles = newsArticles.filter((article) => {
    const matchesCat = newsFilter === 'All' || article.category === newsFilter;
    const matchesQuery =
      newsQuery.trim() === '' ||
      article.title.toLowerCase().includes(newsQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(newsQuery.toLowerCase()) ||
      article.source.name.toLowerCase().includes(newsQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleShareChannel = (ch: NewsChannel) => {
    if (navigator.share) {
      navigator.share({
        title: `${ch.name} Live Broadcast`,
        text: `Watch ${ch.name} Live Stream on PromptPulse News Radar: ${ch.headline}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast(`${ch.name} live stream link copied!`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 pb-20 custom-scrollbar select-none">
      {/* Top Sticky Header */}
      <div className="sticky top-0 bg-slate-950/90 backdrop-blur-xl px-4 py-3 z-20 border-b border-white/5 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
            <Newspaper size={18} className="text-cyan-400" />
            <span>Verified News Radar</span>
          </h1>
          <p className="text-[10px] text-slate-400">Famous Pakistan & Location-Wise Broadcasts</p>
        </div>

        {/* Location Selector Pill */}
        <button
          onClick={() => setIsCitySelectorOpen(!isCitySelectorOpen)}
          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold hover:bg-emerald-500/25 active:scale-95 transition-all shadow-sm"
        >
          <MapPin size={11} className="text-emerald-400" />
          <span>{currentLocation.city}, {currentLocation.country}</span>
          <ChevronDown size={11} className={`transition-transform ${isCitySelectorOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Location Dropdown Modal */}
      {isCitySelectorOpen && (
        <div className="p-4 mx-4 mt-2 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150 z-30">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
            <span className="font-bold text-white flex items-center gap-1.5">
              <MapPin size={13} className="text-emerald-400" />
              <span>Select Your City / Location:</span>
            </span>
            <span className="text-[10px] text-slate-400">Syncs news & live stream</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar p-0.5">
            {locationUpdates.map((loc) => {
              const isSelected = currentLocation.city === loc.city;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setCurrentLocationCity(loc.city);
                    setIsCitySelectorOpen(false);
                    showToast(`Location set to ${loc.city}, ${loc.country}`);
                  }}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span className="truncate">{loc.city}</span>
                  <span className="text-[9px] opacity-75 font-mono">{loc.temperature}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* ================= EMBEDDED FAMOUS NEWS CHANNELS OF PAKISTAN & LOCATION ================= */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-4 space-y-3.5">
          {/* Broadcaster Header */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping shrink-0"
                style={{ backgroundColor: selectedChannel.color || '#E53E3E' }}
              />
              <span className="font-extrabold text-white text-sm">{selectedChannel.name}</span>
              <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black tracking-wider uppercase animate-pulse">
                LIVE STREAM
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-medium">
                {selectedChannel.city}, {selectedChannel.country}
              </span>
              <button
                onClick={() => handleShareChannel(selectedChannel)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Share stream"
              >
                <Share2 size={13} />
              </button>
            </div>
          </div>

          {/* Embedded YouTube / Web Live Player */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-800">
            {isAudioOnly ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 p-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-2 animate-pulse">
                  <Radio size={24} />
                </div>
                <h4 className="text-sm font-bold text-white">{selectedChannel.name} Audio Stream</h4>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs">{selectedChannel.headline}</p>
                <button
                  onClick={() => setIsAudioOnly(false)}
                  className="mt-3 px-3 py-1.5 bg-indigo-600 text-white text-[11px] font-bold rounded-xl"
                >
                  Switch to Video Player
                </button>
              </div>
            ) : (
              <iframe
                title={selectedChannel.name}
                src={`https://www.youtube-nocookie.com/embed/${selectedChannel.embedVideoId}?autoplay=0&rel=0&modestbranding=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* Viewer Count & Stream Badge */}
            <div className="absolute top-2.5 left-2.5 pointer-events-none flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-white border border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LIVE • 218K watching</span>
            </div>
          </div>

          {/* Channel Filter & Vertical Bullets List */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setChannelTab('pakistan')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    channelTab === 'pakistan'
                      ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🇵🇰 Famous Pakistan
                </button>
                <button
                  onClick={() => setChannelTab('local')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    channelTab === 'local'
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📍 My City ({currentLocation.city})
                </button>
                <button
                  onClick={() => setChannelTab('all')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    channelTab === 'all'
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🌐 Global
                </button>
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                {displayedChannels.length} Channels • Tap Bullet to Watch
              </span>
            </div>

            {/* Vertical Bullets List (Matching AI Studio Bullets Style) */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-0.5 custom-scrollbar">
              {displayedChannels.map((ch) => {
                const isSelected = selectedChannel.id === ch.id;
                return (
                  <div
                    key={ch.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-red-500/60 shadow-lg shadow-red-600/15 ring-1 ring-red-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setSelectedChannel(ch);
                        showToast(`Switched stream to ${ch.name}`);
                      }}
                      className="w-full p-3 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Glowing Bullet Dot */}
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${
                            isSelected ? 'animate-ping' : ''
                          }`}
                          style={{ backgroundColor: ch.color || '#E53E3E' }}
                        />

                        {/* Broadcaster Squircle Logo */}
                        <div
                          className="w-9 h-9 rounded-xl border flex items-center justify-center font-black text-[10px] shrink-0"
                          style={{
                            backgroundColor: `${ch.color || '#E53E3E'}18`,
                            borderColor: `${ch.color || '#E53E3E'}40`,
                            color: ch.color || '#E53E3E',
                          }}
                        >
                          {ch.logoText || 'TV'}
                        </div>

                        {/* Channel Details */}
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-white truncate">{ch.name}</h4>
                            <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.2 rounded font-black tracking-wider uppercase">
                              LIVE
                            </span>
                            {isSelected && (
                              <span className="text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                                PLAYING NOW
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {ch.city}, {ch.country} • {ch.language} • {ch.category}
                          </p>
                          <p className="text-[10px] text-slate-300 mt-1 line-clamp-1 italic font-sans opacity-85">
                            "{ch.headline}"
                          </p>
                        </div>
                      </div>

                      {/* Action Pill */}
                      <div className="pl-2 shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          <Play size={10} className={isSelected ? 'fill-current' : ''} />
                          <span>{isSelected ? 'Live' : 'Watch'}</span>
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breaking News Ticker for Selected Broadcaster */}
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2.5 shadow-inner">
            <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[9px] font-black uppercase tracking-wider shrink-0">
              Ticker
            </span>
            <span className="truncate font-medium text-slate-200">
              {selectedChannel.headline}
            </span>
          </div>
        </div>

        {/* ================= SEARCH & VERIFIED ARTICLES FEED ================= */}
        {/* Search Input */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={newsQuery}
            onChange={(e) => setNewsQuery(e.target.value)}
            placeholder="Search Pakistan & global tech journalism..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setNewsFilter(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                newsFilter === cat
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Verified Articles List */}
        <div className="space-y-3">
          {filteredArticles.map((article) => {
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
                    {article.category} • {article.readTimeMinutes} min read
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
  );
};
