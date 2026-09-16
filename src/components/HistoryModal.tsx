import React, { useState, useEffect } from 'react';
import { X, History, Trash2, MessageSquare, Plus, Clock, ChevronRight } from 'lucide-react';
import { ChatSession } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (session: ChatSession) => void;
  onNewSession: () => void;
  currentSessionId: string;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectSession,
  onNewSession,
  currentSessionId
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Apakah kamu yakin ingin menghapus riwayat sesi ini?')) return;

    try {
      const res = await fetch(`/api/ai/sessions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (currentSessionId === id) {
          onNewSession();
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        id="history-modal-container"
        className="w-full max-w-xl bg-[#161820] border border-[#333742] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#333742] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ffb63d]/15 text-[#ffb63d] flex items-center justify-center border border-[#ffb63d]/30">
              <History size={16} />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-[#f2efe6]">
                Riwayat Percakapan
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Semua proyek dan ide yang pernah kamu buat bareng Alto tersimpan di sini
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action button */}
        <div className="p-4 border-b border-[#333742]/50 bg-[#12141a]">
          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#ffb63d] text-[#12141a] text-xs font-bold hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#ffb63d]/15"
          >
            <Plus size={16} strokeWidth={2.8} />
            <span>Mulai Percakapan / Proyek Baru</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 scrollbar-thin">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#9aa0a6] space-y-2">
              <div className="w-6 h-6 border-2 border-[#ffb63d] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p>Memuat riwayat percakapan...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#9aa0a6] space-y-2">
              <MessageSquare size={28} className="mx-auto text-[#333742]" />
              <p className="font-medium text-[#f2efe6]">Belum ada riwayat percakapan</p>
              <p>Mulai ketikkan ide kamu di kotak input utama untuk menyimpan percakapan pertama bersama Alto.</p>
            </div>
          ) : (
            sessions.map(s => {
              const isCurrent = s.id === currentSessionId;
              const dateStr = new Date(s.updatedAt || s.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isCurrent
                      ? 'bg-[#1b1e26] border-[#ffb63d] shadow-md shadow-[#ffb63d]/5'
                      : 'bg-[#12141a] border-[#333742]/70 hover:border-[#ffb63d]/40 hover:bg-[#1b1e26]/60'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1 pr-2">
                    <div className="p-2 rounded-lg bg-[#161820] text-[#9aa0a6] group-hover:text-[#ffb63d] transition-colors mt-0.5">
                      <MessageSquare size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#f2efe6] truncate">
                          {s.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#ffb63d]/20 text-[#ffb63d] font-semibold">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#9aa0a6] mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {dateStr}
                        </span>
                        <span>•</span>
                        <span>{s.messages?.length || 0} pesan</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteSession(e, s.id)}
                      title="Hapus riwayat"
                      className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>
                    <ChevronRight size={16} className="text-[#9aa0a6] group-hover:text-[#ffb63d] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-[#333742]/50 bg-[#161820] flex items-center justify-between text-[11px] text-[#9aa0a6]">
          <span>Semua sesi tersimpan di server aman Kodein</span>
          <span className="font-mono font-bold text-[#8ef5a0]">{sessions.length} Tersimpan</span>
        </div>
      </div>
    </div>
  );
};
