import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/useSession';
import { getCustomerById, updateCustomer } from '@/features/customers/services/customers.service';
import { ApiError } from '@/lib/api/api.types';

export default function EditCustomerScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { token } = useSession();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const loadCustomer = useCallback(async () => {
        if (!token || !id) {
            setErrorMessage(
                'No se pudo identificar el cliente.'
            );
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage(null);

            const customer = await getCustomerById({
                id,
                token,
            });

            setNombre(customer.nombre);
            setApellido(customer.apellido);
            setTelefono(customer.telefono);
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

    async function handleSave() {
        if (!token || !id || isSubmitting) {
            return;
        }

        const cleanNombre = nombre.trim();
        const cleanApellido = apellido.trim();
        const cleanTelefono = telefono.trim();

        if (!cleanNombre || !cleanApellido || !cleanTelefono) {
            setErrorMessage(
                'Nombre, apellido y teléfono son obligatorios.'
            );
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            await updateCustomer({
                id,
                token,
                data: {
                    nombre: cleanNombre,
                    apellido: cleanApellido,
                    telefono: cleanTelefono,
                },
            });

            router.back();
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage(
                    'No se pudieron guardar los cambios.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Screen scroll>
            <Text style={styles.title}>
                Editar cliente
            </Text>

            {isLoading ? (
                <EditCustomerSkeleton />
            ) : errorMessage ? (
                <View style={styles.stateContainer}>
                    <Text style={styles.error}>
                        {errorMessage}
                    </Text>
                </View>
            ) : (
                <View style={styles.form}>
                    <View>
                        <Text style={styles.label}>
                            Nombre
                        </Text>

                        <TextInput
                            value={nombre}
                            onChangeText={setNombre}
                            style={styles.input}
                            autoCapitalize="words"
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>
                            Apellido
                        </Text>

                        <TextInput
                            value={apellido}
                            onChangeText={setApellido}
                            style={styles.input}
                            autoCapitalize="words"
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>
                            Teléfono
                        </Text>

                        <TextInput
                            value={telefono}
                            onChangeText={setTelefono}
                            style={styles.input}
                            keyboardType="phone-pad"
                        />
                    </View>
                    {errorMessage ? (
                        <Text style={styles.error}>
                            {errorMessage}
                        </Text>
                    ) : null}

                    <Pressable
                        onPress={handleSave}
                        disabled={isSubmitting}
                        style={({ pressed }) => [
                            styles.saveButton,
                            pressed && styles.buttonPressed,
                            isSubmitting && styles.buttonDisabled,
                        ]}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator />
                        ) : (
                            <Text style={styles.saveButtonText}>
                                Guardar cambios
                            </Text>
                        )}
                    </Pressable>
                </View>
            )}
        </Screen>
    );
}

function EditCustomerSkeleton() {
    return (
        <View style={styles.form}>
            <View>
                <Skeleton width="25%" height={14} />
                <View style={styles.skeletonGap} />
                <Skeleton height={48} borderRadius={8} />
            </View>

            <View>
                <Skeleton width="25%" height={14} />
                <View style={styles.skeletonGap} />
                <Skeleton height={48} borderRadius={8} />
            </View>

            <View>
                <Skeleton width="25%" height={14} />
                <View style={styles.skeletonGap} />
                <Skeleton height={48} borderRadius={8} />
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

    form: {
        gap: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },

    input: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },

    stateContainer: {
        paddingVertical: 24,
    },

    error: {
        fontSize: 14,
    },

    skeletonGap: {
        height: 8,
    },

    saveButton: {
  minHeight: 48,
  borderWidth: 1,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 16,
  marginTop: 4,
},

saveButtonText: {
  fontSize: 16,
  fontWeight: '600',
},

buttonPressed: {
  opacity: 0.7,
},

buttonDisabled: {
  opacity: 0.5,
},
});