import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LotDetails } from '../../../../../core/models/lot.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lot-specs',
  imports: [],
  providers: [DatePipe],
  templateUrl: './lot-specs.component.html',
  styleUrl: './lot-specs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotSpecsComponent {
  private readonly datePipe = inject(DatePipe);
  readonly lot = input.required<LotDetails>();

  readonly specs = computed(() => [
    {
      label: 'Год выпуска',
      value: this.lot().year,
    },
    {
      label: 'Тип двигателя',
      value: this.lot().fuelType,
    },
    {
      label: 'Тип кузова',
      value: this.lot().bodyType,
    },
    {
      label: 'Пробег',
      value: `${this.lot().mileageKm.toLocaleString()} км`,
    },
    {
      label: 'Коробка передач',
      value: this.lot().transmission,
    },
    {
      label: 'Двигатель',
      value: this.lot().engine,
    },
    {
      label: 'Привод',
      value: this.lot().driveType,
    },
    {
      label: 'Дата добавления',
      value: `${this.datePipe.transform(this.lot().createdAt, 'd MMMM y')}`,
    },
    {
      label: 'Локация',
      value: this.lot().location,
    },
  ]);
}
