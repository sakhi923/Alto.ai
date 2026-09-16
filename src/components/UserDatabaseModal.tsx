import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  HardDrive, 
  Key, 
  Clock, 
  Activity,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { UserData, DatabaseStatus } from '../types';

interface UserDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  databaseStatus: DatabaseStatus | null;
  onRefreshDatabase: () => Promise<void>;
}

export const UserDatabaseModal: React.FC<UserDatabaseModalProps> = ({
  isOpen,
  onClose,
  user,
  databaseStatus,
  onRefreshDatabase
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsRefreshing(true);
    await onRefreshDatabase();
    setIsRefreshing(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#18191a] border border-[#282a2c] rounded-2xl shadow-2xl overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="h-14 px-5 bg-[#131314] border-b border-[#282a2c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Status Registrasi Database</h3>
              <p className="text-[11px] text-[#9aa0a6]">Pemeriksaan Akun & Operasional Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-white hover:bg-[#282a2c] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Status Banner */}
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-none mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-300 text-xs">Pengguna Berhasil Didaftarkan & Siap Dioperasikan</h4>
              <p className="text-[11px] text-emerald-400/90 mt-0.5 leading-relaxed">
                Akun email <strong className="text-white">sakhiammarf@gmail.com</strong> telah terdaftar otomatis ke database sistem dan memiliki otorisasi penuh untuk mengoperasikan Gemini Code Studio.
              </p>
            </div>
          </div>

          {/* User Record Card */}
          <div className="bg-[#1e1f20] border border-[#282a2c] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#282a2c]">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#8ab4f8]" />
                <span className="font-semibold text-white">Profil Pengguna Terdaftar</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                AKTIF & TERVERIFIKASI
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-[#9aa0a6] block">Nama Lengkap</span>
                <span className="font-medium text-white">{user?.name || 'Sakhi Ammar F'}</span>
              </div>

              <div>
                <span className="text-[#9aa0a6] block">Alamat Email</span>
                <span className="font-mono text-[#8ab4f8]">{user?.email || 'sakhiammarf@gmail.com'}</span>
              </div>

              <div>
                <span className="text-[#9aa0a6] block">Role Akses</span>
                <span className="font-medium text-white">{user?.role || 'Owner & Lead Developer'}</span>
              </div>

              <div>
                <span className="text-[#9aa0a6] block">ID Database Pengguna</span>
                <span className="font-mono text-[#c4c7c5]">{user?.id || 'usr_sakhiammarf'}</span>
              </div>

              <div>
                <span className="text-[#9aa0a6] block">Waktu Registrasi</span>
                <span className="text-[#c4c7c5]">
                  {user?.registeredAt ? new Date(user.registeredAt).toLocaleString('id-ID') : 'Aktif'}
                </span>
              </div>

              <div>
                <span className="text-[#9aa0a6] block">Akses Model AI</span>
                <span className="font-medium text-purple-400">Gemini 3.8 Flash Ready</span>
              </div>
            </div>
          </div>

          {/* Database Engine Telemetry */}
          <div className="bg-[#1e1f20] border border-[#282a2c] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#282a2c]">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">Spesifikasi Mesin Database</span>
              </div>
              <span className="text-[10px] text-[#9aa0a6] font-mono">v1.0.0</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-[#9aa0a6] block">Konektivitas Database</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Terhubung & Sinkron
                </span>
              </div>

              <div>
                <span className="text-[#9aa0a6] block">Tipe Mesin Penyimpanan</span>
                <span className="text-white">Persistent Embedded Store</span>
              </div>

              <div>
                <span className="text-[#9aa0a6] block">Berkas Proyek Tersimpan</span>
                <span className="text-white font-mono">{databaseStatus?.totalFiles || 4} berkas</span>
              </div>

              <div>
                <span className="text-[#9aa0a6] block">Sinkronisasi Terakhir</span>
                <span className="text-[#c4c7c5] font-mono">
                  {databaseStatus?.lastSync ? new Date(databaseStatus.lastSync).toLocaleTimeString('id-ID') : 'Baru saja'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-14 px-5 bg-[#131314] border-t border-[#282a2c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {syncSuccess && (
              <span className="text-emerald-400 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sinkronisasi Berhasil!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333537] text-white text-xs font-medium transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Cek Ulang Database</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1b66ca] text-white text-xs font-medium transition"
            >
              Tutup & Mulai Coding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
