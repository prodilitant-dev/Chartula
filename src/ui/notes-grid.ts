import { getAllNotes } from '../storage/db';
import { createNoteCard } from './note-card';
import { Note } from '../types';

const grid = document.getElementById('notes-grid') as HTMLElement;
const filterSelect = document.getElementById('category-filter') as HTMLSelectElement;

export async function renderNotes() {
    const notes = await getAllNotes();
    const currentFilter = filterSelect.value;

    // 1. Собираем все уникальные теги из всех заметок
    const allTags = new Set<string>();
    notes.forEach(n => n.tags.forEach(t => allTags.add(t)));

    // 2. Перестраиваем селект
    filterSelect.innerHTML = `
        <option value="all">Все</option>
        <option value="__pinned__">📌 Закреплённые</option>
    `;
    Array.from(allTags).sort().forEach(tag => {
        const opt = document.createElement('option');
        opt.value = tag;
        opt.textContent = `#${tag}`;
        filterSelect.appendChild(opt);
    });

    // Восстанавливаем выбранный фильтр, если он еще существует
    if (Array.from(filterSelect.options).some(o => o.value === currentFilter)) {
        filterSelect.value = currentFilter;
    } else {
        filterSelect.value = 'all';
    }

    // 3. Фильтруем и сортируем
    const filtered = notes.filter(n => {
        if (filterSelect.value === '__pinned__') return n.isPinned;
        if (filterSelect.value === 'all') return true;
        return n.tags.includes(filterSelect.value);
    });

    filtered.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt - a.createdAt;
    });

    // 4. Рендерим
    grid.innerHTML = '';
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="width:100%; text-align:center; color:var(--text-muted); padding:50px;">Нет заметок по этому фильтру.</div>';
        return;
    }

    filtered.forEach(note => {
        const card = createNoteCard(note, renderNotes);
        grid.appendChild(card);
    });
}

// ВОЗВРАЩАЕМ ФУНКЦИЮ СОЗДАНИЯ ЗАМЕТКИ
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

    // Убираем заглушку, если она есть
    if (grid.innerHTML.includes('Нет заметок')) {
        grid.innerHTML = '';
    }

    // Создаем карточку и ставим её в начало
    const card = createNoteCard(newNote, renderNotes, true);
    grid.prepend(card);
}