import React from 'react';
import { 
  MessageSquare, 
  History, 
  Plus, 
  FolderGit2, 
  Sparkles, 
  LayoutDashboard, 
  BookOpen, 
  Bell, 
  Settings, 
  Search, 
  Key, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { SidebarSection } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection: SidebarSection;
  onSelectSection: (section: SidebarSection) => void;
  onNewProject: () => void;
  sessionCount: number;
  onOpenUpgrade: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  onOpenApiKey: () => void;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeSection,
  onSelectSection,
  onNewProject,
  sessionCount,
  onOpenUpgrade,
  onOpenNotifications,
  onOpenSettings,
  onOpenSearch,
  onOpenApiKey,
  userEmail = 'sakhiammarf@gmail.com'
}) => {
  return (
    <aside 
      id="kodein-sidebar"
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#161820] border-r border-[#333742]/70 flex flex-col justify-between transition-all duration-300 select-none ${
        isOpen ? 'w-[260px]' : 'w-[68px]'
      }`}
    >
      {/* Top Section: Logo & Toggle */}
      <div className="flex flex-col">
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#333742]/50">
          {isOpen ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="w-8 h-8 rounded-lg bg-[#ffb63d]/15 border border-[#ffb63d]/30 text-[#ffb63d] flex items-center justify-center font-mono font-bold text-sm shadow-sm">
                &gt;_
              </span>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] font-bold text-lg text-[#f2efe6] tracking-tight flex items-center gap-1">
                  Kodein<span className="text-[#ffb63d]">.</span>
                </span>
                <span className="text-[10px] text-[#9aa0a6] font-mono leading-none">
                  bersama Alto AI
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <span className="w-9 h-9 rounded-lg bg-[#ffb63d]/15 border border-[#ffb63d]/30 text-[#ffb63d] flex items-center justify-center font-mono font-bold text-sm">
                &gt;_
              </span>
            </div>
          )}

          <button
            id="btn-toggle-sidebar"
            onClick={onToggle}
            title={isOpen ? 'Ciutkan sidebar' : 'Perluas sidebar'}
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26] transition-colors"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation Content */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-290px)] scrollbar-thin">
          {/* Bagian: Jelajahi */}
          <div>
            {isOpen && (
              <div className="px-3 pb-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9aa0a6]">
                Jelajahi
              </div>
            )}
            <div className="space-y-1">
              <button
                id="menu-ngobrol-alto"
                onClick={() => onSelectSection('chat')}
                title="Ngobrol sama Alto"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeSection === 'chat'
                    ? 'bg-[#ffb63d]/15 text-[#ffb63d] font-semibold border border-[#ffb63d]/30 shadow-sm'
                    : 'text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26]'
                }`}
              >
                <MessageSquare size={16} className={activeSection === 'chat' ? 'text-[#ffb63d]' : 'text-[#9aa0a6]'} />
                {isOpen && <span>Ngobrol sama Alto</span>}
              </button>

              <button
                id="menu-riwayat"
                onClick={() => onSelectSection('history')}
                title="Riwayat Percakapan"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeSection === 'history'
                    ? 'bg-[#ffb63d]/15 text-[#ffb63d] font-semibold border border-[#ffb63d]/30'
                    : 'text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <History size={16} />
                  {isOpen && <span>Riwayat</span>}
                </div>
                {isOpen && sessionCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#1b1e26] border border-[#333742] text-[#8ef5a0]">
                    {sessionCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bagian: Buat */}
          <div>
            {isOpen && (
              <div className="px-3 pb-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9aa0a6]">
                Buat
              </div>
            )}
            <div className="space-y-1">
              {/* Tombol Proyek Baru */}
              <button
                id="btn-proyek-baru"
                onClick={onNewProject}
                title="Proyek baru"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-[#ffb63d] text-[#12141a] hover:brightness-105 active:scale-[0.98] transition-all shadow-md shadow-[#ffb63d]/15 mb-2"
              >
                <Plus size={16} strokeWidth={2.8} />
                {isOpen && <span>Proyek baru</span>}
              </button>

              <button
                id="menu-proyek-saya"
                onClick={() => onSelectSection('my-projects')}
                title="Proyek saya"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeSection === 'my-projects'
                    ? 'bg-[#ffb63d]/15 text-[#ffb63d] font-semibold border border-[#ffb63d]/30'
                    : 'text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26]'
                }`}
              >
                <FolderGit2 size={16} />
                {isOpen && <span>Proyek saya</span>}
              </button>

              <button
                id="menu-galeri"
                onClick={() => onSelectSection('gallery')}
                title="Galeri Template"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeSection === 'gallery'
                    ? 'bg-[#ffb63d]/15 text-[#ffb63d] font-semibold border border-[#ffb63d]/30'
                    : 'text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26]'
                }`}
              >
                <Sparkles size={16} className="text-[#8ef5a0]" />
                {isOpen && <span>Galeri</span>}
              </button>
            </div>
          </div>

          {/* Bagian: Kelola */}
          <div>
            {isOpen && (
              <div className="px-3 pb-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9aa0a6]">
                Kelola
              </div>
            )}
            <div className="space-y-1">
              <button
                id="menu-dasbor"
                onClick={() => onSelectSection('dashboard')}
                title="Dasbor"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeSection === 'dashboard'
                    ? 'bg-[#ffb63d]/15 text-[#ffb63d] font-semibold border border-[#ffb63d]/30'
                    : 'text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26]'
                }`}
              >
                <LayoutDashboard size={16} />
                {isOpen && <span>Dasbor</span>}
              </button>

              <button
                id="menu-dokumentasi"
                onClick={() => onSelectSection('docs')}
                title="Dokumentasi"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeSection === 'docs'
                    ? 'bg-[#ffb63d]/15 text-[#ffb63d] font-semibold border border-[#ffb63d]/30'
                    : 'text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26]'
                }`}
              >
                <BookOpen size={16} />
                {isOpen && <span>Dokumentasi</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Upgrade Card, Action Icons, User Info */}
      <div className="p-3 border-t border-[#333742]/50 space-y-3 bg-[#161820]">
        {/* Kartu Upgrade untuk Lebih Leluasa */}
        {isOpen ? (
          <div 
            id="card-upgrade-leluasa"
            className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1b1e26] to-[#12141a] border border-[#ffb63d]/30 relative overflow-hidden group shadow-lg shadow-black/30"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffb63d]/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-md bg-[#ffb63d]/20 text-[#ffb63d] flex items-center justify-center text-xs">
                <Zap size={12} fill="#ffb63d" />
              </span>
              <h4 className="font-['Space_Grotesk'] font-bold text-xs text-[#f2efe6]">
                Upgrade untuk lebih leluasa
              </h4>
            </div>
            <p className="text-[11px] text-[#9aa0a6] leading-relaxed mb-3">
              Naikkan limit harian, akses model lebih cepat, dan fitur tambahan.
            </p>
            <button
              id="btn-upgrade-sidebar"
              onClick={onOpenUpgrade}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-[#ffb63d] text-[#12141a] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Tingkatkan Sekarang</span>
              <span>→</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenUpgrade}
            title="Upgrade untuk lebih leluasa"
            className="w-10 h-10 mx-auto rounded-xl bg-[#ffb63d]/15 border border-[#ffb63d]/40 text-[#ffb63d] flex items-center justify-center hover:bg-[#ffb63d]/25 transition-all"
          >
            <Zap size={18} fill="#ffb63d" />
          </button>
        )}

        {/* Baris Ikon: Notifikasi, Pengaturan, Cari, Kunci API */}
        <div className={`flex items-center justify-between px-1 py-1 rounded-xl bg-[#1b1e26]/70 border border-[#333742]/50 ${!isOpen && 'flex-col gap-1'}`}>
          <button
            id="icon-notifikasi"
            onClick={onOpenNotifications}
            title="Notifikasi"
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#333742]/40 transition-colors"
          >
            <Bell size={16} />
          </button>
          <button
            id="icon-pengaturan"
            onClick={onOpenSettings}
            title="Pengaturan"
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#333742]/40 transition-colors"
          >
            <Settings size={16} />
          </button>
          <button
            id="icon-cari"
            onClick={onOpenSearch}
            title="Cari Proyek atau Kode"
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#333742]/40 transition-colors"
          >
            <Search size={16} />
          </button>
          <button
            id="icon-kunci-api"
            onClick={onOpenApiKey}
            title="Kunci API"
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-[#ffb63d] hover:bg-[#333742]/40 transition-colors"
          >
            <Key size={16} />
          </button>
        </div>

        {/* Info Akun: Avatar + Email */}
        <div 
          id="account-info-box"
          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#1b1e26] transition-colors cursor-pointer"
          onClick={onOpenSettings}
          title={userEmail}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ffb63d] to-[#8ef5a0] flex items-center justify-center font-bold text-[#12141a] text-xs font-mono shadow-sm flex-shrink-0">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-[#f2efe6] truncate leading-tight">
                Sakhi Ammar F
              </span>
              <span className="text-[10px] text-[#9aa0a6] font-mono truncate leading-tight">
                {userEmail}
              </span>
            </div>
          )}
          {isOpen && (
            <CheckCircle2 size={13} className="text-[#8ef5a0] flex-shrink-0" />
          )}
        </div>
      </div>
    </aside>
  );
};
