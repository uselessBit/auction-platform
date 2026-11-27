import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true,
})
export class PhonePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 12 && numbers.startsWith('375')) {
      return numbers.replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/, '+$1 ($2) $3-$4-$5');
    }

    return value;
  }
}
