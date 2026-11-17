import { LotStatus } from '../../core/models/lot.model';

export interface LotStatusConfig {
  readonly label: string;
  readonly textClass: string;
  readonly containerClass: string;
  readonly badgeClass: string;
  readonly hoverTextClass: string;
}

export const LOT_STATUS_CONFIG: Readonly<Record<LotStatus, LotStatusConfig>> = {
  upcoming: {
    label: 'Ожидает старта',
    textClass: 'text-upcoming',
    containerClass: 'bg-upcoming-back border-upcoming',
    badgeClass: 'border-upcoming bg-upcoming-back text-upcoming',
    hoverTextClass: 'group-hover:text-upcoming',
  },
  active: {
    label: 'Идут торги',
    textClass: 'text-active',
    containerClass: 'bg-active-back border-active',
    badgeClass: 'border-active bg-active-back text-active',
    hoverTextClass: 'group-hover:text-active',
  },
  finished: {
    label: 'Завершён',
    textClass: 'text-finished',
    containerClass: 'bg-finished-back border-finished',
    badgeClass: 'border-finished bg-finished-back text-finished',
    hoverTextClass: 'group-hover:text-finished',
  },
  sold: {
    label: 'Продан',
    textClass: 'text-sold',
    containerClass: 'bg-sold-back border-sold',
    badgeClass: 'border-sold bg-sold-back text-sold',
    hoverTextClass: 'group-hover:text-sold',
  },
  cancelled: {
    label: 'Отменён',
    textClass: 'text-cancelled',
    containerClass: 'bg-cancelled-back border-cancelled',
    badgeClass: 'border-cancelled bg-cancelled-back text-cancelled',
    hoverTextClass: 'group-hover:text-cancelled',
  },
};
