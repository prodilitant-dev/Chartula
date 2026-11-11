import { Settings } from '../types';

const SETTINGS_KEY = 'chartula_settings_v1';

const defaultSettings: Settings = {
  theme: 'dark',
  fontSize: 'medium',
  voiceMode: 'cloud',
  gridCols: '1',
  categoryColors: {},
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
  // 1. Тема (учитываем системную)
  let actualTheme = settings.theme;
  if (settings.theme === 'system') {
    actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', actualTheme);

  // 2. Масштабирование интерфейса
  // Вместо изменения размера шрифта, мы меняем базовый размер rem
  const sizes = { small: '14px', medium: '16px', large: '20px' };
  document.documentElement.style.fontSize = sizes[settings.fontSize];
  // (Теперь все стили, использующие 'rem', будут масштабироваться)

  // 3. Сетка
  document.documentElement.setAttribute('data-grid', settings.gridCols);
}

// Слушатель для смены системной темы на лету
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (getSettings().theme === 'system') {
    applySettings(getSettings());
  }
});
