import JSZip from 'jszip';
import { getAllNotes, saveNote, getAllMedia, saveMedia } from './db';
import { Note } from '../types';
import { showToast } from '../ui/toast';

export async function exportData() {
    try {
        const zip = new JSZip();
        const notes = await getAllNotes();
        const media = await getAllMedia();

        // Сохраняем заметки в JSON
        zip.file('notes.json', JSON.stringify(notes, null, 2));

        // Сохраняем медиафайлы
        const mediaFolder = zip.folder('media');
        media.forEach(m => {
            if (m.blob) mediaFolder?.file(m.id, m.blob);
        });

        // Генерируем архив и скачиваем
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Chartula_Backup_${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        
        showToast('Резервная копия успешно создана!');
    } catch (error) {
        console.error(error);
        showToast('Ошибка экспорта данных');
    }
}

export async function importData(file: File) {
    try {
        const zip = await JSZip.loadAsync(file);
        
        // Восстанавливаем заметки
        const notesFile = zip.file('notes.json');
        if (notesFile) {
            const notesJson = await notesFile.async('string');
            const importedNotes: Note[] = JSON.parse(notesJson);
            
            for (const note of importedNotes) {
                await saveNote(note);
            }
        }

        // Восстанавливаем медиа
        const mediaFolder = zip.folder('media');
        if (mediaFolder) {
            const entries: Promise<void>[] = [];
            mediaFolder.forEach((relativePath, zipEntry) => {
                if (!zipEntry.dir) {
                    entries.push(
                        zipEntry.async('blob').then(blob => saveMedia(relativePath, blob))
                    );
                }
            });
            await Promise.all(entries);
        }

        showToast('Данные успешно импортированы!');
        setTimeout(() => window.location.reload(), 1500); // Перезагружаем для обновления
    } catch (error) {
        console.error(error);
        showToast('Ошибка импорта: неверный формат файла');
    }
}