// src/types/speech.d.ts
export {};

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
    
    // Минимальные типы для события, чтобы TS не ругался
    interface SpeechRecognitionEvent extends Event {
        resultIndex: number;
        results: SpeechRecognitionResultList;
    }
}