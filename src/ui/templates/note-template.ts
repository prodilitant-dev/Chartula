import { Note } from '../../types';
import { escapeHtml, formatDate } from '../../utils/dom';

export function createViewHTML(note: Note): string {
    const tags = note.tags || [];
    const attachments = note.attachments || [];

    const otherTags = tags.slice(1).map(t => t.replace(/,/g, '').trim()).filter(Boolean);
    
    const tagsHTML = otherTags.length > 0 
        ? otherTags.map((t: string) => `<span class="tag">#${escapeHtml(t)}</span>`).join('') 
        : '';

    const attachmentsBtn = attachments.length > 0
        ? `<button type="button" class="action-btn view-files-btn" title="Вложения">📎 ${attachments.length}</button>`
        : '';

    const audioAtt = attachments.find((a: { type: string, name: string }) => {
        const isAudioMime = a.type && a.type.startsWith('audio/');
        const isAudioExt = a.name && /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(a.name);
        return isAudioMime || isAudioExt;
    });

    const playBtn = audioAtt
        ? `<button type="button" class="action-btn play-audio-btn" data-id="${audioAtt.id}" title="Слушать">▶️</button>`
        : '';

    let reminderHTML = '';
    let calendarBtn = '';
    if (note.reminder) {
        const d = new Date(note.reminder);
        const dateStr = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        reminderHTML = `<div class="note-reminder-badge">⏰ ${dateStr}</div>`;
        calendarBtn = `<button type="button" class="action-btn add-to-calendar-btn" title="Добавить в календарь">📅</button>`;
    }

    return `
        <div class="note-view-mode">
            <div class="note-header">
                <div class="note-title">${escapeHtml(note.title || 'Без названия')}</div>
            </div>
            
            ${reminderHTML}
            
            <div class="note-text">${escapeHtml(note.text || '')}</div>
            <div class="note-tags">${tagsHTML}</div>
            
            <!-- ПОДВАЛ: Дата слева, кнопки справа -->
            <div class="note-footer">
                <span class="note-date">${formatDate(note.createdAt)}</span>
                <div class="note-actions">
                    ${playBtn}
                    ${attachmentsBtn}
                    ${calendarBtn}
                    <button type="button" class="action-btn pin-btn ${note.isPinned ? 'active' : ''}" title="Закрепить">📌</button>
                    <button type="button" class="action-btn delete-btn" title="Удалить">🗑️</button>
                </div>
            </div>
        </div>
    `;
}

export function createEditHTML(note: Note): string {
    const tags = note.tags || [];
    const tagsValue = tags.map(t => t.replace(/,/g, '')).join(' ');
    
    let reminderValue = '';
    if (note.reminder) {
        const d = new Date(note.reminder);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        reminderValue = d.toISOString().slice(0, 16);
    }

    return `
        <div class="note-edit-mode">
            <!-- ШАПКА РЕДАКТОРА: Заголовок слева, Напоминание справа -->
            <div class="edit-header">
                <input type="text" class="edit-title" placeholder="Заголовок" value="${escapeHtml(note.title || '')}">
                <input type="datetime-local" class="edit-reminder" title="Напоминание" value="${reminderValue}">
            </div>

            <textarea class="edit-text" placeholder="Текст заметки...">${escapeHtml(note.text || '')}</textarea>
            
            <!-- Теги на всю ширину -->
            <input type="text" class="edit-tags" placeholder="Категория тег тег..." value="${escapeHtml(tagsValue)}">
            
            <div class="edit-attachments-area">
                <div class="attachment-previews" id="previews-${note.id}"></div>
                <div class="edit-toolbar">
                    <label class="btn icon-only" title="Прикрепить файл">
                        📎
                        <input type="file" class="file-input" multiple accept="*/*" style="display:none;">
                    </label>
                    <button type="button" class="btn icon-only voice-btn" title="Записать голос">🎙️</button>
                </div>
            </div>
        </div>
    `;
}