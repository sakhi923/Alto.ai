import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Download, 
  Database, 
  Layers, 
  Code2, 
  Eye, 
  Bot, 
  ChevronDown,
  Sidebar,
  LayoutGrid,
  Info,
  ShieldCheck
} from 'lucide-react';
import { UserData, DatabaseStatus, ViewMode } from '../types';
import { TEMPLATES } from '../data/initialFiles';
import { AltoLogoMark, AltoFeaturesBar } from './AltoLogo';
import { AltoInfoModal } from './AltoInfoModal';

interface HeaderProps {
  user: UserData | null;
  databaseStatus: DatabaseStatus | null;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenDatabaseModal: () => void;
  onOpenToolsModal?: () => void;
  onExportZip: () => void;
  onRunPreview: () => void;
  isSaving: boolean;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isAiDrawerOpen: boolean;
  onToggleAiDrawer: () => void;
  onSelectTemplate: (id: string) => void;
  isCodeProtected?: boolean;
  onToggleCodeProtection?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  databaseStatus,
  viewMode,
  setViewMode,
  onOpenDatabaseModal,
  onOpenToolsModal,
  onExportZip,
  onRunPreview,
  isSidebarOpen,
  onToggleSidebar,
  isAiDrawerOpen,
  onToggleAiDrawer,
  onSelectTemplate,
  isCodeProtected = true,
  onToggleCodeProtection
}) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAltoModal, setShowAltoModal] = useState(false);

  return (
    <header className="h-14 border-b border-[#282a2c] bg-[#131314] px-3 sm:px-4 flex items-center justify-between select-none z-20 gap-2">
      {/* Left: Sidebar Toggle, Brand & Model */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle File Explorer button */}
        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg border transition ${
            isSidebarOpen 
              ? 'bg-[#282a2c] text-[#8ab4f8] border-[#8ab4f8]/30' 
              : 'text-[#9aa0a6] hover:text-white border-[#282a2c] hover:bg-[#1e1f20]'
          }`}
          title={isSidebarOpen ? 'Sembunyikan Panel Berkas' : 'Tampilkan Panel Berkas'}
        >
          <Sidebar className="w-4 h-4" />
        </button>

        {/* Kodein x Alto Brand */}
        <div 
          onClick={() => setShowAltoModal(true)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition group"
          title="Klik untuk info Kodein & Alto"
        >
          <AltoLogoMark size={32} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm tracking-tight text-white">
                Kodein
              </span>
              <span className="text-[10px] text-[#9aa0a6]">dengan</span>
              <span className="font-extrabold text-xs sm:text-sm tracking-tight bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
                Alto
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#1e2022] text-[#8ab4f8] border border-[#282a2c] hidden xs:inline">
                AI
              </span>
            </div>
            <div className="text-[10px] text-[#9aa0a6] flex items-center gap-1 leading-none mt-0.5">
              <span className="hidden md:inline text-[#94a3b8] group-hover:text-[#c4c7c5] transition">Chat · Kode · Info · Preview</span>
              <span className="w-1 h-1 rounded-full bg-[#9aa0a6] hidden md:inline"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-400 font-medium">Aktif</span>
            </div>
          </div>
        </div>

        {/* Alto Mode Pillars Quick Badges (Desktop) */}
        <div className="hidden 2xl:flex items-center gap-1 text-[10px] text-[#9aa0a6] bg-[#18191a] px-2.5 py-1 rounded-full border border-[#282a2c]">
          <span className="text-sky-400 font-medium">Coding</span>
          <span>•</span>
          <span className="text-purple-300 font-medium">Chat</span>
          <span>•</span>
          <span className="text-teal-300 font-medium">Info</span>
          <span>•</span>
          <span className="text-pink-300 font-medium">Preview</span>
        </div>
      </div>

      {/* Middle: View Mode Switcher (Visible on Tablet & Desktop) */}
      <div className="hidden md:flex items-center bg-[#1e1f20] p-0.5 rounded-lg border border-[#282a2c]">
        <button
          onClick={() => setViewMode('split')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition ${
            viewMode === 'split' 
              ? 'bg-[#282a2c] text-white shadow-sm' 
              : 'text-[#9aa0a6] hover:text-[#e3e3e3]'
          }`}
          title="Tampilan Gabungan (Editor & Preview)"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Split</span>
        </button>

        <button
          onClick={() => setViewMode('code')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition ${
            viewMode === 'code' 
              ? 'bg-[#282a2c] text-white shadow-sm' 
              : 'text-[#9aa0a6] hover:text-[#e3e3e3]'
          }`}
          title="Fokus Editor Kode"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Kode</span>
        </button>

        <button
          onClick={() => setViewMode('preview')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold transition ${
            viewMode === 'preview' 
              ? 'bg-[#1a73e8] text-white shadow-md shadow-[#1a73e8]/20' 
              : 'text-[#8ab4f8] hover:bg-[#282a2c]'
          }`}
          title="Fokus Layar Penuh Live Preview"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        <button
          onClick={() => setViewMode('ai')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition ${
            viewMode === 'ai' 
              ? 'bg-[#1a73e8]/20 text-[#8ab4f8] border border-[#1a73e8]/40' 
              : 'text-[#9aa0a6] hover:text-[#e3e3e3]'
          }`}
          title="Buka AI Coding Chat"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden md:inline">AI Chat</span>
        </button>
      </div>

      {/* Right: Template Picker, Run Preview, AI Drawer Toggle & Database Status */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Template Quick Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1e1f20] hover:bg-[#282a2c] text-[#e3e3e3] border border-[#282a2c] text-xs font-medium transition"
            title="Ganti Template Aplikasi"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#8ab4f8]" />
            <span>Template</span>
            <ChevronDown className="w-3 h-3 text-[#9aa0a6]" />
          </button>

          {showTemplates && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-[#1e1f20] border border-[#282a2c] rounded-xl shadow-2xl p-1 z-50 text-xs font-sans">
              <div className="px-2 py-1 text-[11px] font-semibold text-[#9aa0a6] uppercase tracking-wider">
                Pilih Contoh Kode
              </div>
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTemplate(t.id);
                    setShowTemplates(false);
                  }}
                  className="w-full text-left px-2.5 py-2 hover:bg-[#282a2c] rounded-lg transition text-slate-200 hover:text-white"
                >
                  <div className="font-medium text-white">{t.title}</div>
                  <div className="text-[10px] text-[#9aa0a6] truncate">{t.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Big Run / Refresh Preview Button */}
        <button
          onClick={onRunPreview}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1b66ca] active:scale-95 text-white text-xs font-semibold shadow-md shadow-[#1a73e8]/25 transition whitespace-nowrap"
          title="Segarkan & Jalankan Live Preview"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden xs:inline">Jalankan</span>
          <span className="xs:hidden">Play</span>
        </button>

        {/* AI Assistant Drawer Toggle */}
        <button
          onClick={onToggleAiDrawer}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
            isAiDrawerOpen 
              ? 'bg-[#1a73e8]/20 text-[#8ab4f8] border-[#8ab4f8]/40' 
              : 'bg-[#1e1f20] text-[#9aa0a6] hover:text-white border-[#282a2c] hover:bg-[#282a2c]'
          }`}
          title={isAiDrawerOpen ? 'Tutup Panel Alto AI' : 'Buka Panel Alto AI'}
        >
          <AltoLogoMark size={16} />
          <span className="hidden xl:inline font-semibold">Alto AI</span>
        </button>

        {/* Export Zip */}
        <button
          onClick={onExportZip}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1e1f20] hover:bg-[#282a2c] text-[#e3e3e3] border border-[#282a2c] text-xs font-medium transition"
          title="Unduh Proyek (.zip)"
        >
          <Download className="w-3.5 h-3.5 text-[#9aa0a6]" />
        </button>

        {/* External Tools (GitHub, GitLab, Vercel) */}
        {onOpenToolsModal && (
          <button
            onClick={onOpenToolsModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1e1f20] hover:bg-[#282a2c] text-[#e3e3e3] border border-[#282a2c] text-xs font-medium transition"
            title="Integrasi Tools Eksternal: GitHub, GitLab, Vercel"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden xl:inline">Tools</span>
          </button>
        )}

        {/* Code Shield Protection Status */}
        {onToggleCodeProtection && (
          <button
            onClick={onToggleCodeProtection}
            className={`hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-medium transition ${
              isCodeProtected
                ? 'bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-[#1e1f20] hover:bg-[#282a2c] border-[#282a2c] text-[#9aa0a6]'
            }`}
            title={
              isCodeProtected
                ? 'Code Shield Aktif: Perlindungan anti-ambil/anti-salin kode aktif untuk game & aplikasi Anda. Klik untuk kelola.'
                : 'Code Shield Dinonaktifkan: Klik untuk mengaktifkan perlindungan kode.'
            }
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isCodeProtected ? 'Shield Aktif' : 'Shield Off'}</span>
          </button>
        )}

        {/* Database Status Button */}
        <button
          onClick={onOpenDatabaseModal}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#182319] hover:bg-[#1e2f20] border border-emerald-500/30 text-emerald-400 text-xs font-medium transition group"
          title="Status Akun Database: sakhiammarf@gmail.com (Aktif)"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden 2xl:inline text-[11px] text-emerald-300 font-mono">
            {user?.email || 'sakhiammarf@gmail.com'}
          </span>
        </button>
      </div>

      {/* Hi Alto Info Modal */}
      <AltoInfoModal
        isOpen={showAltoModal}
        onClose={() => setShowAltoModal(false)}
        onOpenAiChat={() => {
          if (!isAiDrawerOpen) onToggleAiDrawer();
        }}
      />
    </header>
  );
};
