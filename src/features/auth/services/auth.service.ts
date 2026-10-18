import { apiRequest } from '@/lib/api/api-client';

import type {
  LoginCredentials,
  LoginResponse,
} from '../auth.types';

export function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    '/api/v1/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    }
  );
}

export type RefreshTokenResponse = {
  token: string;
};

export function refreshAccessToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  return apiRequest<RefreshTokenResponse>(
    '/api/v1/auth/refresh',
    {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }
  );
}