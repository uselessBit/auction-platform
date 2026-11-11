import { AuthResponse, AuthTokens, User } from '../models/auth.model';

export const MOCK_USER_VERIFIED: User = {
  id: 'u-101',
  email: 'alexander@secondrive.by',
  name: 'Александр Иванов',
  role: 'user',
  kycStatus: 'approved',
};

export const MOCK_USER_NEW: User = {
  id: 'u-102',
  email: 'novice@mail.ru',
  name: 'Дмитрий Смирнов',
  role: 'user',
  kycStatus: 'pending',
};

export const MOCK_ADMIN: User = {
  id: 'u-admin',
  email: 'admin@secondrive.by',
  name: 'Главный Администратор',
  role: 'admin',
  kycStatus: 'approved',
};

export const MOCK_TOKENS: AuthTokens = {
  accessToken: 'mock-jwt-access-token-xyz123abc-valid-for-session',
  refreshToken: 'mock-jwt-refresh-token-abc789xyz-valid-for-refresh',
};

export const MOCK_AUTH_RESPONSE: AuthResponse = {
  user: MOCK_USER_VERIFIED,
  tokens: MOCK_TOKENS,
};
