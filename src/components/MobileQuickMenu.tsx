import React from 'react';
import { 
  X, 
  Play, 
  Download, 
  Database, 
  LayoutGrid, 
  Info, 
  Code2, 
  Eye, 
  Layers, 
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { UserData, DatabaseStatus, ViewMode } from '../types';
import { TEMPLATES } from '../data/initialFiles';
import { AltoLogoMark } from './AltoLogo';

interface MobileQuickMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  databaseStatus: DatabaseStatus | null;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onRunPreview: () => void;
  onExportZip: () => void;
  onOpenDatabaseModal: () => void;
  onSelectTemplate: (templateId: string) => void;
  onOpenAltoInfo: () => void;
}

export const MobileQuickMenu: React.FC<MobileQuickMenuProps> = ({
  isOpen,
  onClose,
  user,
  databaseStatus,
  viewMode,
  setViewMode,
  onRunPreview,
  onExportZip,
  onOpenDatabaseModal,
  onSelectTemplate,
  onOpenAltoInfo
}) => {
  const [showTemplatesList, setShowTemplatesList] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div 
      id="mobile-quick-menu-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="mobile-quick-menu-sheet"
        className="w-full md:max-w-md bg-[#161718] border-t md:border border-[#282a2c] rounded-t-2xl md:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sheet Grab Handle on Mobile */}
        <div className="w-12 h-1 bg-[#3c4043] rounded-full mx-auto mt-3 mb-1 md:hidden" />

        {/* Header */}
        <div className="px-4 py-3 border-b border-[#282a2c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AltoLogoMark size={24} />
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Menu Tindakan & Navigasi</h3>
              <p className="text-[11px] text-[#9aa0a6]">Hi Alto Studio • Responsif HP, Tablet & Laptop</p>
            </div>
          </div>
          <button
            id="mobile-quick-menu-close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-white hover:bg-[#282a2c] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(85vh-60px)]">
          {/* Primary Action: Run Live Preview */}
          <button
            id="mobile-menu-btn-run"
            onClick={() => {
              onRunPreview();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/20 active:scale-[0.98] transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Jalankan & Segarkan Preview</div>
                <div className="text-xs text-blue-100">Kompilasi ulang berkas HTML/CSS/JS</div>
              </div>
            </div>
          </button>

          {/* View Modes Grid */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-2">
              Pilihan Tampilan Layar
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setViewMode('code');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                  viewMode === 'code'
                    ? 'bg-[#1a73e8]/20 border-[#8ab4f8] text-[#8ab4f8]'
                    : 'bg-[#1e1f20] border-[#282a2c] text-[#c4c7c5] hover:border-[#3c4043]'
                }`}
              >
                <Code2 className="w-5 h-5 mb-1 text-[#8ab4f8]" />
                <span className="text-xs font-semibold">Kode</span>
                <span className="text-[9px] text-[#9aa0a6] mt-0.5">Editor Berkas</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('preview');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                  viewMode === 'preview'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                    : 'bg-[#1e1f20] border-[#282a2c] text-[#c4c7c5] hover:border-[#3c4043]'
                }`}
              >
                <Eye className="w-5 h-5 mb-1 text-emerald-400" />
                <span className="text-xs font-semibold">Preview</span>
                <span className="text-[9px] text-[#9aa0a6] mt-0.5">Layar Penuh</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('split');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                  viewMode === 'split'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                    : 'bg-[#1e1f20] border-[#282a2c] text-[#c4c7c5] hover:border-[#3c4043]'
                }`}
              >
                <Layers className="w-5 h-5 mb-1 text-purple-300" />
                <span className="text-xs font-semibold">Split</span>
                <span className="text-[9px] text-[#9aa0a6] mt-0.5">Kode & Preview</span>
              </button>
            </div>
          </div>

          {/* Quick Actions List */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1">
              Manajemen & Integrasi
            </div>

            {/* Database Status Button */}
            <button
              onClick={() => {
                onOpenDatabaseModal();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#182319] hover:bg-[#1e2f20] border border-emerald-500/30 text-emerald-400 transition"
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-white">Status Database Akun</div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    {user?.email || 'sakhiammarf@gmail.com'} (Aktif)
                  </div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Templates Selector */}
            <div className="rounded-xl border border-[#282a2c] bg-[#1a1b1e] overflow-hidden">
              <button
                onClick={() => setShowTemplatesList(!showTemplatesList)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-[#222428] transition"
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5 text-[#8ab4f8]" />
                  <div>
                    <div className="text-xs font-semibold text-white">Pilih Template Proyek</div>
                    <div className="text-[11px] text-[#9aa0a6]">Ganti ke template starter aplikasi lain</div>
                  </div>
                </div>
                <span className="text-xs text-[#8ab4f8] font-medium">
                  {showTemplatesList ? 'Tutup' : 'Lihat'}
                </span>
              </button>

              {showTemplatesList && (
                <div className="p-2 border-t border-[#282a2c] space-y-1 bg-[#141518]">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTemplate(t.id);
                        setShowTemplatesList(false);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-[#282a2c] transition"
                    >
                      <div className="text-xs font-semibold text-white">{t.title}</div>
                      <div className="text-[10px] text-[#9aa0a6]">{t.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Zip */}
            <button
              onClick={() => {
                onExportZip();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1e1f20] hover:bg-[#282a2c] border border-[#282a2c] text-white transition"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-[#9aa0a6]" />
                <div className="text-left">
                  <div className="text-xs font-semibold">Unduh Berkas Proyek (.zip)</div>
                  <div className="text-[11px] text-[#9aa0a6]">Simpan cadangan ke memori perangkat</div>
                </div>
              </div>
            </button>

            {/* Ecosystem Info */}
            <button
              onClick={() => {
                onOpenAltoInfo();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1e1f20] hover:bg-[#282a2c] border border-[#282a2c] text-white transition"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <div className="text-xs font-semibold">Tentang Hi Alto</div>
                  <div className="text-[11px] text-[#9aa0a6]">Coding • Chat • Create • Explore</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
