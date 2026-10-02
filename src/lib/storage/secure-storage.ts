import * as SecureStore from 'expo-secure-store';

import type { Session } from '@/features/auth/auth.types';

const ACCESS_TOKEN_KEY = 'aguafress_access_token';
const REFRESH_TOKEN_KEY = 'aguafress_refresh_token';
const USER_KEY = 'aguafress_session_user';

export async function saveSession(session: Session): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(
      ACCESS_TOKEN_KEY,
      session.token
    ),

    SecureStore.setItemAsync(
      REFRESH_TOKEN_KEY,
      session.refreshToken
    ),

    SecureStore.setItemAsync(
      USER_KEY,
      JSON.stringify(session.user)
    ),
  ]);
}

export async function getSession(): Promise<Session | null> {
  const [token, refreshToken, storedUser] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.getItemAsync(USER_KEY),
  ]);

  if (!token || !refreshToken || !storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser);

    return {
      token,
      refreshToken,
      user,
    };
  } catch {
    await deleteSession();

    return null;
  }
}

export async function deleteSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}