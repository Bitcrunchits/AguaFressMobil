import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { Session, User } from './auth.types';
import {
  deleteSession,
  getSession,
  saveSession,
} from '@/lib/storage/secure-storage';

type SessionContextType = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;

  isLoading: boolean;
  isAuthenticated: boolean;

  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
};

export const SessionContext =
  createContext<SessionContextType | undefined>(undefined);

type SessionProviderProps = {
  children: ReactNode;
};

export function SessionProvider({
  children,
}: SessionProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] =
    useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedSession = await getSession();

        if (!storedSession) {
          return;
        }

        setToken(storedSession.token);
        setRefreshToken(storedSession.refreshToken);
        setUser(storedSession.user);
      } catch {
        await deleteSession();
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const signIn = useCallback(
    async (session: Session) => {
      await saveSession(session);

      setToken(session.token);
      setRefreshToken(session.refreshToken);
      setUser(session.user);
    },
    []
  );

  const signOut = useCallback(async () => {
    await deleteSession();

    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const isAuthenticated =
    token !== null && user !== null;

  const value = useMemo(
    () => ({
      token,
      refreshToken,
      user,
      isLoading,
      isAuthenticated,
      signIn,
      signOut,
    }),
    [
      token,
      refreshToken,
      user,
      isLoading,
      isAuthenticated,
      signIn,
      signOut,
    ]
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}