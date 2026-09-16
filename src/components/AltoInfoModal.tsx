import React from 'react';
import { AltoLogoMark } from './AltoLogo';
import { X, Sparkles, Code2, Search, GitBranch, Paperclip, MessageSquare } from 'lucide-react';

interface AltoInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiChat: () => void;
}

export const AltoInfoModal: React.FC<AltoInfoModalProps> = ({
  isOpen,
  onClose,
  onOpenAiChat
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="alto-info-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="alto-info-modal-card"
        className="bg-[#0f1115] border border-[#282a2c] rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glow */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9aa0a6] hover:text-white hover:bg-[#1e1f20] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <AltoLogoMark size={48} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">Alto</span>
              <span className="text-xs text-[#9aa0a6]">di</span>
              <span className="text-xl font-extrabold bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
                Kodein
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Ruang kerja cerdas: Chat · Kode · Info · Preview
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="p-3 rounded-xl bg-[#16171a] border border-[#282a2c] text-xs text-[#c4c7c5] leading-relaxed mb-4">
          <p className="text-white font-medium mb-1">Hai, aku Alto 👋</p>
          Aku adalah AI di dalam produk <strong>Kodein</strong>. Aku siap membantu kamu menulis kode, mengeksplorasi ide, mencari sumber informasi faktual, dan melihat hasilnya langsung di Live Preview.
        </div>

        {/* 4 Core Capabilities */}
        <div className="space-y-2.5 mb-5">
          <div className="text-[11px] font-bold text-[#8ab4f8] uppercase tracking-wider">
            4 Kemampuan Inti Alto:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#16171a] border border-[#282a2c]">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1">
                <Code2 className="w-3.5 h-3.5" />
                <span>1. Tulis & Jalankan Kode</span>
              </div>
              <p className="text-[11px] text-[#9aa0a6] leading-snug">
                Menulis kode di berbagai bahasa, jelaskan logika singkat, dan langsung tampil di Live Preview interaktif.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#16171a] border border-[#282a2c]">
              <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                <Search className="w-3.5 h-3.5" />
                <span>2. Cari Sumber Info</span>
              </div>
              <p className="text-[11px] text-[#9aa0a6] leading-snug">
                Mencari data & fakta terkini di web sebelum menjawab, lalu menyertakan sumber referensi yang jelas.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#16171a] border border-[#282a2c]">
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                <GitBranch className="w-3.5 h-3.5" />
                <span>3. Tools Eksternal</span>
              </div>
              <p className="text-[11px] text-[#9aa0a6] leading-snug">
                Terhubung ke GitHub, GitLab, & Vercel untuk push commit, deploy instan, atau menarik repo.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#16171a] border border-[#282a2c]">
              <div className="flex items-center gap-1.5 text-pink-400 font-semibold mb-1">
                <Paperclip className="w-3.5 h-3.5" />
                <span>4. Terima File & Gambar</span>
              </div>
              <p className="text-[11px] text-[#9aa0a6] leading-snug">
                Menerima screenshot, foto UI, atau file data sebagai konteks kerja langsung di chat.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#282a2c] flex items-center justify-between text-xs text-[#94a3b8]">
          <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Siap Digunakan
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAiChat();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-90 text-white transition font-medium text-xs flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mulai Chat</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#1e2022] hover:bg-[#282a2c] text-white transition font-medium border border-[#282a2c]"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
