import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/features/auth/useSession';

export default function PublicLayout() {
  const { isAuthenticated, isLoading, user } = useSession();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    if (user?.role === 'vendedor') {
      return <Redirect href="/vendedor" />;
    }

    if (user?.role === 'cliente') {
      return <Redirect href="/cliente" />;
    }
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}