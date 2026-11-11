export function showToast(message: string, duration = 4000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    // Очищаем предыдущий таймер, если он был
    const toastElement = toast as HTMLElement & { _timer?: number };
    if (toastElement._timer) {
        clearTimeout(toastElement._timer);
    }

    toastElement._timer = window.setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}