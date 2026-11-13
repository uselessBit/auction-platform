import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { LotDetails } from '../../../../../core/models/lot.model';
import { LotStatusBadgeComponent } from '../../../../../shared/components/lot-status-badge/lot-status-badge.component';
import { DecimalPipe, DOCUMENT, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { FavoriteButtonComponent } from '../../../../../shared/components/favorite-button/favorite-button.component';
import { TuiButton, TuiCarousel } from '@taiga-ui/core';
import { tuiCopyOptionsProvider } from '@taiga-ui/kit';
import { Clipboard } from '@angular/cdk/clipboard';
import { FloatingBadgeComponent } from '../../../../../shared/components/floating-badge/floating-badge.component';

@Component({
  selector: 'app-lot-gallery',
  imports: [
    LotStatusBadgeComponent,
    DecimalPipe,
    FavoriteButtonComponent,
    TuiButton,
    TuiCarousel,
    NgOptimizedImage,
    FloatingBadgeComponent,
  ],
  standalone: true,
  providers: [tuiCopyOptionsProvider({ icon: '/assets/icons/copy.svg' })],
  templateUrl: './lot-gallery.component.html',
  styleUrl: './lot-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotGalleryComponent {
  readonly lot = input.required<LotDetails>();
  readonly index = signal<number>(0);
  readonly isLinkCopied = signal<boolean>(false);
  readonly isVinCopied = signal<boolean>(false);

  private document = inject(DOCUMENT);
  private clipboard = inject(Clipboard);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly win = this.document.defaultView;
  private get isShareSupported(): boolean {
    return !!(this.win && 'share' in this.win.navigator);
  }

  protected copyVin() {
    if (!this.isVinCopied()) {
      this.clipboard.copy(this.lot().vin);
      this.isVinCopied.set(true);
      setTimeout(() => this.isVinCopied.set(false), 1200);
    }
  }

  private copyLink() {
    this.isLinkCopied.set(true);
    setTimeout(() => this.isLinkCopied.set(false), 1200);
  }

  async shareLot() {
    if (!this.isBrowser || !this.win || this.isLinkCopied()) {
      return;
    }

    if (this.isShareSupported) {
      try {
        await this.win.navigator.share({
          title: `${this.lot().brand} ${this.lot().model}, ${this.lot().year}`,
          text: `Лот № ${this.lot().id}`,
          url: this.win.location.href,
        });
      } catch (e) {
        this.clipboard.copy(this.win.location.href);
        this.copyLink();
      }
    } else {
      if (this.isBrowser) {
        this.clipboard.copy(this.win.location.href);
        this.copyLink();
      }
    }
  }
}
