import { getAllNotes } from '../storage/db';
import { createNoteCard } from './note-card';
import { Note } from '../types';

const grid = document.getElementById('notes-grid') as HTMLElement;
const filterSelect = document.getElementById('category-filter') as HTMLSelectElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement; // <-- Добавили поиск

// Мгновенная перерисовка при смене фильтра
filterSelect.addEventListener('change', () => renderNotes());

// Мгновенная перерисовка при вводе в поиск
searchInput.addEventListener('input', () => {
  // Если начинаем искать, сбрасываем фильтр категорий на "Все"
  // чтобы поиск проходил по всем заметкам
  if (searchInput.value.trim().length > 0 && filterSelect.value !== 'all') {
    filterSelect.value = 'all';
  }
  renderNotes();
});

export async function renderNotes() {
  const notes = await getAllNotes();
  const currentFilter = filterSelect.value;
  const query = searchInput.value.toLowerCase().trim();

  // 1. Собираем ТОЛЬКО первые теги (категории) для выпадающего списка
  const categories = new Set<string>();
  notes.forEach((n) => {
    if (n.tags && n.tags.length > 0) {
      const cat = n.tags[0].replace(/,/g, '').trim();
      if (cat) categories.add(cat);
    }
  });

  // 2. Перестраиваем селект
  filterSelect.innerHTML = `
        <option value="all">Все</option>
        <option value="__pinned__">📌 Закреплённые</option>
    `;
  Array.from(categories)
    .sort()
    .forEach((tag) => {
      const opt = document.createElement('option');
      opt.value = tag;
      opt.textContent = `#${tag}`;
      filterSelect.appendChild(opt);
    });

  // Восстанавливаем выбранный фильтр
  if (Array.from(filterSelect.options).some((o) => o.value === currentFilter)) {
    filterSelect.value = currentFilter;
  } else {
    filterSelect.value = 'all';
  }

  // 3. Фильтруем по категории И по поисковому запросу
    const filtered = notes.filter((n) => {
        let matchCategory: boolean; // Просто объявляем тип, без начального значения
        
        if (filterSelect.value === '__pinned__') {
            matchCategory = n.isPinned;
        } else if (filterSelect.value === 'all') {
            matchCategory = true;
        } else {
            const noteCat = n.tags[0] ? n.tags[0].replace(/,/g, '').trim() : '';
            matchCategory = noteCat === filterSelect.value;
        }

        if (!matchCategory) return false;

    // --- Проверка поискового запроса ---
    if (query.length > 0) {
      const titleMatch = (n.title || '').toLowerCase().includes(query);
      const textMatch = (n.text || '').toLowerCase().includes(query);
      const tagsMatch = n.tags.some((t) => t.toLowerCase().includes(query));

      // Если ни в заголовке, ни в тексте, ни в тегах нет совпадений — скрываем
      if (!titleMatch && !textMatch && !tagsMatch) {
        return false;
      }
    }

    return true;
  });

  // 4. Сортируем
  filtered.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt - a.createdAt;
  });

  // 5. Рендерим
  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML =
      '<div style="width:100%; text-align:center; color:var(--text-muted); padding:50px;">Ничего не найдено.</div>';
    return;
  }

  filtered.forEach((note) => {
    const card = createNoteCard(note, renderNotes);
    grid.appendChild(card);
  });
}

export function addNewNote() {
  const newNote: Note = {
    id: Date.now(),
    title: '',
    text: '',
    tags: [],
    color: 'yellow',
    isPinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    attachments: [],
  };

  if (grid.innerHTML.includes('Нет заметок')) {
    grid.innerHTML = '';
  }

  const card = createNoteCard(newNote, renderNotes, true);
  grid.prepend(card);
}
