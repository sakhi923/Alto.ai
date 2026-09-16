import React from 'react';
import { X, BookOpen, Code, Search, ExternalLink, Image, Sparkles } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        id="docs-modal-container"
        className="w-full max-w-2xl bg-[#161820] border border-[#333742] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#333742] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffb63d]/15 text-[#ffb63d] flex items-center justify-center border border-[#ffb63d]/30">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#f2efe6]">
                Dokumentasi &amp; Panduan Alto
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Pelajari cara memaksimalkan kemampuan Alto di ruang kerja Kodein
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed scrollbar-thin">
          {/* Section 1: Menulis & Menjalankan Kode */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#12141a] border border-[#333742]">
            <div className="flex items-center gap-2 text-[#ffb63d] font-bold text-sm">
              <Code size={16} />
              <h4 className="font-['Space_Grotesk']">1. Menulis &amp; Menjalankan Kode</h4>
            </div>
            <p>
              Alto otomatis memisahkan berkas HTML, CSS, dan JavaScript secara terstruktur. Kode yang dihasilkan langsung dikompilasi ke panel <strong>Live Preview</strong> di sisi kanan secara real-time tanpa perlu me-reload seluruh halaman.
            </p>
            <div className="p-2.5 rounded-xl bg-[#161820] border border-[#333742]/50 font-mono text-[11px] text-[#8ef5a0]">
              Contoh prompt: "Bikinkan kalkulator diskon dengan slider interaktif dan riwayat perhitungan."
            </div>
          </div>

          {/* Section 2: Grounding with Google Search */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#12141a] border border-[#333742]">
            <div className="flex items-center gap-2 text-[#8ef5a0] font-bold text-sm">
              <Search size={16} />
              <h4 className="font-['Space_Grotesk']">2. Mencari Sumber Informasi (Web Grounding)</h4>
            </div>
            <p>
              Jika kamu membutuhkan fakta terkini, dokumentasi library versi terbaru, atau referensi harga, Alto menelusuri web terlebih dahulu sebelum menjawab dan menyertakan sitasi sumber.
            </p>
            <div className="p-2.5 rounded-xl bg-[#161820] border border-[#333742]/50 font-mono text-[11px] text-[#8ef5a0]">
              Catatan: Fitur ini terhubung ke Google Search Grounding untuk memastikan data selalu akurat.
            </div>
          </div>

          {/* Section 3: Menerima File & Gambar */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#12141a] border border-[#333742]">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Image size={16} />
              <h4 className="font-['Space_Grotesk']">3. Menerima File &amp; Gambar UI</h4>
            </div>
            <p>
              Kamu bisa mengunggah screenshot desain web, sketsa wireframe, atau foto inspirasi lewat tombol <strong>Lampirkan</strong>. Alto akan membaca elemen visual tersebut dan langsung mengonversinya menjadi kode nyata.
            </p>
          </div>

          {/* Section 4: Riwayat Percakapan */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#12141a] border border-[#333742]">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Sparkles size={16} />
              <h4 className="font-['Space_Grotesk']">4. Riwayat Percakapan Tersimpan Otomatis</h4>
            </div>
            <p>
              Setiap kali kamu berdiskusi dengan Alto, sesi percakapan disimpan ke database lokal server. Kamu bisa membuka kembali sesi sebelumnya kapan saja melalui menu <strong>Riwayat</strong> di sidebar.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#333742]/50 bg-[#161820] flex items-center justify-between text-xs text-[#9aa0a6]">
          <span>Dokumentasi Kodein v2.4</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#333742] text-white hover:bg-[#404552] transition-colors"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
