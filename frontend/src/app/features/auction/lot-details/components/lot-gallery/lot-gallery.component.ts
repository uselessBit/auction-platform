import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { LotDetails } from '../../../../../core/models/lot.model';
import { LotStatusBadgeComponent } from '../../../../../shared/components/lot-status-badge/lot-status-badge.component';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { FavoriteButtonComponent } from '../../../../../shared/components/favorite-button/favorite-button.component';
import { TuiButton, TuiCarousel, tuiNotificationOptionsProvider } from '@taiga-ui/core';
import { TuiCopy, tuiCopyOptionsProvider } from '@taiga-ui/kit';

@Component({
  selector: 'app-lot-gallery',
  imports: [
    LotStatusBadgeComponent,
    DecimalPipe,
    FavoriteButtonComponent,
    TuiButton,
    TuiCarousel,
    NgOptimizedImage,
    TuiCopy,
  ],
  providers: [
    tuiCopyOptionsProvider({ icon: '/assets/icons/copy.svg' }),
    tuiNotificationOptionsProvider({
      icon: '/assets/icons/check.svg',
    }),
  ],
  templateUrl: './lot-gallery.component.html',
  styleUrl: './lot-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotGalleryComponent {
  readonly lot = input.required<LotDetails>();
  readonly index = signal(0);
}
