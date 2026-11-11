import { Note } from '../../types';
import { escapeHtml, formatDate } from '../../utils/dom';

export function createViewHTML(note: Note): string {
  // Первый тег - категория
  const category = note.tags[0] || 'Без категории';
  // Остальные теги
  const otherTags = note.tags.slice(1);

  const tagsHTML =
    otherTags.length > 0
      ? otherTags.map((t: string) => `<span class="tag">#${escapeHtml(t)}</span>`).join('')
      : '';

  const attachmentsBtn =
    note.attachments.length > 0
      ? `<button type="button" class="action-btn view-files-btn" title="Вложения">📎 ${note.attachments.length}</button>`
      : '';

  const audioAtt = note.attachments.find((a: { type: string; name: string }) => {
    const isAudioMime = a.type && a.type.startsWith('audio/');
    const isAudioExt = a.name && /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(a.name);
    return isAudioMime || isAudioExt;
  });

  const playBtn = audioAtt
    ? `<button type="button" class="action-btn play-audio-btn" data-id="${audioAtt.id}" title="Слушать">▶️</button>`
    : '';

  return `
        <div class="note-view-mode">
            <div class="note-header">
                <div class="note-title">${escapeHtml(note.title || 'Без названия')}</div>
                <div class="note-meta">
                    <span class="note-category">${escapeHtml(category)}</span>
                    <span class="note-date">${formatDate(note.createdAt)}</span>
                </div>
            </div>
            <div class="note-text">${escapeHtml(note.text)}</div>
            <div class="note-tags">${tagsHTML}</div>
            
            <div class="note-actions">
                ${playBtn}
                ${attachmentsBtn}
                <div style="flex:1"></div>
                <button type="button" class="action-btn pin-btn ${note.isPinned ? 'active' : ''}" title="Закрепить">📌</button>
                <button type="button" class="action-btn delete-btn" title="Удалить">🗑️</button>
            </div>
        </div>
    `;
}

export function createEditHTML(note: Note): string {
  return `
        <div class="note-edit-mode">
            <input type="text" class="edit-title" placeholder="Заголовок" value="${escapeHtml(note.title)}">
            <textarea class="edit-text" placeholder="Текст заметки...">${escapeHtml(note.text)}</textarea>
            
            <!-- Подсказка: первый тег = категория -->
            <input type="text" class="edit-tags" placeholder="Категория тег тег..." value="${escapeHtml(note.tags.join(' '))}">
            
            <div class="edit-attachments-area">
                <div class="attachment-previews" id="previews-${note.id}"></div>
                <div class="edit-toolbar">
                    <label class="btn add-file-btn">
                        📎 Файл
                        <input type="file" class="file-input" multiple accept="*/*" style="display:none;">
                    </label>
                    <button type="button" class="btn voice-btn" title="Записать голос">🎙️ Записать</button>
                </div>
            </div>
        </div>
    `;
}

export function createSettingsHTML(): string {
  return `
        <div class="modal-overlay" id="settings-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>© 2026 Chartula.</h3>
                    <button class="close-btn" id="close-settings">✖</button>
                </div>

                <!-- ДАННЫЕ -->
                <div class="settings-section">
                    <div class="settings-header-row">
                        <h4>💾 Данные</h4>
                        <div class="settings-icon-row">
                            <button class="btn icon-only" id="btn-export" title="Экспорт (ZIP)">📦</button>
                            <label class="btn icon-only" title="Импорт (ZIP)">
                                📥
                                <input type="file" id="input-import" accept=".zip" style="display:none;">
                            </label>
                        </div>
                    </div>
                </div>

                <!-- ВНЕШНИЙ ВИД -->
                <div class="settings-section">
                    <h4>🎨 Внешний вид</h4>
                    <div class="setting-row">
                        <span>Тема</span>
                        <select id="select-theme" class="filter-select">
                            <option value="system">Системная</option>
                            <option value="dark">Тёмная</option>
                            <option value="light">Светлая</option>
                        </select>
                    </div>
                    <div class="setting-row">
                        <span>Размер интерфейса</span>
                        <select id="select-fontsize" class="filter-select">
                            <option value="small">Мелкий</option>
                            <option value="medium">Средний</option>
                            <option value="large">Крупный</option>
                        </select>
                    </div>
                    <div class="setting-row">
                        <span>Сетка</span>
                        <select id="select-grid" class="filter-select">
                            <option value="1">1 колонка</option>
                            <option value="2">2 колонки</option>
                        </select>
                    </div>
                </div>

                <!-- ЦВЕТА КАТЕГОРИЙ -->
                <div class="settings-section" style="border-bottom: none; padding-bottom: 0;">
                    <h4>🏷️ Цвета категорий</h4>
                    <div id="category-colors-list" class="category-colors-list">
                        <!-- Сюда JS вставит список -->
                    </div>
                </div>

                <!-- ОБ АВТОРЕ -->
                <details class="settings-details" style="margin-top: 10px; border-top: 1px dashed var(--border); padding-top: 15px;">
                    <summary>👤 Об авторе</summary>
                    <div class="about-content">
                        <p>Привет. Меня зовут Виталий. Я — <strong>ПроДилИтант</strong>.</p>
                        <p>Делаю легкие приложения без рекламы и подписок, пилю доски и делаю всякие разности. Честно. Грязно. Полезно.</p>
                    
                        
                        <!-- Кнопка поддержки (заглушка) -->
                        <button class="btn btn-support" id="btn-support" style="width: 100%;">
                            🤘 Поддержать автора 🤘
                        </button>

                            <p style="color: var(--accent); font-family: var(--font-hand); font-size: 1.5rem; margin-top: 15px; margin-bottom: 15px;">Pank immortalis est.</p>

                    </div>
                </details>
            </div>
        </div>
    `;
}
