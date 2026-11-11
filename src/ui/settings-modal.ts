import { createSettingsHTML } from './templates/settings-template';
import { getSettings, saveSettings } from '../storage/settings';
import { exportData, importData } from '../storage/backup';
import { getAllNotes } from '../storage/db';
import { renderNotes } from './notes-grid';
import { showToast } from './toast';
import { checkForUpdates } from '../pwa/register';

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function initSettingsModal() {
    const root = document.getElementById('modal-root');
    if (!root) return;

    root.innerHTML = createSettingsHTML();

    const modal = document.getElementById('settings-modal')!;
    const closeBtn = document.getElementById('close-settings')!;
    
    const selectTheme = document.getElementById('select-theme') as HTMLSelectElement;
    const selectFontSize = document.getElementById('select-fontsize') as HTMLSelectElement;
    const selectGrid = document.getElementById('select-grid') as HTMLSelectElement;
    const catList = document.getElementById('category-colors-list') as HTMLElement;

    if (!selectTheme || !selectFontSize || !selectGrid || !catList) return;

    // Названия цветов (в том же порядке, что и классы c1-c10)
    const colorNames = [
        'Желтый', 'Голубой', 'Зеленый', 'Розовый', 'Фиолетовый', 
        'Оранжевый', 'Бирюзовый', 'Индиго', 'Красный', 'Серый'
    ];

    const loadSettingsUI = () => {
        const s = getSettings();
        selectTheme.value = s.theme;
        selectFontSize.value = s.fontSize;
        selectGrid.value = s.gridCols || '1';
    };

    const renderCategoryColors = async () => {
        const notes = await getAllNotes();
        
        // Собираем только первые теги (категории) и убираем дубликаты
        const categories = Array.from(new Set(
            notes
                .filter(n => n.tags && n.tags.length > 0)
                .map(n => n.tags[0].replace(/,/g, '').trim())
                .filter(Boolean)
        )) as string[];
        
        const s = getSettings();
        
        if (categories.length === 0) {
            catList.innerHTML = '<p style="font-size:0.8rem; color:var(--text-muted);">Нет категорий</p>';
            return;
        }

        catList.innerHTML = categories.map(cat => {
            const currentColorIdx = s.categoryColors[cat] || 1;
            
            let optionsHTML = '';
            colorNames.forEach((name, index) => {
                const colorIdx = index + 1;
                const selected = colorIdx === currentColorIdx ? 'selected' : '';
                optionsHTML += `<option value="${colorIdx}" ${selected}>${name}</option>`;
            });

            return `
                <div class="cat-color-row">
                    <span class="cat-name">${cat}</span>
                    <select class="filter-select cat-color-select" data-cat="${cat}">
                        ${optionsHTML}
                    </select>
                </div>
            `;
        }).join('');

        // Обработчик изменения цвета в выпадающем списке
        catList.querySelectorAll('.cat-color-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const el = e.target as HTMLSelectElement;
                const cat = el.dataset.cat!;
                const colorIdx = parseInt(el.value);
                
                const current = getSettings();
                current.categoryColors[cat] = colorIdx;
                saveSettings({ categoryColors: current.categoryColors });
                
                // Мгновенно перерисовываем заметки на фоне
                renderNotes(); 
            });
        });
    };

        const updateStorageInfo = async () => {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            const usage = estimate.usage || 0;
            const quota = estimate.quota || 0;

            const usedEl = document.getElementById('storage-used')!;
            const quotaEl = document.getElementById('storage-quota')!;
            const barEl = document.getElementById('storage-bar')!;

            usedEl.textContent = formatBytes(usage);
            quotaEl.textContent = formatBytes(quota);

            const percent = quota > 0 ? (usage / quota) * 100 : 0;
            barEl.style.width = `${Math.min(percent, 100)}%`;
        } else {
            document.getElementById('storage-info')!.innerHTML = 'Информация недоступна в этом браузере.';
        }
    };

    document.getElementById('settings-link')?.addEventListener('click', () => {
        loadSettingsUI();
        renderCategoryColors();
        updateStorageInfo(); // <-- ДОБАВИТЬ ЭТО
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    // Обработчики базовых настроек
    selectTheme.addEventListener('change', () => saveSettings({ theme: selectTheme.value as any }));
    selectFontSize.addEventListener('change', () => saveSettings({ fontSize: selectFontSize.value as any }));
    selectGrid.addEventListener('change', () => saveSettings({ gridCols: selectGrid.value as any }));

    // Экспорт / Импорт
    document.getElementById('btn-export')?.addEventListener('click', exportData);
    const inputImport = document.getElementById('input-import') as HTMLInputElement;
    inputImport.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) importData(file);
        inputImport.value = '';
    });

    // Кнопка поддержки автора
    document.getElementById('btn-support')?.addEventListener('click', () => {
        showToast('Донаты скоро появятся! Спасибо, что пользуетесь приложением ❤️', 5000);
    });

    // Проверка обновлений по клику на версию
    document.getElementById('app-version')?.addEventListener('click', async () => {
        await checkForUpdates(); // Убрали showToast, теперь он внутри функции
    });

        // Очистка всех данных
    document.getElementById('btn-clear-data')?.addEventListener('click', async () => {
        if (confirm('ВНИМАНИЕ! Все заметки и файлы будут навсегда удалены. Сделайте экспорт, если хотите сохранить их. Продолжить?')) {
            try {
                // Очищаем IndexedDB
                const req = indexedDB.deleteDatabase('ChartulaDB');
                req.onsuccess = () => {
                    localStorage.clear(); // Чистим и настройки
                    showToast('Все данные удалены. Перезагрузка...', 3000);
                    setTimeout(() => window.location.reload(), 1500);
                };
                req.onerror = () => showToast('Ошибка при очистке базы данных');
            } catch (e) {
                console.error(e);
                showToast('Ошибка очистки');
            }
        }
    });

}