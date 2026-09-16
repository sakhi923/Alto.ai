import React from 'react';
import { X, Bell, Sparkles, CheckCircle2, Info } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Selamat Datang di Kodein v2.4!',
      desc: 'Alto siap membantu kamu mewujudkan ide aplikasi secara langsung dengan preview interaktif real-time.',
      time: 'Baru saja',
      type: 'welcome',
      icon: Sparkles
    },
    {
      id: '2',
      title: 'Pembaruan Fitur: Riwayat Percakapan',
      desc: 'Sekarang seluruh sesi dan proyek yang kamu diskusikan bersama Alto otomatis tersimpan di server dan dapat dibuka kembali kapan saja.',
      time: '1 jam yang lalu',
      type: 'update',
      icon: CheckCircle2
    },
    {
      id: '3',
      title: 'Tips: Lampirkan Screenshot UI',
      desc: 'Kamu bisa melampirkan screenshot atau gambar wireframe untuk meminta Alto mereplikasi antarmuka tersebut ke berkas HTML & Tailwind CSS.',
      time: '1 hari yang lalu',
      type: 'tip',
      icon: Info
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        id="notifications-modal-container"
        className="w-full max-w-lg bg-[#161820] border border-[#333742] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#333742] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffb63d]/15 text-[#ffb63d] flex items-center justify-center border border-[#ffb63d]/30">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#f2efe6]">
                Notifikasi &amp; Pembaruan
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Info rilis terbaru, tips produktivitas, dan pengumuman sistem
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

        {/* Notifications list */}
        <div className="p-4 overflow-y-auto space-y-3 scrollbar-thin">
          {notifications.map(n => {
            const Icon = n.icon;
            return (
              <div 
                key={n.id}
                className="p-4 rounded-2xl bg-[#12141a] border border-[#333742]/80 hover:border-[#ffb63d]/40 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#ffb63d]/15 text-[#ffb63d]">
                      <Icon size={14} />
                    </span>
                    <h4 className="font-bold text-xs text-[#f2efe6]">{n.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#9aa0a6]">{n.time}</span>
                </div>
                <p className="text-xs text-[#9aa0a6] leading-relaxed pl-7">
                  {n.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#333742]/50 bg-[#161820] flex items-center justify-between text-xs text-[#9aa0a6]">
          <span>Semua notifikasi sudah dibaca</span>
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
