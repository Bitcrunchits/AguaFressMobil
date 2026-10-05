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
          <View style={styles.skeleton} />
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

      <Pressable
        onPress={handleSignOut}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>
          Cerrar sesión
        </Text>
      </Pressable>
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

  skeleton: {
    width: 60,
    height: 32,
    borderRadius: 6,
    opacity: 0.2,
    backgroundColor: '#777',
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
});