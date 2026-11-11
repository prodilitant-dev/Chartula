import { Note } from '../../types';
import { escapeHtml, formatDate } from '../../utils/dom';

export function createViewHTML(note: Note): string {
  // Берем остальные теги (все, кроме первого - категории)
  const otherTags = note.tags
    .slice(1)
    .map((t) => t.replace(/,/g, '').trim())
    .filter(Boolean);

  const tagsHTML =
    otherTags.length > 0
      ? otherTags.map((t: string) => `<span class="tag">#${escapeHtml(t)}</span>`).join('')
      : '';

  const attachmentsBtn =
    note.attachments.length > 0
      ? `<button type="button" class="action-btn view-files-btn" title="Вложений: ${note.attachments.length}">📎</button>`
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
                <span class="note-date">${formatDate(note.createdAt)}</span>
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
  // Собираем теги через пробел, убирая запятые
  const tagsValue = note.tags.map((t) => t.replace(/,/g, '')).join(' ');

  return `
        <div class="note-edit-mode">
            <input type="text" class="edit-title" placeholder="Заголовок" value="${escapeHtml(note.title)}">
            <textarea class="edit-text" placeholder="Текст заметки...">${escapeHtml(note.text)}</textarea>
            
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
