export type HoldStatus = 'pending' | 'pre_auth' | 'voided' | 'captured';

export interface LotHold {
  readonly id: string;
  readonly userId: string;
  readonly lotId: string;
  readonly amount: number;
  readonly status: HoldStatus;
  readonly createdAt: string; // ISO 8601
}

export type InvoiceStatus = 'pending' | 'paid' | 'cancelled';

export interface Invoice {
  readonly id: string;
  readonly userId: string;
  readonly amount: number;
  readonly description: string;
  readonly status: InvoiceStatus;
  readonly createdAt: string; // ISO 8601
}
