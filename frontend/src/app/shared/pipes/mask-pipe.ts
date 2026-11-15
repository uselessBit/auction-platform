import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask',
  standalone: true,
})
export class MaskPipe implements PipeTransform {
  transform(
    value: string | number | null | undefined,
    visibleCount = 2,
    fixedStars?: number,
  ): string {
    if (value === null || value === undefined) {
      return '';
    }

    const str = String(value);

    if (str.length <= visibleCount) {
      return str;
    }

    const visiblePart = str.slice(-visibleCount);
    const starsCount = fixedStars !== undefined ? fixedStars : str.length - visibleCount;
    const maskedPart = '*'.repeat(starsCount);

    return maskedPart + visiblePart;
  }
}
