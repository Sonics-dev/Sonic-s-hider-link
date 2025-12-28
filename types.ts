
export enum AppView {
  CHAT = 'CHAT',
  IMAGE = 'IMAGE',
  LIVE = 'LIVE'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingLinks?: { title: string; uri: string }[];
  isThinking?: boolean;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export interface TranscriptionItem {
  id: string;
  text: string;
  role: 'user' | 'model';
}
