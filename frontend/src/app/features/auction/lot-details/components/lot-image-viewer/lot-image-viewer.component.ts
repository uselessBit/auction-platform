import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-lot-image-viewer',
  imports: [NgOptimizedImage, TuiButton],
  standalone: true,
  templateUrl: './lot-image-viewer.component.html',
  styleUrl: './lot-image-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotImageViewerComponent {
  readonly images = input.required<readonly string[]>();
  readonly title = input.required<string>();
  protected readonly index = signal<number>(0);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  protected readonly isOpen = signal<boolean>(false);

  open(startIndex = 0) {
    this.index.set(startIndex);
    this.dialog().nativeElement.showModal();
    this.dialog().nativeElement.focus();
    this.isOpen.set(true);
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  protected prev() {
    if (this.index() > 0) {
      this.index.set(this.index() - 1);
    }
  }

  protected next() {
    if (this.index() < this.images().length - 1) {
      this.index.set(this.index() + 1);
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
