import { createSettingsHTML } from './templates/settings-template';
import { getSettings, saveSettings } from '../storage/settings';
import { exportData, importData } from '../storage/backup';
import { getAllNotes } from '../storage/db';
import { renderNotes } from './notes-grid';

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

  // Защита от ошибки "Cannot set properties of null"
  if (!selectTheme || !selectFontSize || !selectGrid || !catList) {
    console.error('Ошибка: в HTML-шаблоне настроек не найдены нужные ID!');
    return;
  }

  const loadSettingsUI = () => {
    const s = getSettings();
    selectTheme.value = s.theme;
    selectFontSize.value = s.fontSize;
    selectGrid.value = s.gridCols || '1';
  };

  const renderCategoryColors = async () => {
    const notes = await getAllNotes();
    const categories = Array.from(new Set(notes.map((n) => n.tags[0]).filter(Boolean))) as string[];
    const s = getSettings();

    if (categories.length === 0) {
      catList.innerHTML =
        '<p style="font-size:0.8rem; color:var(--text-muted);">Нет доступных категорий.</p>';
      return;
    }

    catList.innerHTML = categories
      .map((cat) => {
        const currentColor = s.categoryColors[cat] || 1;

        let dots = '';
        for (let i = 1; i <= 10; i++) {
          dots += `<div class="color-dot c${i} ${i === currentColor ? 'selected' : ''}" data-cat="${cat}" data-color="${i}"></div>`;
        }

        return `
                <div class="cat-color-row">
                    <span class="cat-name">${cat}</span>
                    <div class="cat-dots">${dots}</div>
                </div>
            `;
      })
      .join('');

    catList.querySelectorAll('.color-dot').forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const cat = el.dataset.cat!;
        const colorIdx = parseInt(el.dataset.color!);

        const current = getSettings();
        current.categoryColors[cat] = colorIdx;
        saveSettings({ categoryColors: current.categoryColors });

        renderCategoryColors();
        renderNotes();
      });
    });
  };

  document.getElementById('settings-link')?.addEventListener('click', () => {
    loadSettingsUI();
    renderCategoryColors();
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  selectTheme.addEventListener('change', () => saveSettings({ theme: selectTheme.value as any }));
  selectFontSize.addEventListener('change', () =>
    saveSettings({ fontSize: selectFontSize.value as any })
  );
  selectGrid.addEventListener('change', () => saveSettings({ gridCols: selectGrid.value as any }));

  document.getElementById('btn-export')?.addEventListener('click', exportData);
  const inputImport = document.getElementById('input-import') as HTMLInputElement;
  inputImport.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) importData(file);
    inputImport.value = '';
  });
}
