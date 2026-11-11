import '@fontsource/inter/400.css';
import '@fontsource/outfit/600.css';
import '@fontsource/caveat/700.css';
import './styles/main.css';

import { initDB } from './storage/db';
import { getSettings, applySettings } from './storage/settings';
import { showToast } from './ui/toast';

async function bootstrap() {
    // 1. Применяем тему и настройки
    applySettings(getSettings());

    // 2. Инициализируем базу данных
    try {
        await initDB();
        console.log('База данных готова к работе');
        // Здесь мы потом вызовем рендер заметок
    } catch (error) {
        console.error('Ошибка инициализации БД:', error);
        showToast('Ошибка хранилища. Данные могут не сохраниться.');
    }
}

bootstrap();