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
  readonly navItems: NavItem[] = [
    { label: 'Активные лоты', route: '/catalog' },
    { label: 'Завершённые лоты', route: '/catalog/ended' },
    { label: 'О компании', route: '/about' },
    { label: 'Правила', route: '/rules' },
  ];

  private activeEl: HTMLElement | null = null;

  readonly sliderPosition = signal({ left: 0, width: 0, opacity: 0 });
  updateSlider(el: HTMLElement) {
    this.activeEl = el;
    this.sliderPosition.set({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  }

  hideSlider(el: HTMLElement) {
    if (this.activeEl === el) {
      this.activeEl = null;
      this.sliderPosition.update((prev) => ({ ...prev, opacity: 0 }));
    }
  }
}
