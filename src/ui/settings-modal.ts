import { createSettingsHTML } from './templates/settings-template';
import { getSettings, saveSettings } from '../storage/settings';
import { exportData, importData } from '../storage/backup';

export function initSettingsModal() {
    const root = document.getElementById('modal-root');
    if (!root) return;

    // Внедряем HTML
    root.innerHTML = createSettingsHTML();

    const modal = document.getElementById('settings-modal')!;
    const closeBtn = document.getElementById('close-settings')!;
    
    // Элементы настроек
    const selectTheme = document.getElementById('select-theme') as HTMLSelectElement;
    const selectFontSize = document.getElementById('select-fontsize') as HTMLSelectElement;

    // Загружаем текущие значения
    const currentSettings = getSettings();
    selectTheme.value = currentSettings.theme;
    selectFontSize.value = currentSettings.fontSize;

    const selectGrid = document.getElementById('select-grid') as HTMLSelectElement;
    selectGrid.value = currentSettings.gridCols;
    selectGrid.addEventListener('change', () => {
        saveSettings({ gridCols: selectGrid.value as '1' | '2' });
    });

    // --- ОТКРЫТИЕ / ЗАКРЫТИЕ ---
    document.getElementById('settings-link')?.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active'); // Клик по фону
    });

    // --- СОХРАНЕНИЕ НАСТРОЕК ---
    selectTheme.addEventListener('change', () => {
        saveSettings({ theme: selectTheme.value as 'dark' | 'light' });
    });

    selectFontSize.addEventListener('change', () => {
        saveSettings({ fontSize: selectFontSize.value as 'small' | 'medium' | 'large' });
    });

    // --- ЭКСПОРТ / ИМПОРТ ---
    document.getElementById('btn-export')?.addEventListener('click', exportData);

    const inputImport = document.getElementById('input-import') as HTMLInputElement;
    inputImport.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            importData(file);
        }
        inputImport.value = ''; // Сброс
    });
}