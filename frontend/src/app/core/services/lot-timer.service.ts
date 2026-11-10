import { inject, Injectable, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class LotTimerService implements OnDestroy {
  readonly timeLeft = signal<string>('');
  readonly isEnded = signal<boolean>(false);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private intervalSub?: Subscription;

  private updateTick(endsAtIso: string): void {
    const diff = new Date(endsAtIso).getTime() - Date.now();

    if (diff <= 0) {
      this.isEnded.set(true);
      this.timeLeft.set('Торги завершены');
      this.intervalSub?.unsubscribe();
    } else {
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (days > 0) {
        this.timeLeft.set(
          `${String(days).padStart(2, '0')} д : ${String(hours).padStart(2, '0')} ч`,
        );
      } else if (hours > 0) {
        this.timeLeft.set(
          `${String(hours).padStart(2, '0')} ч : ${String(minutes).padStart(2, '0')} м`,
        );
      } else {
        this.timeLeft.set(
          `${String(minutes).padStart(2, '0')} м : ${String(seconds).padStart(2, '0')} с`,
        );
      }
    }
  }

  start(endsAtIso: string): void {
    this.updateTick(endsAtIso);

    if (!this.isBrowser) {
      return;
    }

    this.intervalSub?.unsubscribe();

    this.intervalSub = timer(0, 1000).subscribe(() => {
      this.updateTick(endsAtIso);
    });
  }

  ngOnDestroy(): void {
    this.intervalSub?.unsubscribe();
  }
}
