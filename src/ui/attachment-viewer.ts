import { Note } from '../types';
import { getMedia } from '../storage/db';
import { createAttachmentModalHTML } from './templates/attachment-modal-template';

let objectUrls: string[] = []; // Храним ссылки для очистки памяти

export function initAttachmentViewer() {
    const root = document.getElementById('modal-root');
    if (!root || document.getElementById('attachment-modal')) return;

    root.insertAdjacentHTML('beforeend', createAttachmentModalHTML());
    
    const modal = document.getElementById('attachment-modal')!;
    document.getElementById('close-attachment')?.addEventListener('click', () => {
        modal.classList.remove('active');
        clearUrls();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            clearUrls();
        }
    });
}

export async function showAttachments(note: Note) {
    const modal = document.getElementById('attachment-modal')!;
    const gallery = document.getElementById('attachment-gallery')!;
    gallery.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Загрузка...</p>';
    modal.classList.add('active');
    clearUrls();

    let html = '';
    for (const att of note.attachments) {
        const blob = await getMedia(att.id);
        if (!blob) continue;
        
        const url = URL.createObjectURL(blob);
        objectUrls.push(url);

        if (att.type.startsWith('image/')) {
            html += `
                <div class="att-item">
                    <img src="${url}" alt="${att.name}" style="max-width:100%; max-height:60vh; border-radius:12px; object-fit:contain;">
                    <a href="${url}" download="${att.name}" class="btn" style="margin-top:10px; font-size:0.8rem;">💾 Скачать</a>
                </div>
            `;
        } else {
            html += `
                <div class="att-item" style="text-align:center; padding:20px;">
                    <p style="margin-bottom:10px; color:var(--text);">📄 ${att.name}</p>
                    <a href="${url}" download="${att.name}" class="btn">💾 Скачать</a>
                </div>
            `;
        }
    }
    gallery.innerHTML = html || '<p style="text-align:center; color:var(--text-muted);">Файлы не найдены</p>';
}

function clearUrls() {
    objectUrls.forEach(url => URL.revokeObjectURL(url));
    objectUrls = [];
}