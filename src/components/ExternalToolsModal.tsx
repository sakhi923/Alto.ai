import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  UploadCloud, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X, 
  Github, 
  Globe, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { AltoLogoMark } from './AltoLogo';

interface ExternalToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface IntegrationInfo {
  github: {
    connected: boolean;
    username: string;
    repo: string;
    branch: string;
    lastSynced: string;
    status: string;
  };
  gitlab: {
    connected: boolean;
    status: string;
  };
  vercel: {
    connected: boolean;
    project: string;
    environment: string;
    status: string;
  };
}

export const ExternalToolsModal: React.FC<ExternalToolsModalProps> = ({
  isOpen,
  onClose,
  showToast
}) => {
  const [integrations, setIntegrations] = useState<IntegrationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushing, setPushing] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [commitMessage, setCommitMessage] = useState('Update kode dari workspace Kodein');
  const [lastDeployUrl, setLastDeployUrl] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tools/integrations');
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data);
      }
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchIntegrations();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePushGitHub = async () => {
    try {
      setPushing(true);
      const res = await fetch('/api/tools/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commitMessage })
      });
      const data = await res.json();
      if (data.success) {
        showToast?.(`🚀 ${data.message} [Commit: ${data.commitHash}]`, 'success');
      } else {
        showToast?.('Gagal melakukan push ke GitHub', 'error');
      }
    } catch (err) {
      showToast?.('Terjadi kesalahan saat push ke GitHub', 'error');
    } finally {
      setPushing(false);
    }
  };

  const handleDeployVercel = async () => {
    try {
      setDeploying(true);
      const res = await fetch('/api/tools/vercel/deploy', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setLastDeployUrl(data.previewUrl);
        showToast?.(`⚡ ${data.message}`, 'success');
      } else {
        showToast?.('Gagal memicu deploy ke Vercel', 'error');
      }
    } catch (err) {
      showToast?.('Terjadi kesalahan saat deploy ke Vercel', 'error');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#161718] border border-[#282a2c] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#131314] border-b border-[#282a2c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-[#282a2c] flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Integrasi Tools Eksternal</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Kodein
                </span>
              </div>
              <p className="text-[11px] text-[#9aa0a6]">
                Sambungkan akun untuk push code, deploy instan, & tarik repo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-white hover:bg-[#282a2c] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Transparency notice from Alto's prompt */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
            <AltoLogoMark size={18} className="flex-none mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Catatan Transparansi Alto:</strong> Integrasi akun terhubung dengan akun terdaftar pengguna (<span className="text-white font-mono">sakhiammarf@gmail.com</span>). Operasi push & deploy berjalan di lingkungan sandboxed Kodein.
            </div>
          </div>

          {/* GitHub Tool Card */}
          <div className="p-4 rounded-xl bg-[#1e1f20] border border-[#282a2c] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                  <Github className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">GitHub</div>
                  <div className="text-[10px] font-mono text-[#9aa0a6]">
                    sakhiammarf / kodein-workspace (main)
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Tersambung
              </span>
            </div>

            <div className="space-y-2 pt-1 border-t border-[#282a2c]/60">
              <label className="text-[11px] text-[#9aa0a6] block">Pesan Commit:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#131314] border border-[#282a2c] text-xs text-white focus:outline-none focus:border-sky-400"
                  placeholder="Deskripsi perubahan..."
                />
                <button
                  onClick={handlePushGitHub}
                  disabled={pushing || !commitMessage.trim()}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-xs font-medium transition flex items-center gap-1.5 flex-none"
                >
                  {pushing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Pushing...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Push Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Vercel Tool Card */}
          <div className="p-4 rounded-xl bg-[#1e1f20] border border-[#282a2c] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                  ▲
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Vercel</div>
                  <div className="text-[10px] font-mono text-[#9aa0a6]">
                    kodein-live-preview (Production)
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Siap Deploy
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#282a2c]/60">
              <div className="text-[11px] text-[#9aa0a6]">
                Deploy preview instan dari branch aktif
              </div>
              <button
                onClick={handleDeployVercel}
                disabled={deploying}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white text-xs font-medium transition flex items-center gap-1.5"
              >
                {deploying ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Deploying...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Deploy ke Vercel</span>
                  </>
                )}
              </button>
            </div>

            {lastDeployUrl && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
                <span className="truncate mr-2 font-mono text-[11px]">{lastDeployUrl}</span>
                <a
                  href={lastDeployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-emerald-400 font-semibold hover:underline flex-none text-[11px]"
                >
                  Buka Preview <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* GitLab Tool Card */}
          <div className="p-4 rounded-xl bg-[#1e1f20]/60 border border-[#282a2c] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-950/40 border border-orange-500/20 flex items-center justify-center font-bold text-xs text-orange-400">
                🦊
              </div>
              <div>
                <div className="text-xs font-semibold text-white">GitLab</div>
                <div className="text-[10px] text-[#9aa0a6]">
                  Integrasi Personal Access Token
                </div>
              </div>
            </div>
            <button
              onClick={() => showToast?.('Fitur penghubung GitLab akan segera hadir di pembaruan berikutnya!', 'info')}
              className="px-2.5 py-1 rounded-lg bg-[#282a2c] hover:bg-[#34373a] text-[#c4c7c5] hover:text-white text-xs transition"
            >
              Sambungkan
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#131314] border-t border-[#282a2c] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#34373a] text-white text-xs font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
