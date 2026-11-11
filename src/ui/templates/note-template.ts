import { Note } from '../../types';
import { escapeHtml, formatDate } from '../../utils/dom';

export function createViewHTML(note: Note): string {
    const tagsHTML = note.tags.length > 0 
        ? note.tags.map((t: string) => `<span class="tag">#${escapeHtml(t)}</span>`).join('') 
        : '';

    const attachmentsBtn = note.attachments.length > 0
        ? `<button class="action-btn view-files-btn" title="Вложения">📎 ${note.attachments.length}</button>`
        : '';

    return `
        <div class="note-view-mode">
            <div class="note-header">
                <div class="note-title">${escapeHtml(note.title || 'Без названия')}</div>
                <span class="note-date">${formatDate(note.createdAt)}</span>
            </div>
            <div class="note-text">${escapeHtml(note.text)}</div>
            <div class="note-tags">${tagsHTML}</div>
            
            <div class="note-actions">
                ${attachmentsBtn}
                <div style="flex:1"></div>
                <button class="action-btn pin-btn ${note.isPinned ? 'active' : ''}" title="Закрепить">📌</button>
                <button class="action-btn edit-btn" title="Редактировать">✏️</button>
                <button class="action-btn delete-btn" title="Удалить">🗑️</button>
            </div>
        </div>
    `;
}

export function createEditHTML(note: Note): string {
    return `
        <div class="note-edit-mode">
            <input type="text" class="edit-title" placeholder="Заголовок" value="${escapeHtml(note.title)}">
            <textarea class="edit-text" placeholder="Текст заметки...">${escapeHtml(note.text)}</textarea>
            <input type="text" class="edit-tags" placeholder="Теги (через запятую)" value="${escapeHtml(note.tags.join(', '))}">
            
            <div class="edit-attachments-area">
                <div class="attachment-previews" id="previews-${note.id}"></div>
                <div class="edit-toolbar">
                    <label class="btn add-file-btn">
                        📎 Добавить файл
                        <input type="file" class="file-input" multiple accept="*/*" style="display:none;">
                    </label>
                    <button type="button" class="btn voice-btn" title="Голосовой ввод">🎤 Диктовать</button>
                </div>
            </div>
    `;
}