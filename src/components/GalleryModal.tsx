import React from 'react';
import { X, Sparkles, ArrowRight, Layout, BarChart3, Database, Gamepad2, Globe } from 'lucide-react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (prompt: string) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate
}) => {
  if (!isOpen) return null;

  const templates = [
    {
      id: 'landing',
      title: 'Landing Page Produk SaaS',
      desc: 'Halaman promosi produk modern dengan hero banner, fitur interaktif, kartu harga bulanan/tahunan, dan formulir pendaftaran.',
      icon: Globe,
      accent: '#ffb63d',
      prompt: 'Bikinkan saya landing page produk modern untuk aplikasi Kodein dengan tema gelap, hero banner persuasif, fitur interaktif, dan kartu harga dengan switch bulanan/tahunan.'
    },
    {
      id: 'dashboard',
      title: 'Dashboard Admin & Analitik',
      desc: 'Dasbor operasional lengkap dengan kartu metrik real-time, grafik performa AI, dan tabel filter pengguna aktif.',
      icon: BarChart3,
      accent: '#8ef5a0',
      prompt: 'Bikinkan saya dashboard admin interaktif dengan tema gelap, metrik pendapatan, grafik latensi AI, tabel daftar pengguna dengan fitur pencarian real-time.'
    },
    {
      id: 'api',
      title: 'REST API Tester & Explorer',
      desc: 'Alat pengujian mock API sederhana dengan method GET/POST/DELETE, respons status code dinamis, dan live JSON viewer.',
      icon: Database,
      accent: '#ffb63d',
      prompt: 'Bikinkan saya REST API explorer sederhana dengan tester endpoint GET /users, POST /users, live response preview JSON, dan status code badges.'
    },
    {
      id: 'game',
      title: 'Retro Arcade Game (Snake/Ular)',
      desc: 'Permainan klasik Snake retro responsif dengan kontrol keyboard panah/WASD, sistem skor tinggi, efek visual neon, dan tombol restart.',
      icon: Gamepad2,
      accent: '#8ef5a0',
      prompt: 'Bikinkan saya game retro Snake/ular lengkap dengan kontrol keyboard panah/WASD, skor, buah bonus, dan tampilan game over interaktif.'
    },
    {
      id: 'research',
      title: 'Research Hub & Ringkasan Sumber',
      desc: 'Laporan riset faktual dengan kesimpulan eksekutif dan kartu rujukan terverifikasi menggunakan grounding web search.',
      icon: Layout,
      accent: '#ffb63d',
      prompt: 'Riset & rangkum sumber informasi terkini mengenai keunggulan full-stack coding workspace berbasis AI, grounding web search, dan keamanan sandboxing lengkap dengan rujukan terverifikasi.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        id="gallery-modal-container"
        className="w-full max-w-3xl bg-[#161820] border border-[#333742] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#333742] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffb63d]/15 text-[#ffb63d] flex items-center justify-center border border-[#ffb63d]/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#f2efe6]">
                Galeri Template Kodein
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Pilih inspirasi proyek siap pakai. Alto akan langsung membuatkan dan merendernya untukmu.
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

        {/* Gallery Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 scrollbar-thin">
          {templates.map(tmpl => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.id}
                onClick={() => {
                  onApplyTemplate(tmpl.prompt);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-[#12141a] border border-[#333742] hover:border-[#ffb63d]/60 hover:bg-[#1b1e26]/80 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: `${tmpl.accent}18`, color: tmpl.accent }}
                    >
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] font-mono text-[#9aa0a6] uppercase tracking-wider">Template</span>
                  </div>
                  <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#f2efe6] group-hover:text-[#ffb63d] transition-colors">
                    {tmpl.title}
                  </h4>
                  <p className="text-xs text-[#9aa0a6] leading-relaxed mt-1">
                    {tmpl.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#333742]/40 flex items-center justify-between text-xs font-semibold text-[#ffb63d]">
                  <span>Gunakan Template Ini</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#333742]/50 bg-[#161820] flex items-center justify-between text-xs text-[#9aa0a6]">
          <span>Semua template kompatibel dengan Live Preview dan ekspor ZIP</span>
          <span className="font-mono text-[#8ef5a0]">5 Template Siap Pakai</span>
        </div>
      </div>
    </div>
  );
};
