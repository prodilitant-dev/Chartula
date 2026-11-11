import { Note } from '../types';
import { saveNote, deleteNote } from '../storage/db';
import { createViewHTML, createEditHTML } from './templates/note-template';

export function createNoteCard(
    note: Note, 
    onUpdate: () => void, 
    isNew: boolean = false
): HTMLElement {
    
    const card = document.createElement('div');
    card.className = `note-card color-${note.color} ${note.isPinned ? 'pinned' : ''}`;
    card.dataset.id = note.id.toString();

    if (!isNew) {
        card.style.transform = `rotate(${(Math.random() * 2 - 1).toFixed(1)}deg)`;
    } else {
        card.classList.add('editing');
    }

    // Вставляем оба режима сразу
    card.innerHTML = `
        <div class="note-inner">
            ${createViewHTML(note)}
            ${createEditHTML(note)}
        </div>
    `;

    // --- ССЫЛКИ НА ЭЛЕМЕНТЫ ---
    const viewMode = card.querySelector('.note-view-mode') as HTMLElement;
    const editMode = card.querySelector('.note-edit-mode') as HTMLElement;
    
    const titleInput = card.querySelector('.edit-title') as HTMLInputElement;
    const tagsInput = card.querySelector('.edit-tags') as HTMLInputElement;
    const textInput = card.querySelector('.edit-text') as HTMLTextAreaElement;

    // --- ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ ---
    function enterEditMode() {
        card.classList.add('editing');
        card.style.transform = 'rotate(0deg) scale(1.02)';
        viewMode.style.display = 'none';
        editMode.style.display = 'flex';
        titleInput.focus();
        autoResizeTextarea(textInput);
    }

    function exitEditMode(save = true) {
        if (isNew && !titleInput.value.trim() && !textInput.value.trim()) {
            card.remove();
            return;
        }

        if (save) {
            note.title = titleInput.value.trim();
            note.text = textInput.value.trim();
            note.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
            note.updatedAt = Date.now();

            saveNote(note).then(() => {
                card.style.transform = `rotate(${(Math.random() * 2 - 1).toFixed(1)}deg)`;
                
                // Обновляем данные в режиме просмотра без полного перерендера
                (card.querySelector('.note-title') as HTMLElement).textContent = note.title || 'Без названия';
                (card.querySelector('.note-text') as HTMLElement).textContent = note.text;
                (card.querySelector('.note-tags') as HTMLElement).innerHTML = note.tags.map(t => `<span class="tag">#${t}</span>`).join('');
                
                card.classList.remove('editing');
                editMode.style.display = 'none';
                viewMode.style.display = 'flex';
                onUpdate(); 
            });
        } else {
            if (isNew) card.remove();
            else {
                card.classList.remove('editing');
                card.style.transform = `rotate(${(Math.random() * 2 - 1).toFixed(1)}deg)`;
                editMode.style.display = 'none';
                viewMode.style.display = 'flex';
            }
        }
    }

    // --- СОБЫТИЯ ---
    card.querySelector('.edit-btn')?.addEventListener('click', (e) => { e.stopPropagation(); enterEditMode(); });
    card.querySelector('.delete-btn')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Удалить заметку?')) {
            await deleteNote(note.id);
            card.style.transform = 'scale(0)';
            setTimeout(() => { card.remove(); onUpdate(); }, 300);
        }
    });
    card.querySelector('.pin-btn')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        note.isPinned = !note.isPinned;
        await saveNote(note);
        onUpdate();
    });

    editMode.addEventListener('focusout', (e) => {
        if (card.contains(e.relatedTarget as Node)) return;
        exitEditMode(true);
    });

    editMode.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') exitEditMode(false);
    });

    textInput.addEventListener('input', () => autoResizeTextarea(textInput));

    if (isNew) setTimeout(enterEditMode, 10);

    return card;
}

function autoResizeTextarea(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}