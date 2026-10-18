
import { useCallback, useEffect, useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
} from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/useSession';
import { getAdminVendedorById, cambiarEstadoVendedor } from '@/features/admin/services/admin.service';
import type { VendedorAdmin, CambiarEstadoVendedorRequest } from '@/features/admin/types/admin.types';
import { ApiError } from '@/lib/api/api.types';

export default function AdminVendedorDetalleScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { token, user, isLoading: isSessionLoading } = useSession();

    const [vendedor, setVendedor] = useState<VendedorAdmin | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [accionCritica, setAccionCritica] = useState<{
        estado: CambiarEstadoVendedorRequest['estado'];
        accion: string;
    } | null>(null);

    const [textoConfirmacion, setTextoConfirmacion] = useState('');

    const loadVendedor = useCallback(async () => {
        if (!token || user?.role !== 'super_admin' || !id) return;

        try {
            setIsLoading(true);
            setError(null);

            const result = await getAdminVendedorById({
                token,
                vendedorId: id,
            });

            setVendedor(result);
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : 'No se pudo cargar el vendedor.'
            );
        } finally {
            setIsLoading(false);
        }
    }, [token, user?.role, id]);



    async function ejecutarCambioEstado(
        nuevoEstado: CambiarEstadoVendedorRequest['estado']
    ) {
        if (!token || !vendedor || isSubmitting) return;

        try {
            setIsSubmitting(true);
            setError(null);
            

            await cambiarEstadoVendedor({
                token,
                vendedorId: vendedor.id,
                data: { estado: nuevoEstado },
            });

            setAccionCritica(null);
            setTextoConfirmacion('');

            await loadVendedor();

            Alert.alert(
                'Operación exitosa',
                `El vendedor ahora tiene estado: ${nuevoEstado}.`
            );
        } catch (err) {
            Alert.alert(
                'Error',
                err instanceof ApiError
                    ? err.message
                    : 'No se pudo actualizar el estado del vendedor.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function confirmarCambioEstado(
        nuevoEstado: CambiarEstadoVendedorRequest['estado'],
        accion: string
    ) {
        if (!token || !vendedor || isSubmitting) return;

        if (
            (accion === 'Bloquear' && nuevoEstado === 'bloqueado') ||
            (accion === 'Desactivar' && nuevoEstado === 'inactivo')
        ) {
            setTextoConfirmacion('');
            setAccionCritica({ estado: nuevoEstado, accion });
            return;
        }

        Alert.alert(
            'Confirmar acción',
            `¿Querés ${accion.toLowerCase()} a ${vendedor.nombre} ${vendedor.apellido ?? ''}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: () => void ejecutarCambioEstado(nuevoEstado),
                },
            ]
        );
    }



    useEffect(() => {
        void loadVendedor();
    }, [loadVendedor]);

    if (isSessionLoading) return null;

    if (user?.role !== 'super_admin') {
        return <Redirect href="/login" />;
    }

    return (
        <Screen scroll>
            <Text style={styles.title}>Detalle del vendedor</Text>

            {isLoading ? (
                <View style={styles.content}>
                    <Skeleton height={80} />
                    <Skeleton height={80} />
                    <Skeleton height={80} />
                </View>
            ) : error ? (
                <View style={styles.content}>
                    <Text style={styles.error}>{error}</Text>

                    <Pressable
                        onPress={() => void loadVendedor()}
                        style={styles.button}
                        accessibilityRole="button"
                    >
                        <Text style={styles.buttonText}>Reintentar</Text>
                    </Pressable>
                </View>
            ) : vendedor ? (
                <View style={styles.card}>
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

                    {vendedor.telefono ? (
                        <Text style={styles.detail}>
                            Teléfono: {vendedor.telefono}
                        </Text>
                    ) : null}

                    {vendedor.ciudad ? (
                        <Text style={styles.detail}>
                            Ciudad: {vendedor.ciudad}
                        </Text>
                    ) : null}

                    <Text style={styles.detail}>
                        Estado: {vendedor.estado}
                    </Text>


                    <View style={styles.actions}>
                        {vendedor.estado === 'pendiente' && (
                            <Pressable
                                disabled={isSubmitting}
                                onPress={() => confirmarCambioEstado('activo', 'Aprobar')}
                                style={[styles.actionButton, isSubmitting && styles.disabled]}
                            >
                                <Text style={styles.actionText}>Aprobar vendedor</Text>
                            </Pressable>
                        )}

                        {vendedor.estado === 'activo' && (
                            <Pressable
                                disabled={isSubmitting}
                                onPress={() => confirmarCambioEstado('inactivo', 'Desactivar')}
                                style={[styles.actionButton, isSubmitting && styles.disabled]}
                            >
                                <Text style={styles.actionText}>Desactivar vendedor</Text>
                            </Pressable>
                        )}

                        {(vendedor.estado === 'activo' ||
                            vendedor.estado === 'inactivo') && (
                                <Pressable
                                    disabled={isSubmitting}
                                    onPress={() => confirmarCambioEstado('bloqueado', 'Bloquear')}
                                    style={[styles.actionButton, isSubmitting && styles.disabled]}
                                >
                                    <Text style={styles.actionText}>Bloquear vendedor</Text>
                                </Pressable>
                            )}


                        {vendedor.estado === 'bloqueado' && (
                            <Pressable
                                disabled={isSubmitting}
                                onPress={() =>
                                    confirmarCambioEstado('inactivo', 'Desbloquear')
                                }
                                style={[
                                    styles.actionButton,
                                    isSubmitting && styles.disabled,
                                ]}
                                accessibilityRole="button"
                            >
                                <Text style={styles.actionText}>
                                    Desbloquear vendedor
                                </Text>
                            </Pressable>
                        )}

                        {vendedor.estado === 'inactivo' && (
                            <Pressable
                                disabled={isSubmitting}
                                onPress={() =>
                                    confirmarCambioEstado('activo', 'Reactivar')
                                }
                                style={[
                                    styles.actionButton,
                                    isSubmitting && styles.disabled,
                                ]}
                                accessibilityRole="button"
                            >
                                <Text style={styles.actionText}>
                                    Reactivar vendedor
                                </Text>
                            </Pressable>
                        )}


                        {isSubmitting && (
                            <Text style={styles.processing}>Procesando cambio...</Text>
                        )}
                    </View>


                    <Text style={styles.detail}>
                        Fecha de registro:{' '}
                        {new Date(vendedor.createdAt).toLocaleDateString('es-AR')}
                    </Text>
                </View>
            ) : (
                <Text>No se encontró el vendedor.</Text>
            )}

            <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Volver al listado"
            >
                <Text style={styles.buttonText}>Volver</Text>
            </Pressable>

            <Modal
                visible={accionCritica !== null}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    if (!isSubmitting) {
                        setAccionCritica(null);
                        setTextoConfirmacion('');
                    }
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Confirmar {accionCritica?.accion.toLowerCase()}
                        </Text>

                        <Text style={styles.modalDescription}>
                            Estás por {accionCritica?.accion.toLowerCase()} a{' '}
                            {vendedor?.nombre} {vendedor?.apellido ?? ''}.
                            {'\n\n'}
                            Esta operación puede interrumpir su actividad comercial.
                        </Text>

                        <Text style={styles.modalInstruction}>
                            Escribí CONFIRMAR para continuar.
                        </Text>

                        <TextInput
                            value={textoConfirmacion}
                            onChangeText={setTextoConfirmacion}
                            placeholder="CONFIRMAR"
                            autoCapitalize="characters"
                            autoCorrect={false}
                            editable={!isSubmitting}
                            style={styles.modalInput}
                            accessibilityLabel="Texto de confirmación"
                        />

                        <View style={styles.modalActions}>
                            <Pressable
                                disabled={isSubmitting}
                                onPress={() => {
                                    setAccionCritica(null);
                                    setTextoConfirmacion('');
                                }}
                                style={styles.modalButton}
                            >
                                <Text>Cancelar</Text>
                            </Pressable>

                            <Pressable
                                disabled={
                                    isSubmitting ||
                                    textoConfirmacion.trim() !== 'CONFIRMAR' ||
                                    !accionCritica
                                }
                                onPress={() => {
                                    if (
                                        accionCritica &&
                                        textoConfirmacion.trim() === 'CONFIRMAR'
                                    ) {
                                        void ejecutarCambioEstado(accionCritica.estado);
                                    }
                                }}
                                style={[
                                    styles.modalButton,
                                    (isSubmitting ||
                                        textoConfirmacion.trim() !== 'CONFIRMAR') &&
                                    styles.disabled,
                                ]}
                            >
                                <Text style={styles.actionText}>
                                    {isSubmitting ? 'Procesando...' : 'Confirmar operación'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

        </Screen>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 24,
    },
    content: {
        gap: 12,
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
    },
    detail: {
        fontSize: 15,
        lineHeight: 22,
    },
    error: {
        color: '#dc2626',
    },
    button: {
        borderWidth: 1,
        borderRadius: 10,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        marginTop: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 10,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },

    actions: {
        marginTop: 16,
        gap: 12,
    },
    actionButton: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        fontSize: 15,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.4,
    },
    processing: {
        fontSize: 14,
        textAlign: 'center',
    },

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)',
  justifyContent: 'center',
  padding: 24,
},
modalContent: {
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: 20,
  gap: 16,
},
modalTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#111827',
},
modalDescription: {
  fontSize: 15,
  lineHeight: 22,
  color: '#374151',
},
modalInstruction: {
  fontSize: 14,
  fontWeight: '600',
  color: '#111827',
},
modalInput: {
  minHeight: 48,
  borderWidth: 1,
  borderColor: '#9ca3af',
  borderRadius: 10,
  paddingHorizontal: 12,
  color: '#111827',
},
modalActions: {
  flexDirection: 'row',
  gap: 12,
},
modalButton: {
  flex: 1,
  minHeight: 48,
  borderWidth: 1,
  borderColor: '#9ca3af',
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 8,
},


});

