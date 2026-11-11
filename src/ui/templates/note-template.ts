import { Note } from '../../types';
import { escapeHtml, formatDate } from '../../utils/dom';

export function createViewHTML(note: Note): string {
    const tagsHTML = note.tags.length > 0 
        ? note.tags.map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('') 
        : '';

    return `
        <div class="note-view-mode">
            <!-- Шапка: Название и Дата -->
            <div class="note-header">
                <div class="note-title">${escapeHtml(note.title || 'Без названия')}</div>
                <span class="note-date">${formatDate(note.createdAt)}</span>
            </div>
            
            <!-- Текст -->
            <div class="note-text">${escapeHtml(note.text)}</div>
            
            <!-- Теги (прижаты к низу) -->
            <div class="note-tags">${tagsHTML}</div>
            
            <!-- Кнопки (самый низ) -->
            <div class="note-actions">
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
        </div>
    `;
}