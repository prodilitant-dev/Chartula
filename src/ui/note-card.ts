import { Note } from '../types';
import { saveNote, deleteNote } from '../storage/db';
import { createViewHTML, createEditHTML } from './templates/note-template';
import { setupAttachments } from './note-attachments';
import { showAttachments } from './attachment-viewer';

export function createNoteCard(
    note: Note, 
    onUpdate: () => void, 
    isNew: boolean = false
): HTMLElement {
    
    const card = document.createElement('div');
    card.className = `note-card color-${note.color} ${note.isPinned ? 'pinned' : ''}`;
    card.dataset.id = note.id.toString();

    // Случайный наклон для "живого" вида (только если это не новая заметка)
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

    // Инициализация вложений (логика прикрепления файлов)
    setupAttachments(card, note);

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
        // Если пустая новая заметка — удаляем её
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
                
                // Обновляем HTML в режиме просмотра (перерисовываем только viewMode)
                const viewHTML = createViewHTML(note);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = viewHTML;
                viewMode.innerHTML = tempDiv.querySelector('.note-view-mode')!.innerHTML;
                
                // Перенавешиваем события на кнопки (т.к. innerHTML перезаписал DOM)
                bindViewEvents();
                
                card.classList.remove('editing');
                editMode.style.display = 'none';
                viewMode.style.display = 'flex';
                onUpdate(); 
            });
        } else {
            // Отмена (Esc)
            if (isNew) card.remove();
            else {
                card.classList.remove('editing');
                card.style.transform = `rotate(${(Math.random() * 2 - 1).toFixed(1)}deg)`;
                editMode.style.display = 'none';
                viewMode.style.display = 'flex';
            }
        }
    }

    // --- СОБЫТИЯ РЕЖИМА ПРОСМОТРА ---
    function bindViewEvents() {
        // Редактировать
        card.querySelector('.edit-btn')?.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            enterEditMode(); 
        });
        
        // Удалить
        card.querySelector('.delete-btn')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm('Удалить заметку?')) {
                await deleteNote(note.id);
                card.style.transform = 'scale(0)';
                setTimeout(() => { card.remove(); onUpdate(); }, 300);
            }
        });

        // Закрепить
        card.querySelector('.pin-btn')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            note.isPinned = !note.isPinned;
            await saveNote(note);
            onUpdate();
        });

        // Просмотр вложений (открывает галерею)
        card.querySelector('.view-files-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            showAttachments(note);
        });
    }

    // Первичная привязка событий
    bindViewEvents(); 

    // --- СОБЫТИЯ РЕЖИМА РЕДАКТИРОВАНИЯ ---
    
    // Сохранение при потере фокуса (клик мимо карточки)
    editMode.addEventListener('focusout', (e) => {
        // Если фокус ушел на другой элемент ВНУТРИ карточки — ничего не делаем
        if (card.contains(e.relatedTarget as Node)) return;
        exitEditMode(true);
    });

    // Отмена по Esc
    editMode.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') exitEditMode(false);
    });

    // Авто-изменение высоты текстового поля
    textInput.addEventListener('input', () => autoResizeTextarea(textInput));

    // Если это новая заметка, активируем режим редактирования сразу
    if (isNew) {
        setTimeout(enterEditMode, 10);
    }

    return card;
}

// Вспомогательная функция для авто-высоты textarea
function autoResizeTextarea(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}