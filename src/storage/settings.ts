import { Settings } from '../types';

const SETTINGS_KEY = 'chartula_settings_v1';

const defaultSettings: Settings = {
    theme: 'dark',
    fontSize: 'medium',
    voiceMode: 'cloud'
};

export function getSettings(): Settings {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
    } catch {
        return defaultSettings;
    }
}

export function saveSettings(settings: Partial<Settings>) {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    applySettings(updated);
}

export function applySettings(settings: Settings) {
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Меняем базовый размер шрифта
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.setProperty('--font-size-base', sizes[settings.fontSize]);
}