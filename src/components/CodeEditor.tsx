import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Save, 
  FileCode, 
  X,
  WrapText,
  Terminal,
  ShieldCheck,
  Lock,
  Unlock
} from 'lucide-react';
import { ProjectFile } from '../types';

interface CodeEditorProps {
  activeFile: ProjectFile | null;
  openFileIds: string[];
  allFiles: ProjectFile[];
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onChangeContent: (content: string) => void;
  onSaveFile: () => Promise<void>;
  onAskAIAboutCode?: (codeSnippet: string) => void;
  isSaving: boolean;
  isCodeProtected?: boolean;
  onToggleCodeProtection?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  activeFile,
  openFileIds,
  allFiles,
  onSelectTab,
  onCloseTab,
  onChangeContent,
  onSaveFile,
  onAskAIAboutCode,
  isSaving,
  isCodeProtected = true,
  onToggleCodeProtection
}) => {
  const [copied, setCopied] = useState(false);
  const [copyBlockedNotice, setCopyBlockedNotice] = useState(false);
  const [wrapText, setWrapText] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const openFiles = allFiles.filter(f => openFileIds.includes(f.id));

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Track cursor position
  const handleSelect = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const text = textareaRef.current.value.substring(0, pos);
    const lines = text.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  // Handle Tab key indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!textareaRef.current) return;
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const value = textareaRef.current.value;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChangeContent(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSaveFile();
    }
  };

  const handleCopy = () => {
    if (!activeFile) return;
    if (isCodeProtected) {
      setCopyBlockedNotice(true);
      setTimeout(() => setCopyBlockedNotice(false), 3500);
      return;
    }
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate lines for line numbers
  const linesCount = activeFile ? activeFile.content.split('\n').length : 1;
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  if (!activeFile) {
    return (
      <div className="flex-1 bg-[#1e1f20] flex flex-col items-center justify-center text-[#9aa0a6] select-none p-6">
        <FileCode className="w-12 h-12 stroke-[1.5] mb-3 text-[#3c4043]" />
        <p className="text-sm font-medium text-[#c4c7c5]">Tidak ada berkas yang dibuka</p>
        <p className="text-xs text-[#9aa0a6] mt-1">Pilih berkas dari Explorer di sebelah kiri untuk mulai mengedit</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#1e1f20] flex flex-col h-full overflow-hidden">
      {/* Top Tab Bar */}
      <div className="h-10 bg-[#131314] border-b border-[#282a2c] flex items-center justify-between px-2 overflow-x-auto select-none">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {openFiles.map((file) => {
            const isActive = file.id === activeFile.id;
            return (
              <div
                key={file.id}
                onClick={() => onSelectTab(file.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-t-md cursor-pointer transition border-t-2 ${
                  isActive
                    ? 'bg-[#1e1f20] text-white font-medium border-[#8ab4f8]'
                    : 'text-[#9aa0a6] hover:text-[#e3e3e3] hover:bg-[#1e1f20]/50 border-transparent'
                }`}
              >
                <span>{file.name}</span>
                {openFiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-400 rounded transition p-0.5"
                    title="Tutup Tab"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-1.5 pl-2">
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
                  ? 'Mode Proteksi Kode (Code Shield) Aktif: Sumber kode tidak dapat diambil atau disalin tanpa izin. Klik untuk membuka izin salin.'
                  : 'Proteksi Kode Dinonaktifkan: Klik untuk mengaktifkan proteksi.'
              }
            >
              {isCodeProtected ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span className="hidden sm:inline">{isCodeProtected ? 'Code Shield' : 'Buka Proteksi'}</span>
            </button>
          )}

          <button
            onClick={() => setWrapText(!wrapText)}
            className={`p-1.5 rounded text-xs transition ${
              wrapText ? 'bg-[#282a2c] text-[#8ab4f8]' : 'text-[#9aa0a6] hover:text-white'
            }`}
            title="Toggle Word Wrap"
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className={`p-1.5 rounded text-xs transition ${
              isCodeProtected ? 'text-amber-400 hover:text-amber-300' : 'text-[#9aa0a6] hover:text-white'
            }`}
            title={isCodeProtected ? '🔒 Kode Diproteksi: Klik untuk info' : 'Salin Kode'}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : isCodeProtected ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={onSaveFile}
            disabled={isSaving}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#282a2c] hover:bg-[#333537] text-xs text-[#e3e3e3] font-medium transition"
            title="Simpan Manual ke Database (Ctrl+S)"
          >
            <Save className="w-3 h-3 text-[#8ab4f8]" />
            <span className="hidden sm:inline">{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
          </button>
        </div>
      </div>

      {/* Copy Blocked Alert Banner when Code Shield is Active */}
      {copyBlockedNotice && (
        <div className="bg-amber-950/80 border-b border-amber-800/60 px-3 py-1.5 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400 flex-none" />
            <span>
              <strong>Kode Game Diproteksi:</strong> Sumber kode ini dilindungi oleh Code Shield agar tidak bisa diambil atau disalin pihak luar.
            </span>
          </div>
          {onToggleCodeProtection && (
            <button
              onClick={() => {
                onToggleCodeProtection();
                setCopyBlockedNotice(false);
              }}
              className="px-2 py-0.5 rounded bg-amber-800/80 hover:bg-amber-700 text-white font-semibold text-[11px] transition flex-none"
            >
              Buka Kunci untuk Menyalin
            </button>
          )}
        </div>
      )}

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-[13px] sm:text-xs leading-5 bg-[#1e1f20]">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="w-9 sm:w-12 py-3 bg-[#18191a] text-[#555a60] select-none text-right pr-1.5 sm:pr-3 overflow-hidden border-r border-[#282a2c] flex-none text-[11px] sm:text-xs"
        >
          {lineNumbers.map(num => (
            <div 
              key={num} 
              className={`leading-5 ${num === cursorPos.line ? 'text-[#8ab4f8] font-bold' : ''}`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Main Code Textarea */}
        <textarea
          ref={textareaRef}
          value={activeFile.content}
          onChange={(e) => onChangeContent(e.target.value)}
          onScroll={handleScroll}
          onSelect={handleSelect}
          onKeyUp={handleSelect}
          onClick={handleSelect}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className={`flex-1 p-2 sm:p-3 pb-16 sm:pb-3 bg-transparent text-[#e3e3e3] resize-none focus:outline-none overflow-auto font-mono ${
            wrapText ? 'whitespace-pre-wrap' : 'whitespace-pre'
          }`}
          style={{ tabSize: 2 }}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="h-6 bg-[#131314] border-t border-[#282a2c] px-3 flex items-center justify-between text-[11px] text-[#9aa0a6] select-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono">Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span className="text-[#3c4043] hidden xs:inline">•</span>
          <span className="hidden xs:inline">{linesCount} baris</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1 text-emerald-400 text-[10px] sm:text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="hidden xs:inline">Tersimpan di</span> DB
          </span>
          <span className="text-[#3c4043]">•</span>
          <span className="uppercase font-mono text-[#8ab4f8]">{activeFile.language}</span>
          <span className="text-[#3c4043] hidden sm:inline">•</span>
          <span className="hidden sm:inline">UTF-8</span>
        </div>
      </div>
    </div>
  );
};
