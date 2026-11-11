import '@fontsource/inter/400.css';
import '@fontsource/outfit/600.css';
import '@fontsource/caveat/700.css';
import './styles/main.css';

import { initDB } from './storage/db';
import { getSettings, applySettings } from './storage/settings';
import { showToast } from './ui/toast';
import { renderNotes, addNewNote } from './ui/notes-grid';
import { initSettingsModal } from './ui/settings-modal';

async function bootstrap() {
    applySettings(getSettings());

    try {
        await initDB();
        await renderNotes();
    initSettingsModal();
         // Первый рендер при запуске
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showToast('Ошибка хранилища.');
    }

    // Слушатель кнопки "+"
    document.getElementById('add-note-btn')?.addEventListener('click', addNewNote);
}

bootstrap();