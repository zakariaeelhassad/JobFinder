import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateAgo',
    standalone: true
})
export class DateAgoPipe implements PipeTransform {
    transform(value: string | Date): string {
        if (!value) return '';

        const date = new Date(value);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const intervals: { [key: string]: number } = {
            'an': 31536000,
            'mois': 2592000,
            'semaine': 604800,
            'jour': 86400,
            'heure': 3600,
            'minute': 60,
            'seconde': 1
        };

        for (const [name, secondsInInterval] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInInterval);
            if (interval >= 1) {
                return interval === 1
                    ? `Il y a 1 ${name}`
                    : `Il y a ${interval} ${name}${name !== 'mois' ? 's' : ''}`;
            }
        }

        return 'À l\'instant';
    }
}
