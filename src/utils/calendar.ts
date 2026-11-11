import { Note } from '../types';

export function downloadICS(note: Note) {
    if (!note.reminder) return;

    const startDate = new Date(note.reminder);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 час

    // Формат даты для календаря (UTC): YYYYMMDDTHHmmssZ
    const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    // Экранируем спецсимволы для формата ICS
    const escapeText = (text: string) => text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

    const title = note.title || 'Заметка из Chartula';
    const description = note.text || '';

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Chartula//Notes//RU',
        'BEGIN:VEVENT',
        `UID:${note.id}@chartula.app`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:${escapeText(title)}`,
        `DESCRIPTION:${escapeText(description)}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reminder_${note.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}