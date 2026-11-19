import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AuthModalService } from '../../../core/services/auth-modal.service';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-auth-modal',
  imports: [TuiButton],
  standalone: true,
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
  private readonly authModal = inject(AuthModalService);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  protected readonly isClosing = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.authModal.isOpen() && !this.dialog().nativeElement.open) {
        this.open();
      }
      if (!this.authModal.isOpen() && this.dialog().nativeElement.open) {
        this.close();
      }
    });
  }

  protected open(): void {
    this.dialog().nativeElement.showModal();
    this.dialog().nativeElement.focus();
  }

  protected close(): void {
    if (this.isClosing()) {
      return;
    }
    this.isClosing.set(true);
  }

  protected onClose(): void {
    this.isClosing.set(false);
    this.authModal.close();
  }

  protected onAnimationEnd(event: AnimationEvent): void {
    if (event.target === this.dialog().nativeElement && this.isClosing()) {
      this.dialog().nativeElement.close();
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
