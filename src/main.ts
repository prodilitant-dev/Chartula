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

async function bootstrap() {
    // 1. Применяем тему и настройки
    applySettings(getSettings());

    // 2. Инициализируем базу данных
    try {
        await initDB();
        console.log('База данных готова к работе');
        
        // 3. Инициализируем модальные окна
        initSettingsModal();
        initAttachmentViewer();

        // 4. Первый рендер заметок
        await renderNotes();
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showToast('Ошибка хранилища. Данные могут не сохраниться.');
    }

    // 5. Слушатель кнопки "+"
    document.getElementById('add-note-btn')?.addEventListener('click', addNewNote);
}

bootstrap();