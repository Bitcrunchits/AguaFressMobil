import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getCustomerPortfolio } from '@/features/customers/services/customers.service';
import { useSession } from '@/features/auth/useSession';
import { ApiError } from '@/lib/api/api.types';
import { Skeleton } from '@/components/ui/Skeleton';
import { router } from 'expo-router';


export default function VendedorHomeScreen() {
  const { token, user, signOut } = useSession();

  const [customerCount, setCustomerCount] =
    useState<number | null>(null);

  const [isLoadingCustomers, setIsLoadingCustomers] =
    useState(true);

  const [customerError, setCustomerError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadCustomerPortfolio() {
      if (!token) {
        return;
      }

      try {
        setIsLoadingCustomers(true);
        setCustomerError(null);

        const response = await getCustomerPortfolio({
          token,
        });

        setCustomerCount(response.pagination.total);
      } catch (error) {
        if (error instanceof ApiError) {
          setCustomerError(error.message);
        } else {
          setCustomerError(
            'No se pudo cargar la cartera de clientes.'
          );
        }
      } finally {
        setIsLoadingCustomers(false);
      }
    }

    loadCustomerPortfolio();
  }, [token]);

  async function handleSignOut() {
    await signOut();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Aguafress
      </Text>

      <Text style={styles.subtitle}>
        Home Vendedor
      </Text>

      <Text style={styles.user}>
        {user?.nombre ?? user?.email}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          Clientes en cartera
        </Text>

        {isLoadingCustomers ? (
          <Skeleton width={60} height={32} />
        ) : customerError ? (
          <Text style={styles.error}>
            {customerError}
          </Text>
        ) : (
          <Text style={styles.cardValue}>
            {customerCount ?? 0}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push('/vendedor/clientes')}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            Mis clientes
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.button,
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.logoutButtonText}>
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },

  user: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },

  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    minHeight: 100,
    justifyContent: 'center',
  },

  cardLabel: {
    fontSize: 14,
    marginBottom: 8,
  },

  cardValue: {
    fontSize: 32,
    fontWeight: '700',
  },

  error: {
    fontSize: 14,
  },

  button: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  actions: {
    gap: 12,
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