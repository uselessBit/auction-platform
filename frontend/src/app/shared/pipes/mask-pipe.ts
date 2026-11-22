import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask',
  standalone: true,
})
export class MaskPipe implements PipeTransform {
  transform(
    value: string | number | null | undefined,
    visibleCount: number = 2,
    fixedStars?: number,
    maskPosition: 'start' | 'end' = 'start',
    maskChar = '*',
  ): string {
    if (value === null || value === undefined) {
      return '';
    }

    const str = String(value);

    if (str.length <= visibleCount) {
      return str;
    }

    const visiblePart =
      maskPosition === 'start' ? str.slice(-visibleCount) : str.slice(0, visibleCount);
    const starsCount = fixedStars !== undefined ? fixedStars : str.length - visibleCount;
    const maskedPart = maskChar.repeat(starsCount);

    return maskPosition === 'start' ? maskedPart + visiblePart : visiblePart + maskedPart;
  }
}
