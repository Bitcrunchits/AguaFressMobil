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