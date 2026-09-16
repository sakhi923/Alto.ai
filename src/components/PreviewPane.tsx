import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  RotateCw, 
  ExternalLink, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Maximize2, 
  Terminal, 
  Trash2, 
  AlertCircle,
  Info,
  CheckCircle2,
  Code2,
  Sparkles,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { ProjectFile, DeviceViewport } from '../types';

interface PreviewPaneProps {
  files: ProjectFile[];
  refreshKey: number;
  onManualRefresh: () => void;
  onSelectTemplate?: (templateId: string) => void;
  isCodeProtected?: boolean;
  onToggleCodeProtection?: () => void;
}

interface ConsoleLog {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  files,
  refreshKey,
  onManualRefresh,
  isCodeProtected = true,
  onToggleCodeProtection
}) => {
  const [viewport, setViewport] = useState<DeviceViewport>('responsive');
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewSource, setPreviewSource] = useState<'memory' | 'server'>('memory');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Compile full self-contained HTML bundle with local files inlined
  const compiledHtml = useMemo(() => {
    if (!files || files.length === 0) {
      return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#020617;color:#94a3b8;font-family:sans-serif;}</style></head>
<body><div style="text-align:center;"><h3>Memuat file proyek...</h3></div></body>
</html>`;
    }

    const htmlFile = files.find(f => f.path === 'index.html' || f.name === 'index.html' || f.name.endsWith('.html')) || files[0];
    let html = htmlFile ? htmlFile.content : `<!DOCTYPE html><html><body style="background:#020617;color:#f8fafc;padding:2rem;font-family:sans-serif;"><h3>Tidak ada file HTML</h3></body></html>`;

    // Map of CSS & JS by filename and path
    const cssMap = new Map<string, string>();
    const jsMap = new Map<string, string>();

    files.forEach(f => {
      const fileName = f.name.toLowerCase();
      const filePath = f.path.toLowerCase();
      if (fileName.endsWith('.css') || filePath.endsWith('.css')) {
        cssMap.set(fileName, f.content);
        cssMap.set(filePath, f.content);
      } else if ((fileName.endsWith('.js') || filePath.endsWith('.js')) && !fileName.includes('server')) {
        jsMap.set(fileName, f.content);
        jsMap.set(filePath, f.content);
      }
    });

    const replacedCss = new Set<string>();
    const replacedJs = new Set<string>();

    // 1. Replace all <link rel="stylesheet" href="..."> that point to local files
    html = html.replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi, (match, href: string) => {
      const cleanHref = href.replace(/^\.?\//, '').toLowerCase();
      if (cssMap.has(cleanHref)) {
        replacedCss.add(cleanHref);
        return `<style data-file="${cleanHref}">\n/* ${cleanHref} */\n${cssMap.get(cleanHref)}\n</style>`;
      }
      // If relative link and not external http/https, remove it so it won't fetch HTML from host
      if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
        return `<!-- [inlined or removed relative link: ${href}] -->`;
      }
      return match;
    });

    // Also handle reverse attribute order: href before rel
    html = html.replace(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi, (match, href: string) => {
      const cleanHref = href.replace(/^\.?\//, '').toLowerCase();
      if (cssMap.has(cleanHref)) {
        replacedCss.add(cleanHref);
        return `<style data-file="${cleanHref}">\n/* ${cleanHref} */\n${cssMap.get(cleanHref)}\n</style>`;
      }
      if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
        return `<!-- [inlined or removed relative link: ${href}] -->`;
      }
      return match;
    });

    // 2. Replace all <script src="..."></script> that point to local files
    html = html.replace(/<script\s+[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (match, src: string) => {
      const cleanSrc = src.replace(/^\.?\//, '').toLowerCase();
      if (jsMap.has(cleanSrc)) {
        replacedJs.add(cleanSrc);
        return `<script data-file="${cleanSrc}">\n// ${cleanSrc}\n${jsMap.get(cleanSrc)}\n</script>`;
      }
      // If relative script and not external http/https, remove it to prevent SyntaxError from host HTML
      if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//')) {
        return `<!-- [inlined or removed relative script: ${src}] -->`;
      }
      return match;
    });

    // Environment & storage polyfill + console logger injection
    const headerPreamble = `
      <script>
        (function() {
          // Safe storage polyfill for nested iframe contexts
          try {
            var mockStorage = {
              _data: {},
              getItem: function(k) { return this._data[k] !== undefined ? this._data[k] : null; },
              setItem: function(k, v) { this._data[k] = String(v); },
              removeItem: function(k) { delete this._data[k]; },
              clear: function() { this._data = {}; },
              key: function(i) { return Object.keys(this._data)[i] || null; },
              get length() { return Object.keys(this._data).length; }
            };
            if (!window.localStorage) { window.localStorage = mockStorage; }
            if (!window.sessionStorage) { window.sessionStorage = mockStorage; }
          } catch(e) {}

          var sendLog = function(type, args) {
            try {
              var msg = Array.from(args).map(function(a) {
                if (typeof a === 'object') {
                  try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
                }
                return String(a);
              }).join(' ');
              if (window.parent) {
                window.parent.postMessage({ type: 'STUDIO_CONSOLE', logType: type, message: msg }, '*');
              }
            } catch(e) {}
          };
          var origLog = console.log;
          var origErr = console.error;
          var origWarn = console.warn;
          var origInfo = console.info;

          console.log = function() { sendLog('log', arguments); if (origLog) origLog.apply(console, arguments); };
          console.error = function() { sendLog('error', arguments); if (origErr) origErr.apply(console, arguments); };
          console.warn = function() { sendLog('warn', arguments); if (origWarn) origWarn.apply(console, arguments); };
          console.info = function() { sendLog('info', arguments); if (origInfo) origInfo.apply(console, arguments); };

          window.onerror = function(msg, url, line, col, error) {
            sendLog('error', ['[Error Baris ' + line + ']: ' + msg]);
          };

          ${isCodeProtected ? `
          // Code Shield: Proteksi Kode dari Pengambilan/Pencurian
          document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            sendLog('warn', ['🔒 Code Shield Aktif: Klik kanan dinonaktifkan untuk melindungi sumber kode game.']);
            return false;
          });
          document.addEventListener('keydown', function(e) {
            if (
              e.key === 'F12' || 
              (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
              (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'j' || e.key === 'c')) ||
              (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
              (e.metaKey && (e.key === 'u' || e.key === 's'))
            ) {
              e.preventDefault();
              e.stopPropagation();
              sendLog('warn', ['🔒 Code Shield Aktif: Pintasan inspect element dinonaktifkan.']);
              return false;
            }
          });
          ` : ''}
        })();
      </script>
    `;

    // 3. Inject any remaining CSS files that weren't in <link> tags
    const remainingCss: string[] = [];
    files.forEach(f => {
      if (f.path.endsWith('.css') && !replacedCss.has(f.path.toLowerCase()) && !replacedCss.has(f.name.toLowerCase())) {
        remainingCss.push(`/* ${f.path} */\n${f.content}`);
      }
    });

    const cssToInject = remainingCss.length > 0 ? `<style>\n${remainingCss.join('\n\n')}\n</style>` : '';

    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>\n${headerPreamble}`);
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', `${headerPreamble}\n</head>`);
    } else {
      html = headerPreamble + '\n' + html;
    }

    if (html.includes('</head>')) {
      html = html.replace('</head>', `${cssToInject}\n</head>`);
    } else {
      html = cssToInject + '\n' + html;
    }

    // 4. Inject any remaining JS files that weren't in <script> tags
    const remainingJs: string[] = [];
    files.forEach(f => {
      if (f.path.endsWith('.js') && !f.path.includes('server') && !replacedJs.has(f.path.toLowerCase()) && !replacedJs.has(f.name.toLowerCase())) {
        remainingJs.push(`// ${f.path}\n${f.content}`);
      }
    });

    const jsToInject = remainingJs.length > 0 ? `<script>\n${remainingJs.join('\n\n')}\n</script>` : '';

    if (html.includes('</body>')) {
      html = html.replace('</body>', `${jsToInject}\n</body>`);
    } else {
      html = html + `\n${jsToInject}`;
    }

    return html;
  }, [files]);

  // Listen to messages from iframe console
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'STUDIO_CONSOLE') {
        setLogs(prev => [
          ...prev.slice(-99),
          {
            id: 'log-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
            type: event.data.logType || 'log',
            message: event.data.message || '',
            timestamp: new Date().toLocaleTimeString('id-ID')
          }
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onManualRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const openInNewTab = () => {
    // Open server endpoint directly or blob fallback
    const targetUrl = '/api/preview/html?t=' + Date.now();
    try {
      window.open(targetUrl, '_blank');
    } catch (e) {
      const blob = new Blob([compiledHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const getViewportWidth = (): string => {
    switch (viewport) {
      case 'desktop': return 'w-[1024px] max-w-full';
      case 'tablet': return 'w-[768px] max-w-full';
      case 'mobile': return 'w-[375px] max-w-full';
      default: return 'w-full';
    }
  };

  const errorCount = logs.filter(l => l.type === 'error').length;

  return (
    <div className="flex-1 bg-[#131314] flex flex-col h-full overflow-hidden border-l border-[#282a2c]">
      {/* Top Preview Control Bar */}
      <div className="h-10 bg-[#18191a] border-b border-[#282a2c] flex items-center justify-between px-3 text-xs select-none gap-2 flex-none">
        {/* Left: Live indicator & Source Mode Toggle & Refresh */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#131314] border border-[#282a2c] text-[#9aa0a6] text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-none"></span>
            <span className="text-[#c4c7c5] font-medium truncate">Live Preview</span>
          </div>

          {/* Mode Switcher: Memory / Server */}
          <div className="hidden lg:flex items-center bg-[#131314] p-0.5 rounded-md border border-[#282a2c] text-[10px]">
            <button
              onClick={() => setPreviewSource('memory')}
              className={`px-2 py-0.5 rounded transition font-medium ${
                previewSource === 'memory' ? 'bg-[#282a2c] text-[#8ab4f8]' : 'text-[#9aa0a6] hover:text-white'
              }`}
              title="Render real-time langsung dari editor memori"
            >
              Realtime
            </button>
            <button
              onClick={() => setPreviewSource('server')}
              className={`px-2 py-0.5 rounded transition font-medium ${
                previewSource === 'server' ? 'bg-[#282a2c] text-[#8ab4f8]' : 'text-[#9aa0a6] hover:text-white'
              }`}
              title="Render langsung melalui endpoint server backend (/api/preview/html)"
            >
              Server
            </button>
          </div>

          <button
            onClick={handleRefreshClick}
            className={`p-1 hover:bg-[#282a2c] text-[#9aa0a6] hover:text-white rounded transition flex-none ${isRefreshing ? 'animate-spin text-blue-400' : ''}`}
            title="Segarkan Ulang Live Preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Device Viewport Switcher (Shown on Tablet & Desktop) */}
        <div className="hidden sm:flex items-center bg-[#131314] p-0.5 rounded-md border border-[#282a2c] flex-none">
          <button
            onClick={() => setViewport('responsive')}
            className={`p-1 rounded transition ${viewport === 'responsive' ? 'bg-[#282a2c] text-[#8ab4f8]' : 'text-[#9aa0a6] hover:text-white'}`}
            title="Lebar Penuh (Responsif)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1 rounded transition ${viewport === 'desktop' ? 'bg-[#282a2c] text-[#8ab4f8]' : 'text-[#9aa0a6] hover:text-white'}`}
            title="Desktop View (1024px)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1 rounded transition ${viewport === 'tablet' ? 'bg-[#282a2c] text-[#8ab4f8]' : 'text-[#9aa0a6] hover:text-white'}`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1 rounded transition ${viewport === 'mobile' ? 'bg-[#282a2c] text-[#8ab4f8]' : 'text-[#9aa0a6] hover:text-white'}`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Code Shield, Console & Open External Link */}
        <div className="flex items-center gap-1.5 flex-none">
          {onToggleCodeProtection && (
            <button
              onClick={onToggleCodeProtection}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition border ${
                isCodeProtected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-[#1e1f20] text-[#9aa0a6] hover:text-white border-[#282a2c]'
              }`}
              title={
                isCodeProtected
                  ? 'Mode Proteksi Kode (Code Shield) Aktif: Klik kanan, inspect element, dan pencurian kode dinonaktifkan di pratinjau. Klik untuk ubah.'
                  : 'Proteksi Kode Dinonaktifkan: Klik untuk aktifkan Code Shield.'
              }
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{isCodeProtected ? 'Code Shield' : 'Proteksi Off'}</span>
            </button>
          )}

          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition border ${
              showConsole 
                ? 'bg-[#282a2c] text-[#8ab4f8] border-[#8ab4f8]/30' 
                : 'text-[#9aa0a6] hover:text-white border-transparent'
            }`}
            title="Buka Terminal Konsol Logs"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Console</span>
            {errorCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {errorCount}
              </span>
            )}
          </button>

          {/* Direct HTML link that bypasses popup blocker */}
          <a
            href="/api/preview/html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#9aa0a6] hover:text-white hover:bg-[#282a2c] transition"
            title="Buka Preview di Tab Browser Baru"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tab Baru</span>
          </a>
        </div>
      </div>

      {/* Preview Stage / Iframe Container */}
      <div className="flex-1 min-h-0 bg-[#0b0c0e] p-1 sm:p-2 md:p-3 pb-14 md:pb-3 flex flex-col items-center justify-center relative overflow-hidden">
        <div className={`${getViewportWidth()} w-full h-full min-h-0 transition-all duration-200 bg-slate-950 rounded-lg sm:rounded-xl shadow-2xl border border-[#282a2c] overflow-hidden flex flex-col flex-1 relative`}>
          <iframe
            key={`preview-${previewSource}-${refreshKey}`}
            ref={iframeRef}
            srcDoc={previewSource === 'memory' ? compiledHtml : undefined}
            src={previewSource === 'server' ? `/api/preview/html?t=${refreshKey}` : undefined}
            title="Gemini Code Studio Live Preview"
            className="w-full h-full flex-1 min-h-0 border-none bg-[#020617] block"
          />
        </div>
      </div>

      {/* Collapsible Console Drawer */}
      {showConsole && (
        <div className="h-44 bg-[#141517] border-t border-[#282a2c] flex flex-col font-mono text-xs">
          <div className="h-7 bg-[#1c1d1f] px-3 flex items-center justify-between border-b border-[#282a2c] text-[#9aa0a6]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#8ab4f8]" />
              <span className="font-semibold text-white">Browser Console Logs</span>
              <span className="text-[10px] text-[#9aa0a6]">({logs.length} entri)</span>
            </div>
            <button
              onClick={() => setLogs([])}
              className="hover:text-rose-400 p-1 flex items-center gap-1 text-[11px] transition"
              title="Bersihkan Log"
            >
              <Trash2 className="w-3 h-3" />
              <span>Bersihkan</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {logs.length === 0 ? (
              <div className="text-[#555a60] text-center py-6">
                Tidak ada log console. Output dari console.log atau error akan muncul di sini.
              </div>
            ) : (
              logs.map(log => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 py-0.5 px-1.5 rounded text-[11px] leading-relaxed ${
                    log.type === 'error'
                      ? 'bg-rose-500/10 text-rose-300 border-l-2 border-rose-500'
                      : log.type === 'warn'
                      ? 'bg-amber-500/10 text-amber-300 border-l-2 border-amber-500'
                      : 'text-[#c4c7c5] hover:bg-[#1f2023]'
                  }`}
                >
                  <span className="text-[#555a60] flex-none">{log.timestamp}</span>
                  {log.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-none mt-0.5" />}
                  {log.type === 'warn' && <Info className="w-3.5 h-3.5 text-amber-400 flex-none mt-0.5" />}
                  <span className="break-all whitespace-pre-wrap font-mono">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
