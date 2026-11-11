import { Note } from '../types';
import { saveMedia, saveNote } from '../storage/db';
import { generateMediaId } from '../utils/media';
import { showToast } from './toast';

export function setupAudioRecorder(card: HTMLElement, note: Note) {
  const recordBtn = card.querySelector('.voice-btn') as HTMLButtonElement;
  if (!recordBtn) return;

  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];

  recordBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      recordBtn.classList.remove('recording');
      recordBtn.innerHTML = '🎙️ Записать';
      return;
    }

    try {
      // Проверяем, есть ли вообще устройства для записи
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudio = devices.some((device) => device.kind === 'audioinput');

      if (!hasAudio) {
        showToast('Микрофон не найден. Проверьте подключение.', 5000);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const mediaId = generateMediaId();

        await saveMedia(mediaId, audioBlob);
        note.attachments.push({
          id: mediaId,
          type: 'audio/webm',
          name: `Голос (${new Date().toLocaleTimeString('ru-RU').slice(0, 5)})`,
        });

        await saveNote(note);
        stream.getTracks().forEach((track) => track.stop());
        showToast('Голос сохранен');

        card.dispatchEvent(new CustomEvent('attachment-added'));
      };

      mediaRecorder.start();
      recordBtn.classList.add('recording');
      recordBtn.innerHTML = '⏹️ Стоп';
    } catch (err: any) {
      console.error(err);
      // Различаем ошибки доступа
      if (err.name === 'NotAllowedError') {
        showToast('Вы запретили доступ к микрофону в настройках браузера');
      } else if (err.name === 'NotFoundError') {
        showToast('Микрофон не обнаружен на этом устройстве');
      } else {
        showToast('Ошибка записи звука');
      }
    }
  });
}
