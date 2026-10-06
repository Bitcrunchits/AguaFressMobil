import { useCallback, useEffect, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/useSession';
import type { Customer } from '@/features/customers/customers.types';
import { getCustomerPortfolio } from '@/features/customers/services/customers.service';
import { ApiError } from '@/lib/api/api.types';
import { router } from 'expo-router';

export default function CustomersScreen() {
    const { token } = useSession();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadCustomers = useCallback(async () => {
        if (!token) {
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage(null);

            const response = await getCustomerPortfolio({
                token,
            });

            setCustomers(response.data);
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage(
                    'No se pudo cargar la cartera de clientes.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    return (
        <Screen scroll>
            <Text style={styles.title}>
                Mis clientes
            </Text>

            {isLoading ? (
                <CustomerListSkeleton />
            ) : errorMessage ? (
                <View style={styles.stateContainer}>
                    <Text style={styles.error}>
                        {errorMessage}
                    </Text>

                    <Pressable
                        onPress={loadCustomers}
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
            ) : customers.length === 0 ? (
                <View style={styles.stateContainer}>
                    <Text style={styles.emptyText}>
                        Todavía no tenés clientes en tu cartera.
                    </Text>
                </View>
            ) : (
                customers.map((customer) => (
                    <Pressable
                        key={customer.id}
                        onPress={() =>
                            router.push({
                                pathname: '/vendedor/clientes/[id]',
                                params: {
                                    id: customer.id,
                                },
                            })
                        }
                        style={({ pressed }) => [
                            styles.card,
                            pressed && styles.cardPressed,
                        ]}
                    >
                        <Text style={styles.customerName}>
                            {customer.nombre} {customer.apellido}
                        </Text>

                        <Text style={styles.customerData}>
                            {customer.telefono}
                        </Text>

                        <Text style={styles.customerData}>
                            {customer.direccion_calle}{' '}
                            {customer.direccion_numero}
                        </Text>

                        <Text style={styles.customerData}>
                            {customer.direccion_ciudad},{' '}
                            {customer.direccion_provincia}
                        </Text>
                    </Pressable>
                ))
            )}
        </Screen>
    );
}

function CustomerListSkeleton() {
    return (
        <View style={styles.skeletonContainer}>
            <View style={styles.card}>
                <Skeleton
                    width="60%"
                    height={20}
                />

                <View style={styles.skeletonGap} />

                <Skeleton
                    width="40%"
                    height={14}
                />

                <View style={styles.skeletonGap} />

                <Skeleton
                    width="75%"
                    height={14}
                />
            </View>

            <View style={styles.card}>
                <Skeleton
                    width="55%"
                    height={20}
                />

                <View style={styles.skeletonGap} />

                <Skeleton
                    width="45%"
                    height={14}
                />

                <View style={styles.skeletonGap} />

                <Skeleton
                    width="70%"
                    height={14}
                />
            </View>
        </View>
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

    customerName: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },

    customerData: {
        fontSize: 14,
        marginBottom: 4,
    },

    stateContainer: {
        paddingVertical: 24,
    },

    emptyText: {
        fontSize: 14,
    },

    error: {
        fontSize: 14,
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

    skeletonContainer: {
        width: '100%',
    },

    skeletonGap: {
        height: 10,
    },

    cardPressed: {
  opacity: 0.7,
},
});