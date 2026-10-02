import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/features/auth/useSession';

export default function PrivateLayout() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}