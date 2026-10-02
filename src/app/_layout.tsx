import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from 'expo-router';
import { useColorScheme } from 'react-native';

import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { SessionProvider } from '@/features/auth/SessionProvider';
import { NetworkProvider } from '@/network/NetworkProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <NetworkProvider>
        <OfflineBanner />

        <SessionProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SessionProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
}