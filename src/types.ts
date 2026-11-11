export interface Attachment {
    id: string;
    type: string; // mime-type (image/jpeg, audio/webm и т.д.)
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
}