import { Note } from '../types';
import { saveMedia, deleteMedia, getMedia, saveNote } from '../storage/db';
import { compressImage, generateMediaId } from '../utils/media';
import { showToast } from './toast';

export function setupAttachments(card: HTMLElement, note: Note) {
    const fileInput = card.querySelector('.file-input') as HTMLInputElement;
    const previewsContainer = card.querySelector('.attachment-previews') as HTMLElement;
    let tempUrls: string[] = [];

    const renderPreviews = async () => {
        if (!previewsContainer) return;
        
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
                const icon = att.type.startsWith('audio/') ? '🎵' : '📄';
                chip.innerHTML = `
                    <span class="preview-name">${icon} ${att.name}</span>
                    <button type="button" class="remove-file" data-id="${att.id}">✖</button>
                `;
            }
            previewsContainer.appendChild(chip);
        }

        previewsContainer.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = (btn as HTMLElement).dataset.id!;
                note.attachments = note.attachments.filter((a: { id: string }) => a.id !== id);
                await deleteMedia(id);
                await saveNote(note);
                renderPreviews();
            });
        });
    };

    renderPreviews();

    card.addEventListener('attachment-added', renderPreviews);

    fileInput?.addEventListener('change', async (e) => {
        const files = Array.from((e.target as HTMLInputElement).files || []);
        if (files.length === 0) return;

        for (const file of files) {
            try {
                const isImage = file.type.startsWith('image/');
                const blob = isImage ? await compressImage(file) : file;
                const mediaId = generateMediaId();
                
                await saveMedia(mediaId, blob);
                note.attachments.push({ id: mediaId, type: file.type, name: file.name });

                // --- МГНОВЕННЫЙ ФОН ---
                if (isImage) {
                    const url = URL.createObjectURL(blob);
                    card.style.backgroundImage = `url(${url})`;
                    card.classList.add('has-bg-image');
                }
            } catch {
                showToast(`Ошибка загрузки: ${file.name}`);
            }
        }
        
        await saveNote(note);
        note.updatedAt = Date.now(); 

        fileInput.value = '';
        renderPreviews();
    });
}