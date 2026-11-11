export interface Attachment {
    id: string;
    type: string;
    name: string;
}

export interface Note {
    id: number;
    title: string;
    text: string;
    tags: string[];
    color: 'yellow' | 'blue' | 'green' | 'pink';
    isPinned: boolean;
    createdAt: number;
    updatedAt: number;
    attachments: Attachment[];
}

export interface Settings {
    theme: 'dark' | 'light';
    fontSize: 'small' | 'medium' | 'large';
    voiceMode: 'cloud' | 'offline';
    gridCols: '1' | '2'; // <-- НОВОЕ ПОЛЕ
}