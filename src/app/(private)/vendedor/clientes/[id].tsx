import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/useSession';
import type { Customer } from '@/features/customers/customers.types';
import { getCustomerById } from '@/features/customers/services/customers.service';
import { ApiError } from '@/lib/api/api.types';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useSession();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const loadCustomer = useCallback(async () => {
    if (!token || !id) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await getCustomerById({
        id,
        token,
      });

      setCustomer(response);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          'No se pudo cargar el cliente.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  return (
    <Screen scroll>
      <Text style={styles.title}>
        Detalle del cliente
      </Text>

      {isLoading ? (
        <CustomerDetailSkeleton />
      ) : errorMessage ? (
        <View style={styles.stateContainer}>
          <Text style={styles.error}>
            {errorMessage}
          </Text>

          <Pressable
            onPress={loadCustomer}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.retryText}>
              Reintentar
            </Text>
          </Pressable>
        </View>
      ) : customer ? (
        <>
          <View style={styles.card}>
            <Text style={styles.name}>
              {customer.nombre} {customer.apellido}
            </Text>

            <Text style={styles.label}>
              DNI
            </Text>
            <Text style={styles.value}>
              {customer.dni}
            </Text>

            <Text style={styles.label}>
              Teléfono
            </Text>
            <Text style={styles.value}>
              {customer.telefono}
            </Text>

            <Text style={styles.label}>
              Tipo de factura
            </Text>
            <Text style={styles.value}>
              {customer.tipo_factura}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Dirección
            </Text>

            <Text style={styles.value}>
              {customer.direccion_calle}{' '}
              {customer.direccion_numero}
            </Text>

            {customer.direccion_piso ? (
              <Text style={styles.value}>
                Piso {customer.direccion_piso}
              </Text>
            ) : null}

            <Text style={styles.value}>
              {customer.direccion_barrio}
            </Text>

            <Text style={styles.value}>
              {customer.direccion_ciudad},{' '}
              {customer.direccion_provincia}
            </Text>

            <Text style={styles.value}>
              CP {customer.direccion_cp}
            </Text>

            {customer.direccion_referencia ? (
              <>
                <Text style={styles.label}>
                  Referencia
                </Text>

                <Text style={styles.value}>
                  {customer.direccion_referencia}
                </Text>
              </>
            ) : null}
          </View>
        </>
      ) : (
        <View style={styles.stateContainer}>
          <Text>
            No se encontró el cliente.
          </Text>
        </View>
      )}
    </Screen>
  );
}

function CustomerDetailSkeleton() {
  return (
    <>
      <View style={styles.card}>
        <Skeleton width="60%" height={24} />

        <View style={styles.skeletonGap} />

        <Skeleton width="30%" height={14} />

        <View style={styles.skeletonGap} />

        <Skeleton width="50%" height={16} />

        <View style={styles.skeletonGapLarge} />

        <Skeleton width="35%" height={14} />

        <View style={styles.skeletonGap} />

        <Skeleton width="45%" height={16} />
      </View>

      <View style={styles.card}>
        <Skeleton width="40%" height={20} />

        <View style={styles.skeletonGapLarge} />

        <Skeleton width="75%" height={16} />

        <View style={styles.skeletonGap} />

        <Skeleton width="60%" height={16} />

        <View style={styles.skeletonGap} />

        <Skeleton width="50%" height={16} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },

  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    marginBottom: 4,
  },

  stateContainer: {
    paddingVertical: 24,
  },

  error: {
    marginBottom: 16,
  },

  retryButton: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  retryText: {
    fontWeight: '600',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  skeletonGap: {
    height: 10,
  },

  skeletonGapLarge: {
    height: 20,
  },
});