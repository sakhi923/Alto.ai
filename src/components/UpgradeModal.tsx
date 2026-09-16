import React, { useState } from 'react';
import { X, Zap, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [upgraded, setUpgraded] = useState(false);

  if (!isOpen) return null;

  const handleUpgradeClick = (tier: string) => {
    setUpgraded(true);
    setTimeout(() => {
      alert(`Paket ${tier} berhasil diaktifkan untuk akun kamu! Kuota harian kamu kini telah dinaikkan.`);
      setUpgraded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        id="upgrade-modal-container"
        className="w-full max-w-2xl bg-[#161820] border border-[#ffb63d]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#333742] flex items-center justify-between bg-gradient-to-r from-[#161820] via-[#1b1e26] to-[#161820]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffb63d]/15 text-[#ffb63d] flex items-center justify-center border border-[#ffb63d]/30 shadow-inner">
              <Zap size={20} fill="#ffb63d" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#f2efe6] flex items-center gap-2">
                Upgrade untuk lebih leluasa
                <span className="px-2 py-0.5 rounded-full bg-[#ffb63d] text-[#12141a] font-bold text-[10px] tracking-wider uppercase font-mono">
                  PRO
                </span>
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Naikkan limit harian, akses model lebih cepat, dan fitur tambahan.
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

        {/* Billing Switcher */}
        <div className="p-4 bg-[#12141a] border-b border-[#333742]/50 flex items-center justify-center gap-3 text-xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-[#333742] text-white'
                : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            Bulanan
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              billingCycle === 'annual'
                ? 'bg-[#ffb63d] text-[#12141a] font-bold shadow-md shadow-[#ffb63d]/20'
                : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span>Tahunan</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#12141a] text-[#8ef5a0] font-mono">
              Hemat 20%
            </span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 scrollbar-thin">
          {/* Paket Gratis */}
          <div className="p-5 rounded-2xl bg-[#12141a] border border-[#333742] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#9aa0a6]">Paket Gratis</span>
                <span className="text-[10px] font-mono text-[#8ef5a0] bg-[#8ef5a0]/15 px-2 py-0.5 rounded">Saat Ini</span>
              </div>
              <h4 className="font-['Space_Grotesk'] font-bold text-xl text-[#f2efe6] mt-1">Starter</h4>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-[#f2efe6]">Rp 0</span>
                <span className="text-xs text-[#9aa0a6]"> / selamanya</span>
              </div>
              <ul className="text-xs text-[#9aa0a6] space-y-2 mt-4">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#8ef5a0]" />
                  <span>50 prompt AI per hari</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#8ef5a0]" />
                  <span>Live Preview sandbox dasar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#8ef5a0]" />
                  <span>Riwayat percakapan tersimpan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#8ef5a0]" />
                  <span>Ekspor ZIP dan kode</span>
                </li>
              </ul>
            </div>
            <button
              disabled
              className="w-full py-2.5 rounded-xl border border-[#333742] text-xs font-bold text-[#9aa0a6] cursor-default bg-[#161820]"
            >
              Paket Aktif
            </button>
          </div>

          {/* Paket Pro */}
          <div className="p-5 rounded-2xl bg-[#1b1e26] border-2 border-[#ffb63d] flex flex-col justify-between space-y-4 relative shadow-xl shadow-[#ffb63d]/10">
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-[#ffb63d] text-[#12141a] font-bold text-[10px] tracking-wider uppercase font-mono shadow-sm">
              REKOMENDASI ALTO
            </div>
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#ffb63d]">Kodein Pro</span>
              <h4 className="font-['Space_Grotesk'] font-bold text-xl text-[#f2efe6] mt-1">Tanpa Batas</h4>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-[#f2efe6]">
                  {billingCycle === 'annual' ? 'Rp 79.000' : 'Rp 99.000'}
                </span>
                <span className="text-xs text-[#9aa0a6]"> / bulan</span>
              </div>
              <ul className="text-xs text-[#9aa0a6] space-y-2 mt-4">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#ffb63d]" />
                  <span className="text-[#f2efe6] font-semibold">Unlimited Kuota Prompt AI (Gemini 3.8 Flash)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#ffb63d]" />
                  <span>Akses model lebih cepat (latensi prioritas &lt;200ms)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#ffb63d]" />
                  <span>Grounding Web Search faktual tanpa kuota</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#ffb63d]" />
                  <span>Integrasi Git &amp; Deploy 1-Klik ke Vercel</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#ffb63d]" />
                  <span>Dukungan prioritas langsung dari tim Kodein</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleUpgradeClick('Kodein Pro')}
              disabled={upgraded}
              className="w-full py-2.5 rounded-xl bg-[#ffb63d] text-[#12141a] text-xs font-bold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ffb63d]/20"
            >
              {upgraded ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#12141a] border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses Upgrade...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Tingkatkan ke Pro Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="px-6 py-3 border-t border-[#333742]/50 bg-[#161820] flex items-center justify-between text-[11px] text-[#9aa0a6]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#8ef5a0]" />
            <span>Garansi 14 hari uang kembali tanpa syarat</span>
          </div>
          <span className="font-mono">Metode: QRIS, VA, Kartu</span>
        </div>
      </div>
    </div>
  );
};
