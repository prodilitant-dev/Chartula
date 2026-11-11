import '@fontsource/inter/400.css';
import '@fontsource/outfit/600.css';
import '@fontsource/caveat/700.css';
import './styles/main.css';

import { initDB } from './storage/db';
import { getSettings, applySettings } from './storage/settings';
import { showToast } from './ui/toast';
import { renderNotes, addNewNote } from './ui/notes-grid';
import { initSettingsModal } from './ui/settings-modal';
import { initAttachmentViewer } from './ui/attachment-viewer';
import { setupPWA } from './pwa/register'; // <-- Новый импорт

async function bootstrap() {
    applySettings(getSettings());
    setupPWA(); // <-- Инициализация PWA

    try {
        await initDB();
        console.log('База данных готова к работе');
        
        initSettingsModal();
        initAttachmentViewer();
        await renderNotes();
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showToast('Ошибка хранилища. Данные могут не сохраниться.');
    }

    document.getElementById('add-note-btn')?.addEventListener('click', addNewNote);
}

bootstrap();