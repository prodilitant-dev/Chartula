import { getAllNotes } from '../storage/db';
import { createNoteCard } from './note-card';
import { Note } from '../types';

const grid = document.getElementById('notes-grid') as HTMLElement;

export async function renderNotes() {
    const notes = await getAllNotes();

    // Сортировка: сначала закрепленные, потом по дате создания (новые сверху)
    notes.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt - a.createdAt;
    });

    grid.innerHTML = '';

    if (notes.length === 0) {
        grid.innerHTML = '<div style="width:100%; text-align:center; color:var(--text-muted); padding:50px;">Нет заметок. Нажмите +, чтобы создать.</div>';
        return;
    }

    // Рендерим карточки
    notes.forEach(note => {
        const card = createNoteCard(note, renderNotes);
        grid.appendChild(card);
    });
}

export function addNewNote() {
    // Создаем черновик
    const newNote: Note = {
        id: Date.now(),
        title: '',
        text: '',
        tags: [],
        color: 'yellow',
        isPinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        attachments: []
    };

    // Убираем заглушку "Нет заметок", если она есть
    if (grid.innerHTML.includes('Нет заметок')) grid.innerHTML = '';

    // Создаем карточку и ставим её в начало
    const card = createNoteCard(newNote, renderNotes, true);
    grid.prepend(card);
}