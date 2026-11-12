export type LotStatus = 'upcoming' | 'active' | 'finished' | 'sold' | 'cancelled';

export const lotStatus: Record<LotStatus, string> = {
  upcoming: 'Ожидает старта',
  active: 'Идут торги',
  finished: 'Завершён',
  sold: 'Продан',
  cancelled: 'Отменён',
};

export interface LotBid {
  readonly id: string;
  readonly bidderMasked: string; // "Участник ***2345"
  readonly isCurrentUser: boolean;
  readonly amountByn: number;
  readonly createdAt: string;
}

export interface Lot {
  readonly id: string;
  readonly brand: string;
  readonly model: string;
  readonly year: number;
  readonly engine: string; // '2.0 л (260 л.с.)'
  readonly fuelType: string; // 'Гибрид'
  readonly mileageKm: number; // 105 000
  readonly isCustomsCleared: boolean; // true -> 'Растаможен'
  readonly damagePrimary: string; // 'Удар в переднюю часть'
  readonly runAndDrive: string; // 'Заводится и едет'
  readonly images: readonly string[];
  readonly startPriceByn: number; // 8300
  readonly currentBidByn: number; // 10000
  readonly bidStepByn: number; // 200
  readonly status: LotStatus;
  readonly endsAt: string; // ISO строка
  readonly isFavorite?: boolean;
}

export interface LotDetails extends Lot {
  readonly vin: string;
  readonly bodyType: string; // 'Кроссовер 5 дв.'
  readonly transmission: string; // 'АКПП'
  readonly driveType: string; // 'Полный (AWD)'
  readonly location: string; // 'Минск, ул. Бабушкина, 39'
  readonly createdAt: string; // ISO 8601 строка, например '2026-05-11T12:00:00.000Z'
  readonly inspectorComment: string; // Описание повреждений оценщика
  readonly bids: readonly LotBid[]; // История ставок
}
