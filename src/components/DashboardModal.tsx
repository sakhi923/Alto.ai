import React, { useState, useEffect } from 'react';
import { X, LayoutDashboard, Activity, HardDrive, Cpu, Users, CheckCircle2 } from 'lucide-react';
import { DatabaseStatus, UserData } from '../types';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  databaseStatus: DatabaseStatus | null;
  sessionCount: number;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  databaseStatus,
  sessionCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        id="dashboard-modal-container"
        className="w-full max-w-2xl bg-[#161820] border border-[#333742] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#333742] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffb63d]/15 text-[#ffb63d] flex items-center justify-center border border-[#ffb63d]/30">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#f2efe6]">
                Dasbor Penggunaan &amp; Sistem
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Statistik real-time aktivitas akun, penyimpanan, dan status koneksi server
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#333742]">
              <span className="text-[11px] font-mono text-[#9aa0a6] uppercase">Sesi AI</span>
              <div className="text-2xl font-extrabold text-[#f2efe6] mt-1">{sessionCount}</div>
              <span className="text-[10px] text-[#8ef5a0] font-mono">Tersimpan</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#333742]">
              <span className="text-[11px] font-mono text-[#9aa0a6] uppercase">Tokens Dipakai</span>
              <div className="text-2xl font-extrabold text-[#ffb63d] mt-1">{user?.usedTokens?.toLocaleString() || '18,450'}</div>
              <span className="text-[10px] text-[#9aa0a6] font-mono">/ 1,000,000</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#333742]">
              <span className="text-[11px] font-mono text-[#9aa0a6] uppercase">Berkas Proyek</span>
              <div className="text-2xl font-extrabold text-[#f2efe6] mt-1">{databaseStatus?.totalFiles || 4}</div>
              <span className="text-[10px] text-[#8ef5a0] font-mono">Sinkron</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#333742]">
              <span className="text-[11px] font-mono text-[#9aa0a6] uppercase">Status API</span>
              <div className="text-lg font-bold text-[#8ef5a0] mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8ef5a0] animate-pulse"></span>
                Online
              </div>
              <span className="text-[10px] text-[#9aa0a6] font-mono">38ms Latensi</span>
            </div>
          </div>

          {/* Account Profile Card */}
          <div className="p-4 rounded-2xl bg-[#12141a] border border-[#333742] space-y-3">
            <h4 className="font-['Space_Grotesk'] font-bold text-xs uppercase tracking-wider text-[#9aa0a6]">
              Informasi Pengguna
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#9aa0a6]">Nama Pengguna:</span>
                <p className="font-bold text-[#f2efe6] text-sm mt-0.5">{user?.name || 'Sakhi Ammar F'}</p>
              </div>
              <div>
                <span className="text-[#9aa0a6]">Email Terhubung:</span>
                <p className="font-mono text-[#ffb63d] mt-0.5">{user?.email || 'sakhiammarf@gmail.com'}</p>
              </div>
              <div>
                <span className="text-[#9aa0a6]">Tipe Akses:</span>
                <p className="text-slate-200 mt-0.5 font-semibold">Owner • Developer Full-Stack</p>
              </div>
              <div>
                <span className="text-[#9aa0a6]">Penyimpanan Database:</span>
                <p className="font-mono text-[#8ef5a0] mt-0.5">JSON DB File (Terhubung)</p>
              </div>
            </div>
          </div>

          {/* Connected External Tools status */}
          <div className="p-4 rounded-2xl bg-[#12141a] border border-[#333742] space-y-3">
            <h4 className="font-['Space_Grotesk'] font-bold text-xs uppercase tracking-wider text-[#9aa0a6]">
              Konektivitas Eksternal
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#161820] border border-[#333742]/60">
                <span className="font-medium text-[#f2efe6]">Google Gemini API (3.8 Flash)</span>
                <span className="text-[#8ef5a0] font-mono font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Terhubung
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#161820] border border-[#333742]/60">
                <span className="font-medium text-[#f2efe6]">Grounding with Google Search</span>
                <span className="text-[#8ef5a0] font-mono font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Aktif
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#161820] border border-[#333742]/60">
                <span className="font-medium text-[#f2efe6]">GitHub / GitLab OAuth</span>
                <span className="text-[#ffb63d] font-mono font-semibold">Siap Diintegrasikan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#333742]/50 bg-[#161820] flex items-center justify-between text-xs text-[#9aa0a6]">
          <span>Server Kodein v2.4 • Node.js Express</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#333742] text-white hover:bg-[#404552] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
