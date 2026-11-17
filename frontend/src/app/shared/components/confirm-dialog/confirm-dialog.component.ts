import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [TuiButton],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly title = input.required<string>();
  readonly confirmLabel = input<string>('Подтвердить');
  readonly cancelLabel = input<string>('Отмена');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  protected readonly isClosing = signal<boolean>(false);

  open(): void {
    this.dialog().nativeElement.showModal();
    this.dialog().nativeElement.focus();
  }

  close(): void {
    if (this.isClosing()) {
      return;
    }
    this.isClosing.set(true);
  }

  protected onClose(): void {
    this.isClosing.set(false);
  }

  protected onAnimationEnd(event: AnimationEvent): void {
    if (event.target === this.dialog().nativeElement && this.isClosing()) {
      this.dialog().nativeElement.close();
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  protected onConfirm(): void {
    this.confirmed.emit();
    this.close();
  }

  protected onCancel(): void {
    this.cancelled.emit();
    this.close();
  }
}
