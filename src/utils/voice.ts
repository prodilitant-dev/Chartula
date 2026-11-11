// Объявляем типы для SpeechRecognition (так как в TS их нет по умолчанию)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class VoiceRecognizer {
    private recognition: any;
    private isListening: boolean = false;

    constructor(
        private onResult: (text: string, isFinal: boolean) => void,
        private onEnd: () => void,
        private onError: (err: string) => void
    ) {
        if (!SpeechRecognition) {
            console.warn('Web Speech API не поддерживается браузером');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'ru-RU';
        this.recognition.continuous = true; // Не прерываться на паузах
        this.recognition.interimResults = true; // Показывать текст в процессе речи

        this.recognition.onresult = (event: any) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcript + ' ';
                } else {
                    interim += transcript;
                }
            }
            // Отдаем финальный текст и промежуточный (для "живого" ввода)
            this.onResult(final || interim, !!final);
        };

        this.recognition.onerror = (event: any) => {
            this.isListening = false;
            this.onError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.onEnd();
        };
    }

    public start() {
        if (!this.recognition || this.isListening) return;
        this.isListening = true;
        try {
            this.recognition.start();
        } catch (e) {
            console.error(e);
        }
    }

    public stop() {
        if (!this.recognition || !this.isListening) return;
        this.isListening = false;
        this.recognition.stop();
    }

    public isSupported(): boolean {
        return !!this.recognition;
    }
}