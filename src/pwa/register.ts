import { registerSW } from 'virtual:pwa-register';
import { showToast } from '../ui/toast';

export function setupPWA() {
    if ('serviceWorker' in navigator) {
        registerSW({
            onNeedRefresh() {
                showToast('Доступно обновление приложения! Перезагрузите страницу.', 10000);
            },
            onOfflineReady() {
                showToast('Приложение готово к работе офлайн! 📴', 5000);
            },
        });
    }
}