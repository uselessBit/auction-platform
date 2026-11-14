import {
  ChangeDetectionStrategy,
  Component,
  computed,
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

  protected readonly currentScale = signal<number>(1);
  protected readonly imagePan = signal({ x: 0, y: 0 });
  protected readonly isDragging = signal<boolean>(false);

  protected readonly isOpen = signal<boolean>(false);
  protected readonly isZoom = computed(() => this.currentScale() > 1);

  private startX = 0;
  private startY = 0;
  protected readonly maxScale: number = 3;
  protected readonly scaleStep: number = 0.5;

  private resetZoom(): void {
    this.currentScale.set(1);
    this.imagePan.set({ x: 0, y: 0 });
  }

  open(startIndex = 0): void {
    this.index.set(startIndex);
    this.dialog().nativeElement.showModal();
    this.dialog().nativeElement.focus();
    this.isOpen.set(true);
  }

  protected close(): void {
    this.resetZoom();
    this.isOpen.set(false);
    this.dialog().nativeElement.close();
  }

  protected prev(): void {
    if (this.index() > 0 && !this.isZoom()) {
      this.index.set(this.index() - 1);
    }
  }

  protected next(): void {
    if (this.index() < this.images().length - 1 && !this.isZoom()) {
      this.index.set(this.index() + 1);
    }
  }

  protected navChangeIndex(id: number): void {
    this.resetZoom();
    this.index.set(id);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isZoom()) {
      this.close();
    }
  }

  protected zoomIn(): void {
    if (this.currentScale() < this.maxScale) {
      this.currentScale.set(this.currentScale() + this.scaleStep);
    }
  }

  protected zoomOut(): void {
    if (this.isZoom() && this.currentScale() > 1 + this.scaleStep) {
      this.currentScale.set(this.currentScale() - this.scaleStep);
      return;
    }
    this.resetZoom();
  }

  protected mousedown(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
    this.startX = event.clientX - this.imagePan().x;
    this.startY = event.clientY - this.imagePan().y;
  }

  protected mousemove(event: MouseEvent): void {
    if (!this.isDragging()) {
      return;
    }

    this.imagePan.set({
      x: event.clientX - this.startX,
      y: event.clientY - this.startY,
    });
  }

  protected mouseup(): void {
    this.isDragging.set(false);
  }
}
