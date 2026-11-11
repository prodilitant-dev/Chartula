import { Note } from '../types';
import { saveNote, deleteNote } from '../storage/db';
import { createViewHTML, createEditHTML } from './templates/note-template';
import { setupAttachments } from './note-attachments';
import { showAttachments } from './attachment-viewer';
import { setupVoiceInput } from './note-voice';
import { toggleAudio, stopCurrentAudio } from './audio-player';

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

    card.innerHTML = `
        <div class="note-inner">
            ${createViewHTML(note)}
            ${createEditHTML(note)}
        </div>
    `;

    const viewMode = card.querySelector('.note-view-mode') as HTMLElement;
    const editMode = card.querySelector('.note-edit-mode') as HTMLElement;
    const titleInput = card.querySelector('.edit-title') as HTMLInputElement;
    const tagsInput = card.querySelector('.edit-tags') as HTMLInputElement;
    const textInput = card.querySelector('.edit-text') as HTMLTextAreaElement;

    setupAttachments(card, note);
    setupVoiceInput(card);

    // --- ПРЕДОХРАНИТЕЛЬ ДЛЯ ФАЙЛОВ ---
    // Не даем карточке закрыться, когда открыто системное окно выбора файлов
    let isFileDialogOpen = false;
    const addFileBtn = card.querySelector('.add-file-btn');
    addFileBtn?.addEventListener('mousedown', () => { isFileDialogOpen = true; });
    window.addEventListener('focus', () => { isFileDialogOpen = false; });

    function enterEditMode() {
        card.classList.add('editing');
        card.style.transform = 'rotate(0deg) scale(1.02)';
        viewMode.style.display = 'none';
        editMode.style.display = 'flex';
        titleInput.focus();
        autoResizeTextarea(textInput);
    }

    function exitEditMode(save = true) {
        if (isNew && !titleInput.value.trim() && !textInput.value.trim() && note.attachments.length === 0) {
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
                
                const viewHTML = createViewHTML(note);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = viewHTML;
                viewMode.innerHTML = tempDiv.querySelector('.note-view-mode')!.innerHTML;
                
                bindViewEvents();

                        card.querySelector('.view-files-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            showAttachments(note);
        });

        // Проигрывание аудио
        card.querySelector('.play-audio-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const btn = e.currentTarget as HTMLButtonElement;
            const mediaId = btn.dataset.id;
            if (mediaId) toggleAudio(btn, mediaId);
        });

        
                
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

    function bindViewEvents() {
        card.querySelector('.edit-btn')?.addEventListener('click', (e) => { e.stopPropagation(); enterEditMode(); });
        
        card.querySelector('.delete-btn')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm('Удалить заметку?')) {
                stopCurrentAudio(); 
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

        card.querySelector('.view-files-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            showAttachments(note);
        });

        // Воспроизведение аудио
        card.querySelector('.play-audio-btn')?.addEventListener('click', (e) => {
            e.preventDefault(); // На всякий случай
            e.stopPropagation();
            const btn = e.currentTarget as HTMLButtonElement;
            const mediaId = btn.dataset.id;
            if (mediaId) {
                toggleAudio(btn, mediaId);
            }
        });
    }

    bindViewEvents(); 

    editMode.addEventListener('focusout', (e: FocusEvent) => {
        // Если открыт выбор файлов — не закрываем карточку
        if (isFileDialogOpen) return;
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