import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LotDetails } from '../../../../../core/models/lot.model';
import { LotStatusBadgeComponent } from '../../../../../shared/components/lot-status-badge/lot-status-badge.component';
import { DecimalPipe } from '@angular/common';
import { FavoriteButtonComponent } from '../../../../../shared/components/favorite-button/favorite-button.component';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-lot-gallery',
  imports: [LotStatusBadgeComponent, DecimalPipe, FavoriteButtonComponent, TuiButton],
  templateUrl: './lot-gallery.component.html',
  styleUrl: './lot-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotGalleryComponent {
  readonly lot = input.required<LotDetails>();
}
