export interface Attachment {
  id: string;
  type: string;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  text: string;
  tags: string[]; // [0] - Категория, остальные - теги
  color: string; // Оставим на будущее, но сейчас используем категории
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  attachments: Attachment[];
  reminder?: string;
}

export interface Settings {
  theme: 'dark' | 'light' | 'system'; // <-- Добавили 'system'
  fontSize: 'small' | 'medium' | 'large';
  voiceMode: 'cloud' | 'offline';
  gridCols: '1' | '2';
  categoryColors: Record<string, number>;
}
