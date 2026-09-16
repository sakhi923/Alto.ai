import React, { useState, useRef } from 'react';
import { 
  FileCode, 
  FileText, 
  FileJson, 
  Plus, 
  Upload, 
  Trash2, 
  Database, 
  Check, 
  X, 
  FolderTree, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ProjectFile } from '../types';

interface FileExplorerProps {
  files: ProjectFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onCreateFile: (fileName: string, initialContent?: string) => Promise<void>;
  onDeleteFile: (path: string) => Promise<void>;
  onResetFiles: () => Promise<void>;
  isDatabaseSynced: boolean;
  onClose?: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onResetFiles,
  isDatabaseSynced,
  onClose
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartCreate = () => {
    setIsCreating(true);
    setNewFileName('');
    setErrorMsg('');
  };

  const handleConfirmCreate = async () => {
    const trimmed = newFileName.trim();
    if (!trimmed) {
      setIsCreating(false);
      return;
    }

    // Default extension if omitted
    const finalName = trimmed.includes('.') ? trimmed : `${trimmed}.js`;

    if (files.some(f => f.path.toLowerCase() === finalName.toLowerCase())) {
      setErrorMsg('Nama berkas sudah ada');
      return;
    }

    try {
      await onCreateFile(finalName);
      setIsCreating(false);
      setNewFileName('');
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal membuat file');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    Array.from(uploadedFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        await onCreateFile(file.name, content || '');
      };
      reader.readAsText(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html':
      case 'htm':
        return <FileCode className="w-4 h-4 text-[#e44d26]" />;
      case 'css':
        return <FileCode className="w-4 h-4 text-[#264de4]" />;
      case 'js':
      case 'jsx':
        return <FileCode className="w-4 h-4 text-[#f7df1e]" />;
      case 'ts':
      case 'tsx':
        return <FileCode className="w-4 h-4 text-[#3178c6]" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-[#5bb974]" />;
      case 'md':
        return <FileText className="w-4 h-4 text-[#c58af9]" />;
      default:
        return <FileText className="w-4 h-4 text-[#9aa0a6]" />;
    }
  };

  return (
    <div className="w-72 sm:w-64 max-w-full bg-[#18191a] border-r border-[#282a2c] flex flex-col h-full select-none shadow-xl sm:shadow-none">
      {/* Explorer Header */}
      <div className="h-11 sm:h-10 px-3 border-b border-[#282a2c] flex items-center justify-between text-xs text-[#c4c7c5] font-medium bg-[#131314]/70">
        <div className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-bold text-[#8ab4f8]">
          <FolderTree className="w-3.5 h-3.5" />
          <span>Berkas Proyek</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleStartCreate}
            className="p-1.5 hover:bg-[#282a2c] text-[#9aa0a6] hover:text-white rounded transition"
            title="Tambah Berkas Baru"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 hover:bg-[#282a2c] text-[#9aa0a6] hover:text-white rounded transition"
            title="Unggah Berkas dari Komputer"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#282a2c] text-[#9aa0a6] hover:text-white rounded transition md:hidden ml-1"
              title="Tutup Panel Berkas"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Inline Create Input */}
      {isCreating && (
        <div className="p-2 border-b border-[#282a2c] bg-[#1e1f20]">
          <div className="flex items-center gap-1 bg-[#131314] px-2 py-1 rounded border border-[#8ab4f8]">
            <input
              type="text"
              autoFocus
              placeholder="nama-file.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmCreate();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              className="bg-transparent text-xs text-white focus:outline-none flex-1 font-mono"
            />
            <button
              onClick={handleConfirmCreate}
              className="p-0.5 text-emerald-400 hover:text-emerald-300"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="p-0.5 text-[#9aa0a6] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {errorMsg && (
            <p className="text-[10px] text-rose-400 mt-1 pl-1">{errorMsg}</p>
          )}
          <div className="flex gap-1 mt-1.5 text-[10px] text-[#9aa0a6]">
            <span>Format:</span>
            <button onClick={() => setNewFileName(n => (n ? n + '.html' : 'component.html'))} className="hover:text-blue-400">.html</button>
            <button onClick={() => setNewFileName(n => (n ? n + '.css' : 'custom.css'))} className="hover:text-blue-400">.css</button>
            <button onClick={() => setNewFileName(n => (n ? n + '.js' : 'feature.js'))} className="hover:text-blue-400">.js</button>
          </div>
        </div>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto py-1 space-y-0.5">
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          const isEntry = file.isEntry || file.path === 'index.html';

          return (
            <div
              key={file.id}
              onClick={() => {
                onSelectFile(file.id);
                onClose?.();
              }}
              className={`group flex items-center justify-between px-3 py-2 sm:py-1.5 cursor-pointer text-xs font-mono transition active:bg-[#333538] ${
                isActive
                  ? 'bg-[#282a2c] text-white font-medium border-l-2 border-[#8ab4f8]'
                  : 'text-[#c4c7c5] hover:bg-[#1e1f20] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {getFileIcon(file.name)}
                <span className="truncate">{file.path}</span>
                {isEntry && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 font-sans border border-blue-500/30">
                    entry
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                {!isEntry && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus file ${file.path}?`)) {
                        onDeleteFile(file.path);
                      }
                    }}
                    className="p-1 hover:text-rose-400 rounded text-[#9aa0a6]"
                    title="Hapus Berkas"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preset Component Buttons */}
      <div className="p-2 border-t border-[#282a2c] bg-[#131314]/50 space-y-1.5">
        <div className="text-[11px] text-[#9aa0a6] font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#8ab4f8]" />
          <span>Preset Tambah Cepat:</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          <button
            onClick={() => onCreateFile('components.html', '<!-- Template Komponen UI -->\n<div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">\n  <h3 class="font-bold text-white">Komponen Baru</h3>\n  <p class="text-sm text-slate-400">Deskripsi komponen interaktif.</p>\n</div>')}
            className="px-2 py-1 rounded bg-[#1e1f20] hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white border border-[#282a2c] text-left truncate transition"
          >
            + UI Card
          </button>
          <button
            onClick={() => onCreateFile('utils.js', '// Utility Functions\nexport function formatDate(d = new Date()) {\n  return d.toLocaleDateString("id-ID");\n}\n\nexport function debounce(fn, delay = 300) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), delay);\n  };\n}')}
            className="px-2 py-1 rounded bg-[#1e1f20] hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white border border-[#282a2c] text-left truncate transition"
          >
            + Utils.js
          </button>
        </div>
      </div>

      {/* Database Sync Status Footer */}
      <div className="p-2.5 border-t border-[#282a2c] bg-[#131314] text-[11px] flex items-center justify-between text-[#9aa0a6]">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">Tersimpan di DB</span>
        </div>

        <button
          onClick={async () => {
            if (confirm('Kembalikan semua file ke template bawaan awal?')) {
              setIsResetting(true);
              await onResetFiles();
              setIsResetting(false);
            }
          }}
          disabled={isResetting}
          className="hover:text-[#e3e3e3] flex items-center gap-1 text-[10px] text-[#9aa0a6] p-1 rounded hover:bg-[#1e1f20]"
          title="Reset berkas ke template awal"
        >
          <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
