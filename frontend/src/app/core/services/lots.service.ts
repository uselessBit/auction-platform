import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from '../api/api-config.token';
import { Lot, LotDetails, LotStatus } from '../models/lot.model';
import { delay, Observable, of } from 'rxjs';
import { MOCK_LOT_DETAILS, MOCK_LOTS } from '../mock/lots.mock';

@Injectable({
  providedIn: 'root',
})
export class LotsService {
  private readonly config = inject(API_CONFIG);

  getLots(status?: LotStatus): Observable<Lot[]> {
    const lots = status ? MOCK_LOTS.filter((l) => l.status === status) : MOCK_LOTS;
    return of(lots).pipe(delay(300));
  }

  getLotById(id: string): Observable<LotDetails | null> {
    const details = MOCK_LOT_DETAILS[id] ?? null;
    return of(details).pipe(delay(300));
  }
}
