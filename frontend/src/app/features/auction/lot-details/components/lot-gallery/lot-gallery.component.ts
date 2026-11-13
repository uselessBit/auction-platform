import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { LotDetails } from '../../../../../core/models/lot.model';
import { LotStatusBadgeComponent } from '../../../../../shared/components/lot-status-badge/lot-status-badge.component';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { FavoriteButtonComponent } from '../../../../../shared/components/favorite-button/favorite-button.component';
import { TuiButton, TuiCarousel } from '@taiga-ui/core';

@Component({
  selector: 'app-lot-gallery',
  imports: [
    LotStatusBadgeComponent,
    DecimalPipe,
    FavoriteButtonComponent,
    TuiButton,
    TuiCarousel,
    NgOptimizedImage,
  ],
  templateUrl: './lot-gallery.component.html',
  styleUrl: './lot-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotGalleryComponent {
  readonly lot = input.required<LotDetails>();
  readonly index = signal(0);
}
