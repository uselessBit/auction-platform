import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../api/api-config.token';
import { isPlatformBrowser } from '@angular/common';
import { LotHold } from '../models/finance.model';
import { MOCK_LOT_HOLDS } from '../mock/finance.mock';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly currentHolds = signal<readonly LotHold[]>(MOCK_LOT_HOLDS);

  clearHolds(): void {
    this.currentHolds.set([]);
  }
}
