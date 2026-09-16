export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  updatedAt: string;
  isEntry?: boolean;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  registeredAt: string;
  databaseId: string;
  quotaTokens: number;
  usedTokens: number;
  apiAccess: string;
}

export interface DatabaseStatus {
  connected: boolean;
  status: string;
  totalUsers: number;
  totalFiles: number;
  lastSync: string;
  primaryUser: string;
  storageEngine: string;
  version: string;
}

export interface ChatAttachment {
  name: string;
  type: string;
  data: string;
  size?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  modifiedFiles?: Array<{
    path: string;
    action: 'created' | 'modified' | 'deleted';
  }>;
}

export type AIProvider = 'gemini' | 'openai' | 'claude';

export interface AIModelOption {
  id: string;
  name: string;
  provider: AIProvider;
  providerLabel: string;
  badge: string;
  description: string;
}

export interface AIConfig {
  model: string;
  provider?: AIProvider;
  temperature: number;
  systemInstruction: string;
}

export type ViewMode = 'split' | 'code' | 'preview' | 'ai';
export type DeviceViewport = 'responsive' | 'desktop' | 'tablet' | 'mobile';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  filesSnapshot?: ProjectFile[];
}

export type SidebarSection = 'chat' | 'history' | 'my-projects' | 'gallery' | 'dashboard' | 'docs';
