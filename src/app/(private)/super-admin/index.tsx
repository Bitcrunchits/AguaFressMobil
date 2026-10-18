
import { Redirect, router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useSession } from '@/features/auth/useSession';

export default function SuperAdminHomeScreen() {
  const { user, isLoading, signOut } = useSession();

  if (isLoading) {
    return null;
  }

  if (user?.role !== 'super_admin') {
    return <Redirect href="/login" />;
  }

  async function handleSignOut() {
    await signOut();
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>
          Aguafress
        </Text>

        <Text style={styles.subtitle}>
          Panel de administración
        </Text>

        <Text style={styles.user}>
          {user.nombre ?? user.email}
        </Text>

        <View style={styles.actions}>
          <Pressable
            onPress={() =>
              router.push('/super-admin/vendedores/estados')
            }
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>
              Administrar vendedores
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.button,
              styles.logoutButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.logoutButtonText}>
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  user: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    gap: 12,
  },
  button: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    borderColor: '#dc2626',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
});
