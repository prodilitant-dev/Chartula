import { getMedia } from '../storage/db';
import { showToast } from './toast';

let currentAudio: HTMLAudioElement | null = null;
let currentBlobUrl: string | null = null;
let currentBtn: HTMLButtonElement | null = null;

export async function toggleAudio(btn: HTMLButtonElement, mediaId: string) {
  console.log('Клик по кнопке Play, ID:', mediaId);

  // 1. Пауза, если играет эта же кнопка
  if (currentBtn === btn && currentAudio) {
    if (currentAudio.paused) {
      await currentAudio.play().catch((e) => console.error('Play error:', e));
      btn.textContent = '⏸️';
    } else {
      currentAudio.pause();
      btn.textContent = '▶️';
    }
    return;
  }

  // 2. Останавливаем предыдущее
  stopCurrentAudio();

  try {
    const blob = await getMedia(mediaId);
    console.log('Данные из БД:', blob);

    if (!blob) {
      showToast('Аудиофайл не найден в БД');
      return;
    }

    // 3. Создаем URL
    currentBlobUrl = URL.createObjectURL(blob);
    currentAudio = new Audio(currentBlobUrl);
    currentBtn = btn;

    // Устанавливаем обработчики
    currentAudio.onended = () => {
      if (currentBtn) currentBtn.textContent = '▶️';
      stopCurrentAudio();
    };

    currentAudio.onerror = (e) => {
      console.error('Ошибка Audio элемента:', e);
      showToast('Ошибка формата. Попробуйте MP3.');
      stopCurrentAudio();
    };

    btn.textContent = '⏸️';

    // 4. Играем
    await currentAudio.play();
    console.log('Аудио успешно заиграло!');
  } catch (err) {
    console.error('Ошибка плеера:', err);
    showToast('Не удалось воспроизвести');
    if (btn) btn.textContent = '▶️';
  }
}

export function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = ''; // Очищаем
    currentAudio = null;
  }
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }
  if (currentBtn) {
    currentBtn.textContent = '▶️';
    currentBtn = null;
  }
}
