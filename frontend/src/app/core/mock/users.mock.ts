import { AuthResponse, AuthTokens, User } from '../models/auth.model';

// 1. Гость (не авторизован) -> auth_required
export const MOCK_USER_GUEST: User | null = null;

// 2. Контакты не подтверждены -> contacts_unverified
export const MOCK_USER_UNVERIFIED: User = {
  id: 'b3d5f7a9-2233-4455-9667-889900115501',
  email: 'unverified@mail.ru',
  phone: '+375447654321',
  role: 'user',
  kycStatus: 'none',
  isPhoneVerified: false,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2026-06-01T09:15:00.000Z',
};

// 3. Контакты подтверждены, KYC не пройден -> kyc_required (none)
export const MOCK_USER_NO_KYC: User = {
  id: 'c4e6a8b0-3344-4566-9778-990011226602',
  email: 'no.kyc@yandex.by',
  phone: '+375293334455',
  role: 'user',
  kycStatus: 'none',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2026-05-18T11:30:00.000Z',
};

// 4. Контакты подтверждены, KYC отклонен -> kyc_required (rejected)
export const MOCK_USER_KYC_REJECTED: User = {
  id: 'd5f7b9c1-4455-4677-9889-001122337703',
  email: 'rejected.kyc@gmail.com',
  phone: '+375336543210',
  role: 'user',
  kycStatus: 'rejected',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2026-05-12T16:45:00.000Z',
};

// 5. Документы на проверке -> kyc_pending
export const MOCK_USER_NEW: User = {
  id: 'a2c4e6f8-1122-4334-8556-778899004120',
  email: 'novice@mail.ru',
  phone: '+375292223344',
  role: 'user',
  kycStatus: 'pending',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2026-05-10T14:20:00.000Z',
};

// 6. Полностью верифицирован, но без депозита на лот -> deposit_required
export const MOCK_USER_NO_DEPOSIT: User = {
  id: 'e6a8c0d2-5566-4788-9990-112233448804',
  email: 'no.deposit@yandex.by',
  phone: '+375297778899',
  role: 'user',
  kycStatus: 'approved',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2026-04-20T13:10:00.000Z',
};

// 7. Полный доступ + есть pre_auth депозит на лот 19345 -> можно делать ставки
export const MOCK_USER_VERIFIED: User = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c32345',
  email: 'alex.novik@yandex.by',
  phone: '+375291234567',
  role: 'user',
  kycStatus: 'approved',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2026-01-15T10:00:00.000Z',
};

// 8. B2B-дилер
export const MOCK_USER_B2B: User = {
  id: 'f7b9d1e3-6677-4899-9001-223344559905',
  email: 'dealer@autobid.by',
  phone: '+375291112233',
  role: 'b2b',
  kycStatus: 'approved',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2026-02-01T08:00:00.000Z',
};

// 9. Заблокированный пользователь
export const MOCK_USER_BLOCKED: User = {
  id: 'a8c0e2f4-7788-4900-9112-334455660006',
  email: 'blocked@mail.ru',
  phone: '+375449998877',
  role: 'user',
  kycStatus: 'approved',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: true,
  createdAt: '2026-03-05T12:00:00.000Z',
};

export const MOCK_ADMIN: User = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'admin@secondrive.by',
  phone: '+375290000001',
  role: 'admin',
  kycStatus: 'approved',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2025-12-01T00:00:00.000Z',
};

export const MOCK_TOKENS: AuthTokens = {
  accessToken: 'mock-jwt-access-token-xyz123abc-valid-for-session',
  refreshToken: 'mock-jwt-refresh-token-abc789xyz-valid-for-refresh',
};

export const MOCK_PASSWORD = 'password123';

export const MOCK_USERS: readonly User[] = [
  MOCK_USER_UNVERIFIED,
  MOCK_USER_NO_KYC,
  MOCK_USER_KYC_REJECTED,
  MOCK_USER_NEW,
  MOCK_USER_NO_DEPOSIT,
  MOCK_USER_VERIFIED,
  MOCK_USER_B2B,
  MOCK_USER_BLOCKED,
  MOCK_ADMIN,
];

export const MOCK_AUTH_RESPONSE: AuthResponse = {
  user: MOCK_USER_VERIFIED,
  tokens: MOCK_TOKENS,
};
