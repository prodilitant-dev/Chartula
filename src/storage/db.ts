import { Note } from '../types';

const DB_NAME = 'ChartulaDB';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export function initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;
            if (!database.objectStoreNames.contains('notes')) {
                database.createObjectStore('notes', { keyPath: 'id' });
            }
            if (!database.objectStoreNames.contains('media')) {
                database.createObjectStore('media', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve();
        };

        request.onerror = () => {
            console.error('Ошибка открытия IndexedDB');
            reject(request.error);
        };
    });
}

// --- РАБОТА С ЗАМЕТКАМИ ---

export function getAllNotes(): Promise<Note[]> {
    return new Promise((resolve, reject) => {
        if (!db) return reject('БД не инициализирована');
        const tx = db.transaction('notes', 'readonly');
        const store = tx.objectStore('notes');
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function saveNote(note: Note): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!db) return reject('БД не инициализирована');
        const tx = db.transaction('notes', 'readwrite');
        const store = tx.objectStore('notes');
        const request = store.put(note);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export function deleteNote(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!db) return reject('БД не инициализирована');
        const tx = db.transaction('notes', 'readwrite');
        const store = tx.objectStore('notes');
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// --- РАБОТА С ФАЙЛАМИ (МЕДИА) ---

export function saveMedia(id: string, blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!db) return reject('БД не инициализирована');
        const tx = db.transaction('media', 'readwrite');
        const store = tx.objectStore('media');
        const request = store.put({ id, blob });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export function getMedia(id: string): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
        if (!db) return reject('БД не инициализирована');
        const tx = db.transaction('media', 'readonly');
        const store = tx.objectStore('media');
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result ? request.result.blob : null);
        request.onerror = () => reject(request.error);
    });
}

export function deleteMedia(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!db) return reject('БД не инициализирована');
        const tx = db.transaction('media', 'readwrite');
        const store = tx.objectStore('media');
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}