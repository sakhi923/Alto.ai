import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainArea } from './components/MainArea';
import { HistoryModal } from './components/HistoryModal';
import { UpgradeModal } from './components/UpgradeModal';
import { GalleryModal } from './components/GalleryModal';
import { DashboardModal } from './components/DashboardModal';
import { DocsModal } from './components/DocsModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ProjectFile, UserData, DatabaseStatus, ChatMessage, ChatAttachment, ChatSession, SidebarSection } from './types';
import { INITIAL_FILES } from './data/initialFiles';
import { AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [activeSection, setActiveSection] = useState<SidebarSection>('chat');

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<'settings' | 'apikey'>('settings');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Files and Database state
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('file-1');
  const [user, setUser] = useState<UserData | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus | null>(null);
  const [sessionCount, setSessionCount] = useState<number>(0);

  // Active Session & Chat state
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => 'session-' + Date.now().toString(36));
  const [sessionTitle, setSessionTitle] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load user data
  const loadUserAndDatabase = useCallback(async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setDatabaseStatus(data.databaseStatus);
      }
    } catch (err) {
      console.error('Failed to load user info:', err);
    }
  }, []);

  // Load project files
  const loadFiles = useCallback(async () => {
    try {
      const res = await fetch('/api/files');
      if (res.ok) {
        const data = await res.json();
        const loadedFiles: ProjectFile[] = data.files || [];
        if (loadedFiles.length > 0) {
          setFiles(loadedFiles);
          const entry = loadedFiles.find(f => f.path === 'index.html' || f.name === 'index.html') || loadedFiles[0];
          setActiveFileId(entry.id);
        }
      }
    } catch (err) {
      console.error('Failed to load project files:', err);
    }
  }, []);

  // Load session count
  const loadSessionCount = useCallback(async () => {
    try {
      const res = await fetch('/api/ai/sessions');
      if (res.ok) {
        const data = await res.json();
        const count = (data.sessions || []).length;
        setSessionCount(count);
      }
    } catch (err) {
      console.error('Failed to load sessions count:', err);
    }
  }, []);

  useEffect(() => {
    loadUserAndDatabase();
    loadFiles();
    loadSessionCount();
  }, [loadUserAndDatabase, loadFiles, loadSessionCount]);

  // Handle Sidebar Section Navigation
  const handleSelectSection = (section: SidebarSection) => {
    setActiveSection(section);
    if (section === 'history') {
      setIsHistoryOpen(true);
    } else if (section === 'gallery') {
      setIsGalleryOpen(true);
    } else if (section === 'dashboard') {
      setIsDashboardOpen(true);
    } else if (section === 'docs') {
      setIsDocsOpen(true);
    } else if (section === 'my-projects') {
      setIsHistoryOpen(true);
    }
  };

  // Start a fresh new project
  const handleNewProject = () => {
    setCurrentSessionId('session-' + Date.now().toString(36));
    setSessionTitle('');
    setMessages([]);
    setActiveSection('chat');
    showToast('Proyek baru dimulai. Ceritain ide kamu ke Alto!', 'info');
  };

  // Switch to a saved session from History
  const handleSelectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setSessionTitle(session.title);
    setMessages(session.messages || []);
    setActiveSection('chat');
    showToast(`Membuka sesi "${session.title}"`);
  };

  // Send message to Alto AI
  const handleSendMessage = async (prompt: string, attachments: ChatAttachment[] = []) => {
    if ((!prompt.trim() && attachments.length === 0) || isGenerating) return;

    // If first message in this session, update title
    if (messages.length === 0) {
      const title = prompt.trim() ? (prompt.length > 40 ? prompt.slice(0, 40) + '...' : prompt) : (attachments[0]?.name || 'Proyek Bersama Alto');
      setSessionTitle(title);
    }

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now().toString(36),
      role: 'user',
      content: prompt,
      attachments,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          sessionId: currentSessionId,
          attachments,
          model: 'gemini-2.5-flash'
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server menolak permintaan AI');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now().toString(36),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
        modifiedFiles: data.modifiedFiles
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If files were modified by AI, reload them to update live preview
      if (data.updatedFiles && data.updatedFiles.length > 0) {
        setFiles(data.updatedFiles);
        showToast('Live Preview langsung diperbarui oleh Alto!', 'success');
      } else if (data.modifiedFiles && data.modifiedFiles.length > 0) {
        try {
          const filesRes = await fetch('/api/files?t=' + Date.now());
          if (filesRes.ok) {
            const freshFiles = await filesRes.json();
            setFiles(freshFiles);
            showToast('Live Preview langsung disinkronkan!', 'success');
          }
        } catch (fErr) {
          console.error('Error fetching refreshed files:', fErr);
        }
      }

      // Update session count in sidebar
      loadSessionCount();

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now().toString(36),
        role: 'assistant',
        content: 'Terjadi kendala: ' + (err.message || 'Koneksi gagal'),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
      showToast(err.message || 'Gagal memproses pesan AI', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Update file content locally from code editor
  const handleUpdateFileContent = async (fileId: string, newContent: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, content: newContent, updatedAt: new Date().toISOString() } : f));
    const targetFile = files.find(f => f.id === fileId);
    if (targetFile) {
      try {
        await fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: targetFile.path, content: newContent })
        });
      } catch (err) {
        console.error('Failed to auto-save file:', err);
      }
    }
  };

  const activeFile = files.find(f => f.id === activeFileId) || files[0] || null;

  return (
    <div className="h-screen w-screen bg-[#12141a] text-[#f2efe6] flex overflow-hidden font-sans select-none">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-2xl border text-xs font-medium backdrop-blur-md transition-all animate-fade-in bg-[#161820]/95 border-[#ffb63d]/40 text-white">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-none" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#ffb63d] flex-none" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Sidebar Kiri (Lebar tetap 260px, bisa diciutkan ke 68px) */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onNewProject={handleNewProject}
        sessionCount={sessionCount}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => {
          setSettingsTab('settings');
          setIsSettingsOpen(true);
        }}
        onOpenSearch={() => setIsHistoryOpen(true)}
        onOpenApiKey={() => {
          setSettingsTab('apikey');
          setIsSettingsOpen(true);
        }}
        userEmail={user?.email || 'sakhiammarf@gmail.com'}
      />

      {/* 2. Area Utama */}
      <div 
        id="main-content-wrapper"
        className={`flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ${
          sidebarOpen ? 'ml-[260px]' : 'ml-[68px]'
        }`}
      >
        <MainArea
          sidebarOpen={sidebarOpen}
          messages={messages}
          files={files}
          activeFile={activeFile}
          onSelectFile={(id) => setActiveFileId(id)}
          onUpdateFileContent={handleUpdateFileContent}
          isGenerating={isGenerating}
          onSendMessage={handleSendMessage}
          onResetSession={handleNewProject}
          sessionTitle={sessionTitle}
        />
      </div>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewProject}
        currentSessionId={currentSessionId}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onApplyTemplate={(prompt) => {
          handleSendMessage(prompt, []);
        }}
      />

      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        user={user}
        databaseStatus={databaseStatus}
        sessionCount={sessionCount}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        defaultTab={settingsTab}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
