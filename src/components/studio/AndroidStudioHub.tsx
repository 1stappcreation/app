import React, { useState } from 'react';
import {
  FileCode,
  FolderTree,
  Database,
  Flame,
  Layout,
  Cpu,
  Layers,
  Copy,
  Check,
  Download,
  ExternalLink,
  Code2,
  DollarSign,
  Terminal,
  BookOpen,
} from 'lucide-react';
import { KOTLIN_PROJECT_FILES, KotlinFileItem } from '../../data/kotlinCodeData';
import { useApp } from '../../context/AppContext';

export const AndroidStudioHub: React.FC = () => {
  const { showToast } = useApp();
  const [selectedFileId, setSelectedFileId] = useState<string>(KOTLIN_PROJECT_FILES[0].id);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedFile =
    KOTLIN_PROJECT_FILES.find((f) => f.id === selectedFileId) || KOTLIN_PROJECT_FILES[0];

  const categories = [
    { id: 'all', label: 'All Project Files', icon: Layers },
    { id: 'architecture', label: '1. Architecture & Tree', icon: FolderTree },
    { id: 'database', label: '2. Room DB Design', icon: Database },
    { id: 'firebase', label: '3. Firebase & Rules', icon: Flame },
    { id: 'ui', label: '4. Compose Screens', icon: Layout },
    { id: 'api', label: '5. AI Studio (Gemini & Veo)', icon: Code2 },
  ];

  const filteredFiles =
    activeCategoryFilter === 'all'
      ? KOTLIN_PROJECT_FILES
      : KOTLIN_PROJECT_FILES.filter((f) => f.category === activeCategoryFilter);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.code);
      setCopied(true);
      showToast(`Copied ${selectedFile.name} to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy to clipboard');
    }
  };

  const handleDownloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded ${selectedFile.name}`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden select-text">
      {/* Top Header of Android Studio */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Terminal size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">Android Studio Kotlin Hub</h2>
              <span className="text-[10px] font-mono bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                Kotlin 2.0 • Jetpack Compose
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Complete source code, Room Database schemas, Firebase rules, and MVVM architecture.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all shadow-sm"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy File'}</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm shadow-indigo-600/30"
          >
            <Download size={14} />
            <span>Download .kt</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
        {categories.map((cat) => {
          const isSelected = activeCategoryFilter === cat.id;
          const IconComp = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <IconComp size={13} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main IDE Workspace: Left Sidebar File Tree + Right Code View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: File List */}
        <div className="w-full md:w-72 bg-slate-950 md:border-r border-b md:border-b-0 border-slate-800/80 overflow-y-auto custom-scrollbar p-3 space-y-1 shrink-0 max-h-48 md:max-h-full">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Project Files ({filteredFiles.length})</span>
            <span className="text-[10px] text-slate-500 font-mono">com.promptverse.app</span>
          </div>

          {filteredFiles.map((file) => {
            const isSelected = file.id === selectedFile.id;

            return (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-start gap-2.5 text-xs ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode size={16} className={`shrink-0 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-white font-medium">{file.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{file.path}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Code Display Area */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* File Tab Bar */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-semibold">{selectedFile.name}</span>
              <span className="text-[10px] font-mono text-slate-500">({selectedFile.path})</span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              {selectedFile.language.toUpperCase()}
            </span>
          </div>

          {/* Description banner */}
          <div className="px-4 py-2 bg-indigo-950/20 border-b border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2">
            <BookOpen size={14} className="shrink-0 text-amber-400" />
            <span>{selectedFile.description}</span>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#0B0F19] font-mono text-xs leading-relaxed text-slate-200">
            <pre className="select-text whitespace-pre">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
