import { registerSW } from 'virtual:pwa-register';
import { showToast } from '../ui/toast';

export function setupPWA() {
    if ('serviceWorker' in navigator) {
        registerSW({
            onNeedRefresh() {
                // Убираем навязчивый тост, чтобы не мешал
                console.log('Доступно обновление приложения');
            },
            onOfflineReady() {
                showToast('Приложение готово к работе офлайн! 📴', 5000);
            },
        });
    }
}

export async function checkForUpdates() {
    if (!('serviceWorker' in navigator)) {
        showToast('Ваш браузер не поддерживает PWA обновления');
        return;
    }

    // Проверяем, есть ли вообще активный Service Worker (в dev-режиме его нет)
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
        showToast('В режиме разработки проверка обновлений недоступна.', 6000);
        return;
    }

    showToast('Ищем обновления...', 2000);

    try {
        // Принудительно запрашиваем обновление
        await registration.update();

        // Ждем 2 секунды, чтобы SW успел скачаться
        setTimeout(() => {
            if (registration.waiting || registration.installing) {
                showToast('🎉 Найдено обновление! Закройте и откройте приложение заново.', 6000);
            } else {
                showToast('✅ У вас установлена последняя версия!', 4000);
            }
        }, 2000);

    } catch (error) {
        console.error('Update error:', error);
        showToast('⚠️ Не удалось проверить обновления', 4000);
    }
}