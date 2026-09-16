import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  CheckCircle2, 
  FileCheck, 
  AlertCircle,
  Wand2,
  RefreshCw,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Trash2,
  ExternalLink,
  Search,
  GitBranch,
  X
} from 'lucide-react';
import { ChatMessage, ChatAttachment, AIConfig, ProjectFile } from '../types';
import { AltoLogoMark } from './AltoLogo';

export const DEFAULT_ALTO_SYSTEM_PROMPT = `# System Prompt — Hai Alto

## Identitas
Nama kamu Alto. Kamu adalah AI di dalam produk Kodein, sebuah ruang kerja yang menggabungkan chat, penulisan kode, pencarian informasi, dan preview langsung dalam satu tempat. Kamu menyapa dengan hangat dan santai, contoh: "Hai, aku Alto 👋".

## Kemampuan inti
1. Menulis & menjalankan kode — kamu bisa menulis kode di berbagai bahasa, menjelaskan logikanya secara singkat, dan hasilnya langsung tampil sebagai preview interaktif (bukan cuma teks).
2. Mencari sumber informasi — kalau pengguna butuh data, referensi, atau fakta terkini, kamu mencarinya di web dulu sebelum menjawab, lalu menyebutkan sumbernya. Kamu tidak menebak-nebak data yang bisa berubah (harga, versi software, berita terbaru, dsb).
3. Terhubung ke tools eksternal — GitHub, GitLab, Vercel, dan layanan lain bisa disambungkan lewat akun pengguna, supaya kode bisa langsung di-push, di-deploy, atau ditarik dari repo yang sudah ada.
4. Menerima file & gambar — pengguna bisa mengunggah screenshot, foto UI, atau file data, dan kamu memakainya sebagai konteks kerja.

## Gaya komunikasi
- Bahasa Indonesia sehari-hari, ramah, langsung ke inti — hindari jargon berlebihan kecuali penggunanya teknikal.
- Kalau menulis kode: kasih penjelasan singkat dulu, baru kodenya, biar bisa langsung di-preview.
- Kalau mencari info: ringkas temuannya, sebutkan sumber, dan jangan berlebihan mengutip teks asli.
- Kalau permintaan nggak jelas: ambil asumsi yang masuk akal dan tetap kerjakan, baru tanya kalau memang penting banget.

## Batasan
- Tidak berpura-pura tahu sesuatu yang sifatnya bisa berubah (harga, versi, current events) tanpa mencari dulu.
- Tidak mengeksekusi kode berbahaya atau membantu hal yang bisa merugikan pengguna atau orang lain.
- Transparan kalau suatu fitur (misal koneksi ke tools tertentu) belum tersedia atau masih dalam tahap demo.`;

interface AIAssistantProps {
  messages: ChatMessage[];
  onSendMessage: (prompt: string, config: AIConfig, attachments?: ChatAttachment[]) => Promise<void>;
  isGenerating: boolean;
  activeFile: ProjectFile | null;
  onApplyChanges?: (filePath: string, newContent: string) => void;
  onClose?: () => void;
  onOpenToolsModal?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  messages,
  onSendMessage,
  isGenerating,
  activeFile,
  onApplyChanges,
  onClose,
  onOpenToolsModal
}) => {
  const [promptText, setPromptText] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [config, setConfig] = useState<AIConfig>({
    model: 'gemini-3.8-flash',
    temperature: 0.2,
    systemInstruction: DEFAULT_ALTO_SYSTEM_PROMPT
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();

      if (isImage) {
        reader.onload = (event) => {
          const base64Data = event.target?.result as string;
          setAttachments(prev => [
            ...prev,
            {
              name: file.name,
              type: file.type,
              data: base64Data,
              size: file.size
            }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = (event) => {
          const textData = event.target?.result as string;
          setAttachments(prev => [
            ...prev,
            {
              name: file.name,
              type: file.type || 'text/plain',
              data: textData,
              size: file.size
            }
          ]);
        };
        reader.readAsText(file);
      }
    });

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!promptText.trim() && attachments.length === 0) || isGenerating) return;
    const p = promptText;
    const currentAtts = [...attachments];
    setPromptText('');
    setAttachments([]);
    onSendMessage(p, config, currentAtts);
  };

  const handleQuickPrompt = (text: string) => {
    if (isGenerating) return;
    onSendMessage(text, config);
  };

  return (
    <div className="w-full sm:w-80 lg:w-96 max-w-full bg-[#161718] border-l border-[#282a2c] flex flex-col h-full select-none shadow-2xl sm:shadow-none">
      {/* Header */}
      <div className="h-12 px-3 bg-[#131314] border-b border-[#282a2c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AltoLogoMark size={22} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-tight">Alto</span>
              <span className="text-[10px] text-[#9aa0a6]">di</span>
              <span className="text-xs font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Kodein</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gradient-to-r from-sky-500/20 to-purple-500/20 text-[#8ab4f8] border border-[#282a2c]">
                AI
              </span>
            </div>
            <div className="text-[10px] text-[#9aa0a6] leading-none">
              Chat &bull; Kode &bull; Info &bull; Preview
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onOpenToolsModal && (
            <button
              onClick={onOpenToolsModal}
              className="p-1.5 rounded text-xs transition flex items-center gap-1 text-[#9aa0a6] hover:text-white hover:bg-[#282a2c]"
              title="Koneksi Tools Eksternal (GitHub, GitLab, Vercel)"
            >
              <GitBranch className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[10px] hidden xs:inline">Tools</span>
            </button>
          )}

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-1.5 rounded text-xs transition flex items-center gap-1 ${
              showConfig ? 'bg-[#282a2c] text-[#8ab4f8]' : 'text-[#9aa0a6] hover:text-white'
            }`}
            title="Pengaturan Parameter AI (Temperature & System Instruction)"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden xs:inline">Setelan</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#282a2c] text-[#9aa0a6] hover:text-white rounded transition ml-1"
              title="Tutup Panel Alto AI"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Model Config Panel (Collapsible) */}
      {showConfig && (
        <div className="p-3 bg-[#1a1b1d] border-b border-[#282a2c] text-xs space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#9aa0a6] flex-none">Model AI</span>
            <select
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="font-mono text-[#8ab4f8] bg-[#131314] px-2 py-1 rounded border border-[#282a2c] text-xs focus:outline-none focus:border-[#8ab4f8] cursor-pointer"
            >
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (Utama)</option>
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Cepat & Tahan Lonjakan)</option>
              <option value="gemini-flash-latest">Gemini Flash (Versi Terbaru)</option>
            </select>
          </div>
          <div className="text-[10px] text-[#71767b] leading-tight">
            * Dilengkapi sistem failover otomatis: jika terjadi lonjakan beban (503), Alto otomatis mengalihkan ke model berkapasitas tinggi tanpa gangguan.
          </div>

          <div>
            <div className="flex justify-between text-[#9aa0a6] mb-1">
              <span>Temperature</span>
              <span className="font-mono text-white">{config.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full accent-[#8ab4f8]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#9aa0a6]">Instruksi Sistem (Alto)</span>
              <button
                type="button"
                onClick={() => setConfig({ ...config, systemInstruction: DEFAULT_ALTO_SYSTEM_PROMPT })}
                className="text-[10px] text-[#8ab4f8] hover:underline"
              >
                Reset ke Default
              </button>
            </div>
            <textarea
              value={config.systemInstruction}
              onChange={(e) => setConfig({ ...config, systemInstruction: e.target.value })}
              rows={3}
              className="w-full p-2 bg-[#131314] border border-[#282a2c] rounded text-[11px] text-[#c4c7c5] font-mono focus:outline-none focus:border-[#8ab4f8] resize-none"
            />
          </div>
        </div>
      )}

      {/* Active Context Chip */}
      <div className="px-3 py-1.5 bg-[#18191a] border-b border-[#282a2c] flex items-center justify-between text-[11px] text-[#9aa0a6]">
        <div className="flex items-center gap-1.5 truncate">
          <Code2 className="w-3.5 h-3.5 text-[#8ab4f8]" />
          <span className="truncate">Konteks: <strong className="text-[#e3e3e3]">{activeFile?.name || 'Semua Berkas'}</strong></span>
        </div>
        <span className="text-emerald-400 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Alto Aktif
        </span>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#121316] border border-[#282a2c] flex items-center justify-center flex-none mt-0.5 shadow-sm">
                <AltoLogoMark size={18} />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#1a73e8] text-white'
                  : 'bg-[#1e1f20] text-[#e3e3e3] border border-[#282a2c]'
              }`}
            >
              {/* Attachments if any */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {msg.attachments.map((att, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/10 text-[10px]">
                      {att.type.startsWith('image/') ? (
                        <img src={att.data} alt={att.name} className="w-5 h-5 rounded object-cover" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-sky-300" />
                      )}
                      <span className="truncate max-w-[120px]">{att.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Modified Files Badges */}
              {msg.modifiedFiles && msg.modifiedFiles.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[#282a2c] space-y-1">
                  <span className="text-[10px] text-[#9aa0a6] block font-semibold uppercase tracking-wider">
                    Berkas Diperbarui oleh Alto:
                  </span>
                  {msg.modifiedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                    >
                      <FileCheck className="w-3 h-3" />
                      <span>{f.path}</span>
                      <span className="text-[9px] text-emerald-300 capitalize">({f.action})</span>
                    </div>
                  ))}
                </div>
              )}

              <div className={`text-[9px] mt-1.5 text-right ${msg.role === 'user' ? 'text-blue-200' : 'text-[#9aa0a6]'}`}>
                {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-none text-[10px] font-bold text-white mt-0.5">
                S
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 p-3 bg-[#1e1f20] rounded-xl border border-[#282a2c] text-[#8ab4f8]">
            <AltoLogoMark size={16} />
            <span className="text-xs animate-pulse">Alto sedang menganalisis & menyiapkan jawaban...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts categorized by Alto 4 Core Capabilities */}
      <div className="p-2 border-t border-[#282a2c] bg-[#131314]/80">
        <div className="text-[10px] text-[#9aa0a6] mb-1 font-medium flex items-center justify-between">
          <span>4 Kemampuan Inti Alto:</span>
          <span className="text-[#71767b] text-[9px]">Kode • Info • Tools • Berkas</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {/* 1. Menulis & menjalankan kode */}
          <button
            onClick={() => handleQuickPrompt('Buat game arcade retro lengkap dengan score, efek suara, kontrol sentuh dan keyboard')}
            className="col-span-2 px-2 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 hover:text-white border border-emerald-500/30 text-[10px] transition text-left truncate flex items-center gap-1.5"
            title="1. Menulis & menjalankan kode (preview langsung)"
          >
            <span className="text-emerald-400 text-[11px]">⚡</span>
            <span className="truncate font-semibold">Tulis & Jalankan Kode Game Interaktif</span>
          </button>

          {/* 2. Mencari sumber informasi */}
          <button
            onClick={() => handleQuickPrompt('Cari info dan dokumentasi terkini tentang fitur Tailwind CSS v4 beserta sumbernya')}
            className="px-2 py-1 rounded bg-[#1e1f20] hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white border border-[#282a2c] text-[10px] transition text-left truncate flex items-center gap-1"
            title="2. Mencari data & fakta terkini dengan sumber jelas"
          >
            <Search className="w-3 h-3 text-sky-400 flex-none" />
            <span className="truncate">Cari Info & Sumber Web</span>
          </button>

          {/* 3. Terhubung ke tools eksternal */}
          <button
            onClick={() => handleQuickPrompt('Bagaimana status koneksi GitHub, GitLab, dan Vercel di ruang kerja Kodein?')}
            className="px-2 py-1 rounded bg-[#1e1f20] hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white border border-[#282a2c] text-[10px] transition text-left truncate flex items-center gap-1"
            title="3. Terhubung ke GitHub, GitLab, Vercel"
          >
            <GitBranch className="w-3 h-3 text-purple-400 flex-none" />
            <span className="truncate">Tools Eksternal & Repo</span>
          </button>

          {/* Feature: Dark/Light Mode */}
          <button
            onClick={() => handleQuickPrompt('Tambahkan tombol pemilih mode tema gelap/terang ke preview')}
            className="px-2 py-1 rounded bg-[#1e1f20] hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white border border-[#282a2c] text-[10px] transition text-left truncate flex items-center gap-1"
          >
            <span className="text-teal-400 text-[10px]">🌓</span>
            <span className="truncate">Mode Gelap / Terang</span>
          </button>

          {/* Feature: Calculator Card */}
          <button
            onClick={() => handleQuickPrompt('Buatkan kartu kalkulator modern di dalam antarmuka preview')}
            className="px-2 py-1 rounded bg-[#1e1f20] hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white border border-[#282a2c] text-[10px] transition text-left truncate flex items-center gap-1"
          >
            <span className="text-pink-400 text-[10px]">🧮</span>
            <span className="truncate">Kalkulator Ringkas</span>
          </button>
        </div>
      </div>

      {/* Uploaded attachments preview strip */}
      {attachments.length > 0 && (
        <div className="px-2.5 py-1.5 bg-[#18191a] border-t border-[#282a2c] flex items-center gap-2 overflow-x-auto">
          {attachments.map((att, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#282a2c] border border-slate-700 text-xs text-slate-200 flex-none">
              {att.type.startsWith('image/') ? (
                <img src={att.data} alt={att.name} className="w-4 h-4 rounded object-cover" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-sky-400" />
              )}
              <span className="text-[11px] truncate max-w-[100px]">{att.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(idx)}
                className="text-slate-400 hover:text-rose-400 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Form with File & Image upload */}
      <form onSubmit={handleSubmit} className="p-2.5 pb-3 sm:pb-2.5 border-t border-[#282a2c] bg-[#131314]">
        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          multiple 
          accept="image/*,.json,.csv,.txt,.js,.html,.css,.md" 
          className="hidden" 
        />

        <div className="flex items-center gap-1.5 bg-[#1e1f20] px-2.5 py-1.5 rounded-xl border border-[#282a2c] focus-within:border-[#8ab4f8] transition">
          {/* File upload trigger */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-sky-400 hover:bg-[#282a2c] transition flex-none"
            title="Unggah berkas, screenshot UI, atau foto (Kemampuan 4)"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Tanya Alto: kode, cari info, preview..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={isGenerating}
            className="flex-1 bg-transparent text-sm sm:text-xs text-white focus:outline-none placeholder:text-[#9aa0a6]"
          />

          <button
            type="submit"
            disabled={(!promptText.trim() && attachments.length === 0) || isGenerating}
            className="p-2 sm:p-1.5 rounded-lg bg-gradient-to-r from-[#1a73e8] to-[#9333ea] hover:opacity-90 disabled:opacity-40 text-white transition shadow-sm flex-none active:scale-95"
            title="Kirim ke Alto"
          >
            <Send className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};

