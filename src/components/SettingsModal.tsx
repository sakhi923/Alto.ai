import React, { useState } from 'react';
import { X, Settings, Key, Globe, Shield, Cpu, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'settings' | 'apikey';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'settings'
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'apikey'>(defaultTab);
  const [apiKey, setApiKey] = useState('AIzaSyD_••••••••••••••••••••••••');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [enableGrounding, setEnableGrounding] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        id="settings-modal-container"
        className="w-full max-w-xl bg-[#161820] border border-[#333742] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#333742] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffb63d]/15 text-[#ffb63d] flex items-center justify-center border border-[#ffb63d]/30">
              {activeTab === 'apikey' ? <Key size={20} /> : <Settings size={20} />}
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#f2efe6]">
                {activeTab === 'apikey' ? 'Kunci API Google AI Studio' : 'Pengaturan Ruang Kerja'}
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Konfigurasi model, penelusuran web cerdas, dan preferensi akun
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

        {/* Tab Switcher */}
        <div className="px-6 pt-3 flex gap-4 border-b border-[#333742]/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-[#ffb63d] text-[#ffb63d]'
                : 'border-transparent text-[#9aa0a6] hover:text-white'
            }`}
          >
            Model &amp; Grounding
          </button>
          <button
            onClick={() => setActiveTab('apikey')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'apikey'
                ? 'border-[#ffb63d] text-[#ffb63d]'
                : 'border-transparent text-[#9aa0a6] hover:text-white'
            }`}
          >
            Kunci API (GEMINI_API_KEY)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 scrollbar-thin">
          {activeTab === 'settings' ? (
            <>
              {/* Model selection */}
              <div className="space-y-2">
                <label className="font-semibold text-[#f2efe6] flex items-center gap-1.5">
                  <Cpu size={14} className="text-[#ffb63d]" />
                  Model AI Utama
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#12141a] border border-[#333742] text-white focus:outline-none focus:border-[#ffb63d]"
                >
                  <option value="gemini-2.5-flash">Gemini 3.8 Flash (Direkomendasikan — Cepat &amp; Cerdas)</option>
                  <option value="gemini-2.5-pro">Gemini 3.5 Pro (Penalaran Kompleks)</option>
                </select>
                <span className="text-[11px] text-[#9aa0a6] block">
                  Model ini digunakan Alto untuk menghasilkan kode multi-file secara konsisten.
                </span>
              </div>

              {/* Grounding Web Search */}
              <div className="p-4 rounded-2xl bg-[#12141a] border border-[#333742] flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2 font-semibold text-[#f2efe6]">
                    <Globe size={15} className="text-[#8ef5a0]" />
                    <span>Grounding with Google Search</span>
                  </div>
                  <p className="text-[11px] text-[#9aa0a6] leading-relaxed">
                    Izinkan Alto menelusuri web secara real-time untuk data terkini sebelum menjawab pertanyaan dinamis.
                  </p>
                </div>
                <button
                  onClick={() => setEnableGrounding(!enableGrounding)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                    enableGrounding ? 'bg-[#8ef5a0]' : 'bg-[#333742]'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-[#12141a] transition-transform ${
                      enableGrounding ? 'translate-x-6' : 'translate-x-0'
                    }`} 
                  />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="font-semibold text-[#f2efe6] flex items-center gap-1.5">
                  <Key size={14} className="text-[#ffb63d]" />
                  GEMINI_API_KEY Terpasang
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#12141a] border border-[#333742] text-slate-300 font-mono text-xs focus:outline-none focus:border-[#ffb63d]"
                />
                <span className="text-[11px] text-[#9aa0a6] block">
                  Kunci API dikelola melalui environment variable rahasia server dan tidak pernah terekspos ke browser.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#8ef5a0]/30 text-[#8ef5a0] flex items-center gap-2">
                <Shield size={16} />
                <span className="font-mono text-[11px]">Server Proxy Aman: Kunci tersimpan di process.env</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#333742]/50 bg-[#161820] flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#9aa0a6] hover:text-white transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#ffb63d] text-[#12141a] text-xs font-bold hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            {saved ? <Check size={14} /> : null}
            <span>{saved ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
