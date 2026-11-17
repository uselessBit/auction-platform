import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';

interface NavItem {
  readonly label: string;
  readonly route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TuiButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly navItems: NavItem[] = [
    { label: 'Активные лоты', route: '/catalog' },
    { label: 'Завершённые лоты', route: '/catalog/ended' },
    { label: 'О компании', route: '/about' },
    { label: 'Правила', route: '/rules' },
  ];
  protected readonly sliderPosition = signal({ left: 0, width: 0, opacity: 0 });

  private activeEl: HTMLElement | null = null;

  protected updateSlider(el: HTMLElement): void {
    this.activeEl = el;
    this.sliderPosition.set({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  }

  protected hideSlider(el: HTMLElement): void {
    if (this.activeEl === el) {
      this.activeEl = null;
      this.sliderPosition.update((prev) => ({ ...prev, opacity: 0 }));
    }
  }
}
