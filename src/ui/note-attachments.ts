import { Note } from '../types';
import { saveMedia, deleteMedia, getMedia } from '../storage/db';
import { compressImage, generateMediaId } from '../utils/media';
import { showToast } from './toast';

export function setupAttachments(card: HTMLElement, note: Note) {
    const fileInput = card.querySelector('.file-input') as HTMLInputElement;
    const previewsContainer = card.querySelector('.attachment-previews') as HTMLElement;
    let tempUrls: string[] = [];

    const renderPreviews = async () => {
        if (!previewsContainer) return;
        
        // Очищаем старые Blob-ссылки, чтобы не текла память
        tempUrls.forEach(url => URL.revokeObjectURL(url));
        tempUrls = [];
        previewsContainer.innerHTML = '';

        for (const att of note.attachments) {
            const blob = await getMedia(att.id);
            if (!blob) continue;

            const chip = document.createElement('div');
            chip.className = 'preview-chip';
            
            if (att.type.startsWith('image/')) {
                const url = URL.createObjectURL(blob);
                tempUrls.push(url);
                chip.innerHTML = `
                    <img src="${url}" class="preview-thumb">
                    <button type="button" class="remove-file" data-id="${att.id}">✖</button>
                `;
            } else {
                chip.innerHTML = `
                    <span class="preview-name">📄 ${att.name}</span>
                    <button type="button" class="remove-file" data-id="${att.id}">✖</button>
                `;
            }
            previewsContainer.appendChild(chip);
        }

        // Обработчики удаления
        previewsContainer.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = (btn as HTMLElement).dataset.id!;
                note.attachments = note.attachments.filter((a: { id: string }) => a.id !== id);
                await deleteMedia(id);
                renderPreviews();
            });
        });
    };

    renderPreviews();

    fileInput?.addEventListener('change', async (e) => {
        const files = Array.from((e.target as HTMLInputElement).files || []);
        if (files.length === 0) return;

        for (const file of files) {
            try {
                const blob = file.type.startsWith('image/') ? await compressImage(file) : file;
                const mediaId = generateMediaId();
                await saveMedia(mediaId, blob);
                note.attachments.push({ id: mediaId, type: file.type, name: file.name });
            } catch (err) {
                showToast(`Ошибка: ${file.name}`);
            }
        }
        fileInput.value = '';
        renderPreviews();
    });
}