import React from 'react';
import { 
  FolderTree, 
  Code2, 
  Eye, 
  Sparkles, 
  Menu, 
  Layers,
  Database,
  Play
} from 'lucide-react';
import { ViewMode } from '../types';
import { AltoLogoMark } from './AltoLogo';

interface MobileNavProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isAiDrawerOpen: boolean;
  onToggleAiDrawer: () => void;
  onOpenQuickMenu: () => void;
  filesCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  viewMode,
  setViewMode,
  isSidebarOpen,
  onToggleSidebar,
  isAiDrawerOpen,
  onToggleAiDrawer,
  onOpenQuickMenu,
  filesCount
}) => {
  return (
    <nav 
      id="mobile-bottom-nav"
      className="md:hidden flex-none h-14 bg-[#111214]/95 backdrop-blur-md border-t border-[#282a2c] flex items-center justify-around px-2 z-30 select-none shadow-2xl safe-area-bottom"
    >
      {/* 1. Berkas / File Explorer Toggle */}
      <button
        id="mobile-btn-files"
        onClick={onToggleSidebar}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition relative ${
          isSidebarOpen ? 'text-[#8ab4f8]' : 'text-[#9aa0a6] hover:text-[#e3e3e3]'
        }`}
        title="Buka Berkas Proyek"
      >
        <div className="relative">
          <FolderTree className="w-5 h-5" />
          {filesCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#1e2022] text-[#8ab4f8] text-[9px] font-bold rounded-full border border-[#282a2c]">
              {filesCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 font-medium leading-tight">Berkas</span>
      </button>

      {/* 2. Mode Kode */}
      <button
        id="mobile-btn-code"
        onClick={() => {
          setViewMode('code');
          if (isAiDrawerOpen) onToggleAiDrawer();
        }}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition ${
          viewMode === 'code' ? 'text-[#8ab4f8] font-semibold' : 'text-[#9aa0a6] hover:text-[#e3e3e3]'
        }`}
        title="Tampilan Editor Kode"
      >
        <Code2 className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 leading-tight">Kode</span>
      </button>

      {/* 3. Mode Preview */}
      <button
        id="mobile-btn-preview"
        onClick={() => {
          setViewMode('preview');
          if (isAiDrawerOpen) onToggleAiDrawer();
        }}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition relative ${
          viewMode === 'preview' ? 'text-emerald-400 font-semibold' : 'text-[#9aa0a6] hover:text-[#e3e3e3]'
        }`}
        title="Tampilan Live Preview"
      >
        <div className="relative">
          <Eye className="w-5 h-5" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-1 animate-pulse" />
        </div>
        <span className="text-[10px] mt-0.5 leading-tight">Preview</span>
      </button>

      {/* 4. Alto AI Chat */}
      <button
        id="mobile-btn-alto-ai"
        onClick={onToggleAiDrawer}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition ${
          isAiDrawerOpen || viewMode === 'ai' ? 'text-purple-400 font-semibold' : 'text-[#9aa0a6] hover:text-[#e3e3e3]'
        }`}
        title="Tanya Alto AI"
      >
        <div className="relative">
          <AltoLogoMark size={20} />
        </div>
        <span className="text-[10px] mt-0.5 leading-tight">Alto AI</span>
      </button>

      {/* 5. Menu Cepat (DB, Template, Run, Zip) */}
      <button
        id="mobile-btn-quick-menu"
        onClick={onOpenQuickMenu}
        className="flex flex-col items-center justify-center flex-1 py-1 px-1 text-[#9aa0a6] hover:text-[#e3e3e3] transition"
        title="Menu Tindakan Cepat"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 leading-tight">Menu</span>
      </button>
    </nav>
  );
};
