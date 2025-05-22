import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeFormat', standalone: true })
export class TimeFormatPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (!value) return '0:00';
    const h = Math.floor(value / 3600);
    const m = Math.floor((value % 3600) / 60);
    const s = value % 60;
    return (h ? `${h}:` : '') + `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
