import { VoiceRecognizer } from '../utils/voice';
import { showToast } from './toast';

// Убрали note, так как голос работает напрямую с DOM-элементом
export function setupVoiceInput(card: HTMLElement) {
    const voiceBtn = card.querySelector('.voice-btn') as HTMLButtonElement;
    const textInput = card.querySelector('.edit-text') as HTMLTextAreaElement;

    if (!voiceBtn) return;

    // Проверяем поддержку браузера
    if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) {
        voiceBtn.style.display = 'none';
        return;
    }

    let baseText = ''; // Текст, который был до начала диктовки

    const recognizer = new VoiceRecognizer(
        // 1. Когда приходит текст
        (text, isFinal) => {
            textInput.value = baseText + text;
            textInput.dispatchEvent(new Event('input'));
            
            if (isFinal) {
                baseText = textInput.value; // Фиксируем финальный текст
            }
        },
        // 2. Когда распознавание останавливается само (или по кнопке)
        () => {
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '🎤 Диктовать';
        },
        // 3. Ошибки
        (error) => {
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '🎤 Диктовать';
            showToast(`Ошибка микрофона: ${error}`);
        }
    );

    // Обработка клика по кнопке микрофона
    voiceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (voiceBtn.classList.contains('recording')) {
            recognizer.stop();
        } else {
            baseText = textInput.value ? textInput.value + ' ' : '';
            voiceBtn.classList.add('recording');
            voiceBtn.innerHTML = '⏹️ Стоп';
            recognizer.start();
        }
    });

    const editMode = card.querySelector('.note-edit-mode') as HTMLElement;
    
        editMode?.addEventListener('focusout', (e: Event) => {
        const focusEvent = e as FocusEvent;
        if (card.contains(focusEvent.relatedTarget as Node)) return;
        recognizer.stop();
    });
}