import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Paperclip, 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  X, 
  RefreshCw, 
  ExternalLink, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Code2, 
  Eye, 
  Columns, 
  FileCode, 
  Copy, 
  Check, 
  Download,
  AlertCircle,
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ProjectFile, ChatMessage, ChatAttachment, DeviceViewport, ViewMode } from '../types';

interface MainAreaProps {
  sidebarOpen: boolean;
  messages: ChatMessage[];
  files: ProjectFile[];
  activeFile: ProjectFile | null;
  onSelectFile: (id: string) => void;
  onUpdateFileContent: (id: string, newContent: string) => void;
  isGenerating: boolean;
  onSendMessage: (text: string, attachments: ChatAttachment[]) => void;
  onResetSession: () => void;
  sessionTitle: string;
}

export const MainArea: React.FC<MainAreaProps> = ({
  sidebarOpen,
  messages,
  files,
  activeFile,
  onSelectFile,
  onUpdateFileContent,
  isGenerating,
  onSendMessage,
  onResetSession,
  sessionTitle
}) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [viewport, setViewport] = useState<DeviceViewport>('responsive');
  const [refreshKey, setRefreshKey] = useState(0);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [forceWorkspaceView, setForceWorkspaceView] = useState(false);
  const [previewError, setPreviewError] = useState<{ message: string; source?: string; line?: number } | null>(null);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<string>('index.html');
  const [autoReloadActive, setAutoReloadActive] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stickyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stickyFileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-reload mechanism: detect any file content or path change
  const filesFingerprint = useMemo(() => {
    return files.map(f => `${f.path}:${f.content?.length || 0}:${f.updatedAt || ''}`).join('|');
  }, [files]);

  const lastFingerprintRef = useRef(filesFingerprint);

  useEffect(() => {
    if (autoReloadActive && filesFingerprint !== lastFingerprintRef.current) {
      lastFingerprintRef.current = filesFingerprint;
      setPreviewError(null);
      setIsReloading(true);
      const timer = setTimeout(() => {
        setRefreshKey(k => k + 1);
        setIsReloading(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [filesFingerprint, autoReloadActive]);

  // Listen for runtime errors emitted by the preview iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'KODEIN_PREVIEW_ERROR') {
        console.warn('Iframe Preview Error caught:', e.data);
        setPreviewError({
          message: e.data.message || 'Script runtime error',
          source: e.data.source || 'inline',
          line: e.data.line
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Adjust textarea heights automatically
  const handleInputResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  };

  // 4 Pill suggestions from user specification
  const pills = [
    { label: 'Bikin landing page produk', prompt: 'Bikinkan saya landing page produk modern untuk aplikasi Kodein dengan tema gelap, hero banner persuasif, fitur interaktif, dan kartu harga dengan switch bulanan/tahunan.' },
    { label: 'Bikin dashboard admin', prompt: 'Bikinkan saya dashboard admin interaktif dengan tema gelap, metrik pendapatan, grafik latensi AI, tabel daftar pengguna dengan fitur pencarian real-time.' },
    { label: 'Bikin API sederhana', prompt: 'Bikinkan saya REST API explorer sederhana dengan tester endpoint GET /users, POST /users, live response preview JSON, dan status code badges.' },
    { label: 'Riset & rangkum sumber', prompt: 'Riset & rangkum sumber informasi terkini mengenai keunggulan full-stack coding workspace berbasis AI, grounding web search, dan keamanan sandboxing lengkap dengan rujukan terverifikasi.' }
  ];

  // Handle file uploads (images & code documents)
  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const filesList = Array.from(selectedFiles) as File[];
    filesList.forEach((file: File) => {
      const reader = new FileReader();
      const isImg = file.type.startsWith('image/');

      if (isImg) {
        reader.onload = () => {
          setAttachments(prev => [
            ...prev,
            {
              name: file.name,
              type: file.type,
              data: reader.result as string,
              size: file.size
            }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = () => {
          setAttachments(prev => [
            ...prev,
            {
              name: file.name,
              type: file.type || 'text/plain',
              data: reader.result as string,
              size: file.size
            }
          ]);
        };
        reader.readAsText(file);
      }
    });

    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Voice recording with SpeechRecognition API fallback
  const toggleVoiceRecording = () => {
    setRecordingError(null);
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecordingError('Browser tidak mendukung Speech Recognition API. Coba ketik teks langsung.');
      setTimeout(() => setRecordingError(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputText(prev => (prev ? prev + ' ' : '') + transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setRecordingError('Izin mikrofon ditolak oleh browser.');
        } else {
          setRecordingError('Gagal mendengarkan suara: ' + event.error);
        }
        setTimeout(() => setRecordingError(null), 4000);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsRecording(false);
      setRecordingError('Gagal mengaktifkan mikrofon.');
      setTimeout(() => setRecordingError(null), 4000);
    }
  };

  // Handle Form Submit
  const handleSend = () => {
    const text = inputText.trim();
    if ((!text && attachments.length === 0) || isGenerating) return;

    onSendMessage(text, attachments);
    setInputText('');
    setAttachments([]);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (stickyTextareaRef.current) {
      stickyTextareaRef.current.style.height = 'auto';
    }
  };

  // Pill click handler
  const handlePillClick = (prompt: string) => {
    setInputText(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
      handleInputResize(textareaRef.current);
    }
  };

  // Live Preview HTML builder
  const buildPreviewSrcDoc = () => {
    // Find active preview HTML file or fallback to index.html
    const htmlFile = files.find(f => f.path === selectedPreviewFile || f.name === selectedPreviewFile) ||
                     files.find(f => f.path === 'index.html' || f.name === 'index.html') ||
                     files.find(f => f.path.endsWith('.html'));
    const cssFile = files.find(f => f.path === 'style.css' || f.name === 'style.css');
    const jsFile = files.find(f => f.path === 'app.js' || f.name === 'app.js');

    let html = htmlFile?.content;
    
    if (!html) {
      return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pratinjau Belum Tersedia</title>
  <style>
    body { margin: 0; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif; background: #0b0d13; color: #f2efe6; text-align: center; }
    .box { max-width: 480px; margin: 0 auto; background: #161820; border: 1px solid #333742; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h2 { color: #ffb63d; margin-top: 0; }
    p { color: #9aa0a6; font-size: 14px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="box">
    <h2>Belum Ada Berkas HTML</h2>
    <p>Berkas <code>index.html</code> belum ditemukan. Tulis instruksi ke Alto di sisi kiri untuk membuat aplikasi atau dasbor.</p>
  </div>
</body>
</html>`;
    }

    const css = cssFile?.content || '';
    const js = jsFile?.content || '';

    // Base URL to guarantee relative assets resolve to host server
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const baseTag = origin ? `<base href="${origin}/">` : '';

    // Error capture script to catch runtime errors and send to parent
    const errorTrapScript = `
<script>
  window.onerror = function(msg, url, line, col, err) {
    try {
      var sourceName = url ? url.split('/').pop() : 'script';
      window.parent.postMessage({
        type: 'KODEIN_PREVIEW_ERROR',
        message: String(msg || 'Kesalahan rendering pada preview'),
        source: sourceName,
        line: line || 1
      }, '*');
    } catch(e) {}
    return false;
  };

  window.onunhandledrejection = function(e) {
    try {
      var reason = e.reason ? (e.reason.message || String(e.reason)) : 'Promise async error';
      window.parent.postMessage({
        type: 'KODEIN_PREVIEW_ERROR',
        message: 'Async Error: ' + reason,
        source: 'promise',
        line: 0
      }, '*');
    } catch(err) {}
  };
</script>`;

    // Inline CSS
    if (html.includes('<link rel="stylesheet" href="style.css">')) {
      html = html.replace('<link rel="stylesheet" href="style.css">', `<style data-file="style.css">\n${css}\n</style>`);
    } else if (css) {
      if (html.includes('</head>')) {
        html = html.replace('</head>', `<style data-file="style.css">\n${css}\n</style></head>`);
      } else {
        html = `<style data-file="style.css">\n${css}\n</style>` + html;
      }
    }

    // Inline JS with execution safety
    const safeJsBlock = `<script data-file="app.js">
try {
${js}
} catch (error) {
  console.error('Runtime error in app.js:', error);
  window.parent.postMessage({
    type: 'KODEIN_PREVIEW_ERROR',
    message: error.message || 'Gagal mengeksekusi app.js',
    source: 'app.js',
    line: 1
  }, '*');
}
</script>`;

    if (html.includes('<script src="app.js"></script>')) {
      html = html.replace('<script src="app.js"></script>', safeJsBlock);
    } else if (js) {
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${safeJsBlock}</body>`);
      } else {
        html = html + safeJsBlock;
      }
    }

    // Inject baseTag and errorTrapScript into head
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>\n${baseTag}\n${errorTrapScript}`);
    } else {
      html = `<head>\n${baseTag}\n${errorTrapScript}</head>\n` + html;
    }

    return html;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    });
  };

  const hasMessages = messages.length > 0;
  const showWorkspace = hasMessages || forceWorkspaceView;

  return (
    <div 
      id="kodein-main-area"
      className="min-h-full w-full flex flex-col bg-[#12141a] text-[#f2efe6]"
    >
      {/* Top Header Bar when conversation or workspace is active */}
      {showWorkspace ? (
        <header className="h-16 px-4 md:px-6 border-b border-[#333742]/60 bg-[#161820]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {forceWorkspaceView && !hasMessages && (
              <button
                onClick={() => setForceWorkspaceView(false)}
                title="Kembali ke layar utama"
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#9aa0a6] hover:text-white bg-[#1b1e26] border border-[#333742]/60 hover:border-[#ffb63d]/40 transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <span>← Layar Awal</span>
              </button>
            )}
            <span className="w-2.5 h-2.5 rounded-full bg-[#8ef5a0] animate-pulse flex-shrink-0"></span>
            <div className="flex flex-col min-w-0">
              <h1 className="font-['Space_Grotesk'] font-bold text-sm text-[#f2efe6] truncate">
                {sessionTitle || 'Alto Ops • Analytics & Admin Dashboard'}
              </h1>
              <span className="text-[11px] text-[#9aa0a6] font-mono flex items-center gap-1.5 truncate">
                <span className="text-[#ffb63d]">Gemini 3.8 Flash</span>
                <span>•</span>
                <span className="text-[#8ef5a0]">Auto-Reload Siap</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-[#1b1e26] border border-[#333742]/60">
              <button
                id="btn-view-split"
                onClick={() => setViewMode('split')}
                title="Tampilan Split (Chat & Preview)"
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'split' ? 'bg-[#333742] text-white shadow-sm' : 'text-[#9aa0a6] hover:text-white'
                }`}
              >
                <Columns size={13} />
                <span>Split</span>
              </button>
              <button
                id="btn-view-preview"
                onClick={() => setViewMode('preview')}
                title="Preview Penuh"
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'preview' ? 'bg-[#333742] text-white shadow-sm' : 'text-[#9aa0a6] hover:text-white'
                }`}
              >
                <Eye size={13} />
                <span>Preview</span>
              </button>
              <button
                id="btn-view-code"
                onClick={() => setViewMode('code')}
                title="Editor Kode"
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'code' ? 'bg-[#333742] text-white shadow-sm' : 'text-[#9aa0a6] hover:text-white'
                }`}
              >
                <Code2 size={13} />
                <span>Kode</span>
              </button>
            </div>

            {/* Responsive Viewport Switcher for Preview */}
            {(viewMode === 'split' || viewMode === 'preview') && (
              <div className="hidden md:flex items-center p-1 rounded-xl bg-[#1b1e26] border border-[#333742]/60">
                <button
                  onClick={() => setViewport('desktop')}
                  title="Desktop (100%)"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewport === 'desktop' ? 'bg-[#333742] text-[#ffb63d]' : 'text-[#9aa0a6] hover:text-white'
                  }`}
                >
                  <Monitor size={14} />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  title="Tablet (768px)"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewport === 'tablet' ? 'bg-[#333742] text-[#ffb63d]' : 'text-[#9aa0a6] hover:text-white'
                  }`}
                >
                  <Tablet size={14} />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  title="Mobile (390px)"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewport === 'mobile' ? 'bg-[#333742] text-[#ffb63d]' : 'text-[#9aa0a6] hover:text-white'
                  }`}
                >
                  <Smartphone size={14} />
                </button>
              </div>
            )}

            {/* Reload Preview */}
            <button
              id="btn-refresh-preview"
              onClick={() => setRefreshKey(k => k + 1)}
              title="Segarkan Preview"
              className="p-2 rounded-xl text-[#9aa0a6] hover:text-white hover:bg-[#1b1e26] border border-[#333742]/60 transition-colors"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </header>
      ) : null}

      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {!showWorkspace ? (
          /* ================= INITIAL HERO VIEW ================= */
          <div className="flex-1 flex flex-col items-center justify-center px-3 py-6 sm:px-8 sm:py-10 max-w-4xl mx-auto w-full box-border">
            {/* Title */}
            <div className="text-center mb-6 sm:mb-8 space-y-2 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1e26] border border-[#333742] text-[11px] sm:text-xs font-mono text-[#9aa0a6] mb-2 shadow-sm max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#8ef5a0] animate-pulse flex-shrink-0"></span>
                <span className="text-[#f2efe6] font-semibold truncate">Hai, aku Alto 👋</span>
                <span className="text-[#ffb63d] hidden xs:inline">• Workspace Aktif</span>
              </div>
              <h1 
                id="hero-title"
                className="font-['Space_Grotesk'] text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#f2efe6] tracking-tight leading-tight break-words px-1"
              >
                Bikin ide jadi kenyataan bareng <span className="text-[#ffb63d]">Alto</span>
              </h1>
              <p className="text-xs sm:text-base text-[#9aa0a6] max-w-xl mx-auto leading-relaxed px-1">
                Tuliskan ide aplikasi, landing page, dashboard, atau skrip kode. Alto akan menuliskan kodenya dan langsung menampilkan pratinjau interaktif.
              </p>
            </div>

            {/* Kotak Input Besar */}
            <div 
              id="big-prompt-container"
              className="w-full rounded-2xl bg-[#161820] border-2 border-[#333742] focus-within:border-[#ffb63d] transition-all p-4 shadow-2xl shadow-black/50 space-y-3"
            >
              {/* Attachment Preview Chips */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#333742]/50">
                  {attachments.map((att, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg bg-[#1b1e26] border border-[#ffb63d]/40 text-xs text-[#f2efe6]"
                    >
                      {att.type.startsWith('image/') ? (
                        <img src={att.data} alt="Thumbnail" className="w-5 h-5 rounded object-cover border border-[#333742]" />
                      ) : (
                        <FileCode size={14} className="text-[#ffb63d]" />
                      )}
                      <span className="truncate max-w-[140px] font-mono text-[11px]">{att.name}</span>
                      <button 
                        onClick={() => removeAttachment(idx)}
                        className="text-[#9aa0a6] hover:text-red-400 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Textarea */}
              <textarea
                id="big-prompt-input"
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  handleInputResize(e.target);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ceritain ide aplikasi atau kode yang kamu mau, biar Alto yang bikin..."
                rows={3}
                className="w-full bg-transparent text-sm sm:text-base text-[#f2efe6] placeholder-[#9aa0a6]/70 resize-none focus:outline-none leading-relaxed font-sans"
              />

              {/* Error badge if voice fails */}
              {recordingError && (
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                  <AlertCircle size={14} />
                  <span>{recordingError}</span>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-[#333742]/40">
                <div className="flex items-center gap-2">
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.txt,.json,.js,.ts,.html,.css,.md"
                    onChange={handleFilesSelect}
                    className="hidden"
                  />
                  {/* Tombol Lampirkan File */}
                  <button
                    id="btn-lampirkan-file"
                    onClick={() => fileInputRef.current?.click()}
                    title="Lampirkan file atau gambar UI"
                    className="p-2 rounded-xl text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26] border border-transparent hover:border-[#333742] transition-colors flex items-center gap-1.5 text-xs"
                  >
                    <Paperclip size={16} />
                    <span className="hidden sm:inline">Lampirkan</span>
                  </button>

                  {/* Tombol Input Suara */}
                  <button
                    id="btn-input-suara"
                    onClick={toggleVoiceRecording}
                    title={isRecording ? 'Hentikan rekaman' : 'Input suara (bicara langsung)'}
                    className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs ${
                      isRecording
                        ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                        : 'text-[#9aa0a6] hover:text-[#8ef5a0] hover:bg-[#1b1e26] border-transparent hover:border-[#333742]'
                    }`}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                    <span className="hidden sm:inline">
                      {isRecording ? 'Mendengarkan...' : 'Suara'}
                    </span>
                  </button>
                </div>

                {/* Tombol Kirim */}
                <button
                  id="btn-kirim-prompt"
                  onClick={handleSend}
                  disabled={(!inputText.trim() && attachments.length === 0) || isGenerating}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    (inputText.trim() || attachments.length > 0) && !isGenerating
                      ? 'bg-[#ffb63d] text-[#12141a] hover:brightness-110 active:scale-95 shadow-[#ffb63d]/25'
                      : 'bg-[#1b1e26] text-[#9aa0a6]/50 cursor-not-allowed border border-[#333742]/50'
                  }`}
                >
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Quick Live Preview Access Card */}
            <div className="w-full mt-4 p-3.5 rounded-2xl bg-[#161820] border border-[#333742] hover:border-[#ffb63d]/50 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#ffb63d]/15 text-[#ffb63d] flex items-center justify-center border border-[#ffb63d]/30 flex-shrink-0">
                  <Eye size={20} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>Pratinjau Proyek & Dasbor Aktif</span>
                    <span className="w-2 h-2 rounded-full bg-[#8ef5a0] animate-pulse"></span>
                    <span className="text-[10px] font-mono text-[#8ef5a0] bg-[#8ef5a0]/10 px-1.5 py-0.5 rounded border border-[#8ef5a0]/20">Auto-Reload Siap</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#9aa0a6] mt-0.5">
                    Lihat hasil dasbor analitik Alto Ops secara langsung atau edit kode
                  </p>
                </div>
              </div>
              <button
                id="btn-open-workspace"
                onClick={() => setForceWorkspaceView(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#ffb63d] text-[#12141a] font-bold text-xs hover:brightness-110 flex items-center justify-center gap-1.5 transition-all shadow-md flex-shrink-0"
              >
                <span>Buka Live Preview</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Baris Saran Cepat Berbentuk Pill */}
            <div className="w-full mt-5 space-y-2">
              <div className="text-center text-xs font-mono text-[#9aa0a6]">
                Atau coba saran cepat berikut:
              </div>
              <div 
                id="pill-suggestions-bar"
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1 px-2 w-full"
              >
                {pills.map((pill, idx) => (
                  <button
                    key={idx}
                    id={`pill-saran-${idx + 1}`}
                    onClick={() => handlePillClick(pill.prompt)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#161820] hover:bg-[#1b1e26] border border-[#333742] hover:border-[#ffb63d]/60 text-[11px] sm:text-xs text-[#f2efe6] font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center gap-1.5 text-center max-w-full"
                  >
                    <span className="text-[#ffb63d] flex-shrink-0">✦</span>
                    <span className="truncate">{pill.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ================= ACTIVE WORKSPACE VIEW ================= */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-64px)]">
            {/* Left Pane: Chat Conversation Stream */}
            <div className={`flex flex-col border-r border-[#333742]/60 bg-[#161820] transition-all ${
              viewMode === 'preview' ? 'hidden' : viewMode === 'code' ? 'w-full md:w-[380px]' : 'w-full md:w-1/2'
            }`}>
              {/* Chat Message List */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 scrollbar-thin">
                {/* Empty State when workspace is opened without prior messages */}
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4 my-auto">
                    <div className="w-12 h-12 rounded-2xl bg-[#ffb63d]/15 text-[#ffb63d] flex items-center justify-center border border-[#ffb63d]/30 shadow-md">
                      <Sparkles size={22} />
                    </div>
                    <div className="max-w-xs space-y-1">
                      <h3 className="font-['Space_Grotesk'] font-bold text-base text-white">
                        Alto Workspace Aktif
                      </h3>
                      <p className="text-xs text-[#9aa0a6] leading-relaxed">
                        Pratinjau langsung aktif di sebelah kanan. Ketik instruksi apa pun di bawah untuk mengubah tampilan atau menambah fitur.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-xs pt-2">
                      <button
                        onClick={() => handlePillClick('Ubah jadi dashboard admin analitik modern lengkap dengan metrik KPI, grafik pendapatan, dan status server')}
                        className="w-full text-left px-3 py-2 rounded-xl bg-[#1b1e26] hover:bg-[#20242e] border border-[#333742] text-xs text-[#f2efe6] hover:border-[#ffb63d]/50 transition-all flex items-center justify-between"
                      >
                        <span>📊 Jadikan Dashboard Admin</span>
                        <ArrowRight size={12} className="text-[#ffb63d]" />
                      </button>
                      <button
                        onClick={() => handlePillClick('Bikinkan landing page produk AI dengan hero section, fitur unggulan, dan kartu harga')}
                        className="w-full text-left px-3 py-2 rounded-xl bg-[#1b1e26] hover:bg-[#20242e] border border-[#333742] text-xs text-[#f2efe6] hover:border-[#ffb63d]/50 transition-all flex items-center justify-between"
                      >
                        <span>🚀 Jadikan Landing Page</span>
                        <ArrowRight size={12} className="text-[#ffb63d]" />
                      </button>
                    </div>
                  </div>
                )}
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {/* Header Role */}
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      {msg.role === 'user' ? (
                        <span className="text-[11px] font-mono text-[#9aa0a6]">Kamu</span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-[#ffb63d]/20 text-[#ffb63d] flex items-center justify-center font-bold text-[10px] font-mono border border-[#ffb63d]/30">
                            A
                          </span>
                          <span className="text-xs font-bold text-[#ffb63d] font-['Space_Grotesk']">Alto</span>
                          <span className="text-[10px] text-[#9aa0a6] font-mono">• Kodein Assistant</span>
                        </div>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div 
                      className={`max-w-[92%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#1b1e26] border border-[#ffb63d]/30 text-[#f2efe6] shadow-md'
                          : 'bg-[#12141a] border border-[#333742] text-slate-200 shadow-xl space-y-3'
                      }`}
                    >
                      {/* Attachments if any */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 pb-2 mb-2 border-b border-[#333742]/50">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="rounded-lg overflow-hidden border border-[#333742] bg-[#161820]">
                              {att.type.startsWith('image/') ? (
                                <img src={att.data} alt={att.name} className="max-w-[200px] max-h-[140px] object-cover" />
                              ) : (
                                <div className="p-2 flex items-center gap-2 font-mono text-xs">
                                  <FileCode size={14} className="text-[#ffb63d]" />
                                  <span>{att.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Content Text with line breaks */}
                      <div className="whitespace-pre-wrap break-words">
                        {msg.content}
                      </div>

                      {/* Modified Files indicator */}
                      {msg.modifiedFiles && msg.modifiedFiles.length > 0 && (
                        <div className="pt-3 border-t border-[#333742]/60 space-y-1.5">
                          <span className="text-[11px] font-mono font-bold text-[#8ef5a0] flex items-center gap-1">
                            <Check size={13} />
                            Berkas langsung diperbarui di Live Preview:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.modifiedFiles.map((mf, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#8ef5a0]/15 border border-[#8ef5a0]/30 text-[#8ef5a0] font-semibold"
                              >
                                {mf.path}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Generating Loading State */}
                {isGenerating && (
                  <div className="flex flex-col items-start space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#ffb63d]/20 text-[#ffb63d] flex items-center justify-center font-bold text-[10px] font-mono">
                        A
                      </span>
                      <span className="text-xs font-bold text-[#ffb63d]">Alto sedang merespons...</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#12141a] border border-[#ffb63d]/40 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#ffb63d] animate-ping"></span>
                      <span className="text-xs text-[#9aa0a6] font-mono">
                        Menulis kode, menautkan logika, dan menyusun preview...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Sticky Chat Prompt Input Box */}
              <div className="p-3 sm:p-4 border-t border-[#333742]/60 bg-[#161820]">
                {/* Attachment Preview Chips */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pb-2">
                    {attachments.map((att, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg bg-[#1b1e26] border border-[#ffb63d]/40 text-xs text-[#f2efe6]"
                      >
                        {att.type.startsWith('image/') ? (
                          <img src={att.data} alt="Thumbnail" className="w-5 h-5 rounded object-cover" />
                        ) : (
                          <FileCode size={14} className="text-[#ffb63d]" />
                        )}
                        <span className="truncate max-w-[120px] font-mono text-[11px]">{att.name}</span>
                        <button onClick={() => removeAttachment(idx)} className="text-[#9aa0a6] hover:text-red-400">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-xl bg-[#12141a] border border-[#333742] focus-within:border-[#ffb63d] transition-all p-2.5 flex flex-col gap-2">
                  <textarea
                    ref={stickyTextareaRef}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      handleInputResize(e.target);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Minta Alto mengubah desain, tambah fitur, atau jelaskan..."
                    rows={2}
                    className="w-full bg-transparent text-xs sm:text-sm text-[#f2efe6] placeholder-[#9aa0a6]/70 resize-none focus:outline-none"
                  />

                  <div className="flex items-center justify-between pt-1 border-t border-[#333742]/30">
                    <div className="flex items-center gap-1.5">
                      <input
                        ref={stickyFileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.txt,.json,.js,.ts,.html,.css"
                        onChange={handleFilesSelect}
                        className="hidden"
                      />
                      <button
                        onClick={() => stickyFileInputRef.current?.click()}
                        title="Lampirkan file atau screenshot"
                        className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-[#f2efe6] hover:bg-[#1b1e26] transition-colors"
                      >
                        <Paperclip size={15} />
                      </button>
                      <button
                        onClick={toggleVoiceRecording}
                        title={isRecording ? 'Hentikan rekaman' : 'Input suara'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isRecording ? 'text-red-400 bg-red-500/20' : 'text-[#9aa0a6] hover:text-[#8ef5a0]'
                        }`}
                      >
                        {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
                      </button>
                    </div>

                    <button
                      onClick={handleSend}
                      disabled={(!inputText.trim() && attachments.length === 0) || isGenerating}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        (inputText.trim() || attachments.length > 0) && !isGenerating
                          ? 'bg-[#ffb63d] text-[#12141a] hover:brightness-110'
                          : 'bg-[#1b1e26] text-[#9aa0a6]/50 cursor-not-allowed'
                      }`}
                    >
                      <span>Kirim</span>
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Pane: Live Preview or Code Editor */}
            <div className={`flex-1 flex flex-col bg-[#12141a] overflow-hidden ${
              viewMode === 'code' ? 'w-full' : ''
            }`}>
              {viewMode === 'code' ? (
                /* Code Editor Sub-view */
                <div className="flex-1 flex flex-col h-full">
                  {/* File Tabs */}
                  <div className="h-10 px-3 bg-[#161820] border-b border-[#333742]/60 flex items-center gap-1 overflow-x-auto">
                    {files.map(f => (
                      <button
                        key={f.id}
                        onClick={() => onSelectFile(f.id)}
                        className={`px-3 py-1 rounded-t-lg text-xs font-mono font-medium flex items-center gap-2 border-b-2 transition-all ${
                          activeFile?.id === f.id
                            ? 'bg-[#12141a] text-[#ffb63d] border-[#ffb63d]'
                            : 'text-[#9aa0a6] border-transparent hover:text-white'
                        }`}
                      >
                        <FileCode size={13} />
                        <span>{f.path}</span>
                      </button>
                    ))}
                  </div>

                  {/* Editor Box */}
                  <div className="flex-1 relative bg-[#12141a] overflow-hidden">
                    <textarea
                      value={activeFile?.content || ''}
                      onChange={(e) => {
                        if (activeFile) {
                          onUpdateFileContent(activeFile.id, e.target.value);
                        }
                      }}
                      className="w-full h-full p-4 bg-[#12141a] text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                      spellCheck={false}
                    />
                  </div>
                </div>
              ) : (
                /* Interactive Live Preview Sub-view */
                <div className="flex-1 flex flex-col h-full bg-[#0d0e12] overflow-hidden">
                  {/* Preview Control Header */}
                  <div className="h-10 px-3 bg-[#161820] border-b border-[#333742]/60 flex items-center justify-between gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      {/* Active Preview File Indicator */}
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#1b1e26] border border-[#333742]/50 text-xs font-mono text-[#f2efe6]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffb63d]"></span>
                        <span>{selectedPreviewFile}</span>
                      </div>

                      {/* Auto-Reload Badge */}
                      <div 
                        title="Pratinjau otomatis me-reload setiap kali kode berubah"
                        className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#8ef5a0]/10 border border-[#8ef5a0]/30 text-[11px] font-mono text-[#8ef5a0]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8ef5a0] animate-pulse"></span>
                        <span>Auto-Reload Aktif</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Manual Refresh Button */}
                      <button
                        id="btn-refresh-preview"
                        onClick={() => {
                          setPreviewError(null);
                          setIsReloading(true);
                          setRefreshKey(k => k + 1);
                          setTimeout(() => setIsReloading(false), 300);
                        }}
                        title="Muat ulang pratinjau"
                        className="px-2 py-1 rounded-lg bg-[#1b1e26] hover:bg-[#20242e] border border-[#333742] hover:border-[#ffb63d]/50 text-[#9aa0a6] hover:text-white text-xs flex items-center gap-1.5 transition-all"
                      >
                        <RefreshCw size={12} className={isReloading ? 'animate-spin text-[#ffb63d]' : ''} />
                        <span className="hidden sm:inline">Refresh</span>
                      </button>

                      {/* Open in New Window */}
                      <a
                        href="/preview/live"
                        target="_blank"
                        rel="noreferrer"
                        title="Buka pratinjau di tab baru (bebas iframe)"
                        className="px-2 py-1 rounded-lg bg-[#1b1e26] hover:bg-[#20242e] border border-[#333742] hover:border-[#ffb63d]/50 text-[#9aa0a6] hover:text-white text-xs flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink size={12} />
                        <span className="hidden sm:inline">Tab Baru</span>
                      </a>
                    </div>
                  </div>

                  {/* Rendering Error Banner if Detected */}
                  {previewError && (
                    <div 
                      id="preview-error-banner"
                      className="w-full bg-red-950/95 border-b border-red-500/60 text-red-200 px-4 py-2.5 text-xs flex items-center justify-between gap-3 shadow-lg z-20 animate-fade-in"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-red-300">Kesalahan Pratinjau: </span>
                          <span className="font-mono text-red-100">{previewError.message}</span>
                          {previewError.source && (
                            <span className="text-red-400 text-[11px] ml-1.5 font-mono">
                              ({previewError.source}{previewError.line ? `:${previewError.line}` : ''})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setPreviewError(null);
                            setRefreshKey(k => k + 1);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-800 hover:bg-red-700 text-white font-medium text-[11px] flex items-center gap-1 transition-all"
                        >
                          <RefreshCw size={11} />
                          <span>Muat Ulang</span>
                        </button>
                        <button
                          onClick={() => setPreviewError(null)}
                          className="p-1 rounded text-red-300 hover:text-white hover:bg-red-900/50"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Iframe Viewport Container */}
                  <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                    <div 
                      className={`h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-[#333742] transition-all duration-300 ${
                        viewport === 'mobile'
                          ? 'w-[390px]'
                          : viewport === 'tablet'
                          ? 'w-[768px]'
                          : 'w-full'
                      }`}
                    >
                      <iframe
                        key={refreshKey}
                        id="live-preview-iframe"
                        title="Kodein Live Preview"
                        srcDoc={buildPreviewSrcDoc()}
                        sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
