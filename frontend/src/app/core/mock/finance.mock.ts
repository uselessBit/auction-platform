import { Invoice, LotHold } from '../models/finance.model';
import { MOCK_USER_VERIFIED } from './users.mock';

export const MOCK_LOT_HOLDS: readonly LotHold[] = [
  {
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    userId: MOCK_USER_VERIFIED.id,
    lotId: '19345',
    amount: 830,
    status: 'pre_auth',
    createdAt: '2026-06-20T18:00:00.000Z',
  },
  {
    id: '7c2ef3a1-9b4d-4c8e-a12f-4e5d6c7b8a90',
    userId: MOCK_USER_VERIFIED.id,
    lotId: '19349',
    amount: 800,
    status: 'captured',
    createdAt: '2026-06-15T10:30:00.000Z',
  },
  {
    id: '3d4a5b6c-1e2f-4a7b-9c8d-0e1f2a3b4c5d',
    userId: MOCK_USER_VERIFIED.id,
    lotId: '19348',
    amount: 990,
    status: 'voided',
    createdAt: '2026-06-16T11:15:00.000Z',
  },
];

export const MOCK_INVOICES: readonly Invoice[] = [
  {
    id: 'c463f826-eb5e-47f2-bd5f-d89066606ff9',
    userId: MOCK_USER_VERIFIED.id,
    amount: 350,
    description: 'Комиссия платформы (Лот: VW Tiguan)',
    status: 'paid',
    createdAt: '2026-06-18T15:20:00.000Z',
  },
  {
    id: 'e574a937-fc6f-48a3-ce6a-e90177717aa0',
    userId: MOCK_USER_VERIFIED.id,
    amount: 9900,
    description: 'Выкуп лота Audi A6 Allroad (№ 19347)',
    status: 'pending',
    createdAt: '2026-06-21T09:00:00.000Z',
  },
];
