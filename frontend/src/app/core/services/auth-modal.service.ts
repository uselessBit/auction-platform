import { Injectable, signal } from '@angular/core';
import { AuthModalMode } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthModalService {
  private readonly _isOpen = signal<boolean>(false);
  private readonly _mode = signal<AuthModalMode>('login');

  readonly isOpen = this._isOpen.asReadonly();
  readonly mode = this._mode.asReadonly();

  open(mode: AuthModalMode = 'login'): void {
    this._mode.set(mode);
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
  }

  setMode(mode: AuthModalMode): void {
    this._mode.set(mode);
  }
}
