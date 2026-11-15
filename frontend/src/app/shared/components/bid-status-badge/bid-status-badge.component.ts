import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BidStatusType } from '../../../core/models/lot.model';
import { TuiIcon } from '@taiga-ui/core';

interface BidStatusConfig {
  readonly label: string;
  readonly icon: string;
  readonly colorClass: string;
}

const BID_STATUS_CONFIG: Readonly<Record<BidStatusType, BidStatusConfig>> = {
  leading: {
    label: 'Ваша ставка лидирует',
    icon: 'check',
    colorClass: 'text-active',
  },
  no_bids: {
    label: 'Вы еще не делали ставок',
    icon: 'x',
    colorClass: 'text-sold',
  },
  outbid: {
    label: 'Вас перебили',
    icon: 'exclamation',
    colorClass: 'text-upcoming',
  },
  deposit_required: {
    label: 'Требуется депозит',
    icon: 'credit-card',
    colorClass: 'text-cancelled',
  },
  kyc_required: {
    label: 'Профиль не подтвержден',
    icon: 'document',
    colorClass: 'text-finished',
  },
  contacts_unverified: {
    label: 'Контакты не подтверждены',
    icon: 'envelope',
    colorClass: 'text-finished',
  },
  kyc_pending: {
    label: 'Документы на проверке',
    icon: 'time-forward',
    colorClass: 'text-upcoming',
  },
  awaiting_start: {
    label: 'Ожидайте старта аукциона',
    icon: 'upcoming',
    colorClass: 'text-upcoming',
  },
  awaiting_payment: {
    label: 'Ожидает оплаты',
    icon: 'finished',
    colorClass: 'text-finished',
  },
  auction_cancelled: {
    label: 'Торги аннулированы',
    icon: 'cancelled',
    colorClass: 'text-cancelled',
  },
  lot_lost: {
    label: 'Лот проигран',
    icon: 'cancelled',
    colorClass: 'text-cancelled',
  },
  deal_closed: {
    label: 'Сделка закрыта',
    icon: 'sold',
    colorClass: 'text-sold',
  },
  auth_required: {
    label: 'Войдите, чтобы делать ставки',
    icon: 'sign-in',
    colorClass: 'text-sold',
  },
};

@Component({
  selector: 'app-bid-status-badge',
  imports: [TuiIcon],
  standalone: true,
  templateUrl: './bid-status-badge.component.html',
  styleUrl: './bid-status-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BidStatusBadgeComponent {
  readonly status = input.required<BidStatusType>();
  protected readonly config = computed(() => BID_STATUS_CONFIG[this.status()]);
}
