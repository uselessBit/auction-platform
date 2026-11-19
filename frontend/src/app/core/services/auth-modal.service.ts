import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthModalService {
  private readonly isOpenLocal = signal<boolean>(false);
  readonly isOpen = this.isOpenLocal.asReadonly();

  open(): void {
    this.isOpenLocal.set(true);
  }

  close(): void {
    this.isOpenLocal.set(false);
  }
}
