
import { useCallback, useEffect, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Redirect, useLocalSearchParams, router, useFocusEffect } from 'expo-router';

import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/useSession';
import { getAdminVendedores } from '@/features/admin/services/admin.service';
import type {
    VendedorAdmin,
    VendedoresListResponse,
} from '@/features/admin/types/admin.types';
import { ApiError } from '@/lib/api/api.types';


export default function AdminVendedoresScreen() {
    const { token, user, isLoading: isSessionLoading } = useSession();

    const { estado } = useLocalSearchParams<{ estado?: string }>();
    const [page, setPage] = useState(1);

    const estadosValidos = [
        'pendiente',
        'activo',
        'inactivo',
        'bloqueado',
    ] as const;

    const estadoSeleccionado = estadosValidos.find(
        (item) => item === estado

    );
    useEffect(() => {
        setPage(1);
    }, [estadoSeleccionado]);

    const [response, setResponse] =
        useState<VendedoresListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadVendedores = useCallback(async () => {
        if (!token || user?.role !== 'super_admin') return;

        try {
            setIsLoading(true);
            setError(null);

            const result = await getAdminVendedores({ token, estado: estadoSeleccionado, page, limit: 5 });
            setResponse(result);
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : 'No se pudo cargar la lista de vendedores.'
            );
        } finally {
            setIsLoading(false);
        }
    }, [token, user?.role, estadoSeleccionado, page]);

    useFocusEffect(
        useCallback(() => {
            void loadVendedores();
        }, [loadVendedores])
    );

    if (isSessionLoading) return null;

    if (user?.role !== 'super_admin') {
        return <Redirect href="/login" />;
    }

    return (
        <Screen scroll>
            <Text style={styles.title}>
                {estadoSeleccionado
                    ? `Vendedores ${estadoSeleccionado}s`
                    : 'Todos los vendedores'}
            </Text>
            <Text style={styles.subtitle}>
                Gestión de vendedores de Aguafress
            </Text>

            {isLoading ? (
                <View style={styles.list}>
                    <Skeleton height={90} />
                    <Skeleton height={90} />
                    <Skeleton height={90} />
                </View>
            ) : error ? (
                <View style={styles.message}>
                    <Text style={styles.error}>{error}</Text>
                    <Pressable
                        onPress={() => void loadVendedores()}
                        style={styles.button}
                    >
                        <Text>Reintentar</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.list}>
                    <Text style={styles.count}>
                        Total de vendedores: {response?.pagination.total ?? 0}
                    </Text>

                    {response?.data.length === 0 ? (
                        <Text>No hay vendedores registrados.</Text>
                    ) : (

                        response?.data.map((vendedor: VendedorAdmin) => (
                            <Pressable
                                key={vendedor.id}
                                onPress={() =>
                                    router.push({
                                        pathname: '/super-admin/vendedores/[id]',
                                        params: { id: vendedor.id },
                                    })
                                }
                                style={({ pressed }) => [
                                    styles.card,
                                    pressed && styles.cardPressed,
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel={`Ver detalle de ${vendedor.nombre} ${vendedor.apellido ?? ''}`}
                            >
                                <Text style={styles.name}>
                                    {vendedor.nombre} {vendedor.apellido ?? ''}
                                </Text>

                                {vendedor.empresa?.trim() ? (
                                    <Text style={styles.detail}>
                                        Empresa: {vendedor.empresa}
                                    </Text>
                                ) : null}

                                <Text style={styles.detail}>
                                    Correo: {vendedor.email}
                                </Text>

                                <Text style={styles.detail}>
                                    Estado: {vendedor.estado}
                                </Text>
                            </Pressable>
                        ))

                    )}
                    {/* Paginación de vendedores */}
                    {response && response.pagination.totalPages > 1 && (
                        <View style={styles.pagination}>
                            <Text style={styles.paginationInfo}>
                                Página {response.pagination.page} de {response.pagination.totalPages}
                                {' · '}
                                {response.pagination.total} vendedores
                            </Text>

                            <View style={styles.paginationButtons}>
                                <Pressable
                                    onPress={() =>
                                        setPage((current) => Math.max(1, current - 1))
                                    }
                                    disabled={page <= 1}
                                    style={[
                                        styles.pageButton,
                                        page <= 1 && styles.pageButtonDisabled,
                                    ]}
                                >
                                    <Text style={styles.pageButtonText}>
                                        Anterior
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={() =>
                                        setPage((current) =>
                                            Math.min(
                                                response.pagination.totalPages,
                                                current + 1
                                            )
                                        )
                                    }
                                    disabled={page >= response.pagination.totalPages}
                                    style={[
                                        styles.pageButton,
                                        page >= response.pagination.totalPages &&
                                        styles.pageButtonDisabled,
                                    ]}
                                >
                                    <Text style={styles.pageButtonText}>
                                        Siguiente
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                </View>
            )}

            <Pressable
                onPress={() => router.replace('/super-admin/vendedores/estados')}
                style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Volver a seleccionar estado"
            >
                <Text style={styles.backButtonText}>
                    Volver
                </Text>
            </Pressable>
        </Screen>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 8,
    },
    cardPressed: {
        opacity: 0.7,
    },

    pagination: {
        marginTop: 16,
        gap: 12,
    },
    paginationInfo: {
        fontSize: 14,
        textAlign: 'center',
    },
    paginationButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    pageButton: {
        flex: 1,
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageButtonDisabled: {
        opacity: 0.35,
    },
    pageButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },

    backButton: {
        marginTop: 24,
        marginBottom: 20,
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    backButtonPressed: {
        opacity: 0.7,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    list: {
        gap: 12,
    },
    detail: {
        fontSize: 14,
        lineHeight: 21,
    },
    count: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 6,
    },
    name: {
        fontSize: 17,
        fontWeight: '600',
    },
    message: {
        gap: 12,
    },
    error: {
        color: '#dc2626',
    },
    button: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
});
