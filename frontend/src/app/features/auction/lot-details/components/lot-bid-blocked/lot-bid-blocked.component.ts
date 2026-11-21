import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BlockedBidStatus, LotDetails } from '../../../../../core/models/lot.model';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { DecimalPipe } from '@angular/common';
import { LotAuctionRulesComponent } from '../lot-auction-rules/lot-auction-rules.component';
import { LotBidProgressComponent } from '../lot-bid-progress/lot-bid-progress.component';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

interface BlockedBidConfig {
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly hint: string;
  readonly icon?: string;
  readonly iconClass?: string;
  readonly stepLabel: string;
  readonly stepLabelClass?: string;
}

const BLOCKED_BID_CONFIG: Readonly<Record<BlockedBidStatus, BlockedBidConfig>> = {
  deposit_required: {
    title: 'Гарантийный депозит',
    description: 'Для участия в торгах необходимо заморозить 10% от стартовой цены лота.',
    actionLabel: 'Внести депозит',
    hint: 'В случае проигрыша ваши средства разморозятся',
    stepLabel: 'Финальный шаг (4 из 4)',
    stepLabelClass: 'text-active',
  },
  kyc_required: {
    title: 'Требуется верификация',
    description:
      'По законодательству РБ для участия в торгах нужно подтвердить личность паспортом.',
    actionLabel: 'Пройти верификацию (KYC)',
    hint: 'После ваши фото автоматически удаляются с сервера',
    icon: '/assets/icons/shield-check.svg',
    iconClass: 'text-active bg-active-back border-active',
    stepLabel: 'Допуск: Шаг 3 из 4',
    stepLabelClass: 'opacity-50',
  },
  kyc_pending: {
    title: 'Проверяем документы',
    description:
      'Модератор сверяет анкету. Как только профиль подтвердят, откроется внесение депозита.',
    actionLabel: 'Документы на проверке (15 - 30 минут)',
    hint: 'Пришлем SMS-уведомление сразу после одобрения',
    icon: '/assets/icons/time-forward.svg',
    iconClass: 'text-upcoming bg-upcoming-back border-upcoming',
    stepLabel: 'Проверка KYC...',
    stepLabelClass: 'text-upcoming',
  },
  auth_required: {
    title: 'Требуется авторизация',
    description: 'Войдите в аккаунт, чтобы увидеть полный VIN-код автомобиля и делать ставки.',
    actionLabel: 'Войти / Регистрация',
    hint: 'Если нет аккаунта, регистрация займет 1 минуту',
    icon: '/assets/icons/lock.svg',
    iconClass: 'text-active bg-active-back border-active',
    stepLabel: 'Допуск: Шаг 1 из 4',
    stepLabelClass: 'opacity-50',
  },
  contacts_unverified: {
    title: 'Подтвердите контакты',
    description: 'Для перехода к верификации профиля необходимо подтвердить телефон и почту.',
    actionLabel: 'Подтвердить контакты',
    hint: 'Остался всего один шаг до верификации профиля',
    icon: '/assets/icons/envelope.svg',
    iconClass: 'text-active bg-active-back border-active',
    stepLabel: 'Допуск: Шаг 2 из 4',
    stepLabelClass: 'opacity-50',
  },
};

@Component({
  selector: 'app-lot-bid-blocked',
  imports: [
    CurrencyComponent,
    DecimalPipe,
    LotAuctionRulesComponent,
    LotBidProgressComponent,
    TuiButton,
    TuiIcon,
  ],
  standalone: true,
  templateUrl: './lot-bid-blocked.component.html',
  styleUrl: './lot-bid-blocked.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotBidBlockedComponent {
  readonly lot = input.required<LotDetails>();
  readonly status = input.required<BlockedBidStatus>();
  readonly depositAmount = input.required<number>();

  readonly actionClicked = output<BlockedBidStatus>();

  protected readonly config = computed(() => BLOCKED_BID_CONFIG[this.status()]);

  protected onAction(): void {
    if (this.status() === 'kyc_pending') {
      return;
    }
    this.actionClicked.emit(this.status());
  }
}
