import { useCallback, useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/useSession';

import {
    getCustomerById,
    updateCustomer,
} from '@/features/customers/services/customers.service';

export default function EditCustomerScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { token } = useSession();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');

    const [calle, setCalle] = useState('');
    const [numero, setNumero] = useState('');
    const [pisoDepto, setPisoDepto] = useState('');
    const [referencia, setReferencia] = useState('');
    const [barrio, setBarrio] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [provincia, setProvincia] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');

    const [
        mismaDireccionEntrega,
        setMismaDireccionEntrega,
    ] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadCustomer = useCallback(async () => {
        if (!id || !token) {
            setErrorMessage('No se pudo identificar el cliente.');
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

            setNombre(customer.nombre ?? '');
            setApellido(customer.apellido ?? '');
            setTelefono(customer.telefono ?? '');

            setMismaDireccionEntrega(
                customer.misma_direccion_entrega
            );

            setCalle(
                customer.entrega_calle ??
                customer.direccion_calle ??
                ''
            );

            setNumero(
                customer.entrega_numero ??
                customer.direccion_numero ??
                ''
            );

            setPisoDepto(
                customer.entrega_piso ??
                customer.direccion_piso ??
                ''
            );

            setReferencia(
                customer.entrega_referencia ??
                customer.direccion_referencia ??
                ''
            );

            setBarrio(
                customer.entrega_barrio ??
                customer.direccion_barrio ??
                ''
            );

            setCiudad(
                customer.entrega_ciudad ??
                customer.direccion_ciudad ??
                ''
            );

            setProvincia(
                customer.entrega_provincia ??
                customer.direccion_provincia ??
                ''
            );

            setCodigoPostal(
                customer.entrega_cp ??
                customer.direccion_cp ??
                ''
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'No se pudo cargar el cliente.';

            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }, [id, token]);

    const handleSave = async () => {
        if (!id || !token) {
            setErrorMessage('No se pudo identificar el cliente.');
            return;
        }

        const cleanNombre = nombre.trim();
        const cleanApellido = apellido.trim();
        const cleanTelefono = telefono.trim();

        if (!cleanNombre) {
            setErrorMessage('El nombre es obligatorio.');
            return;
        }

        if (!cleanApellido) {
            setErrorMessage('El apellido es obligatorio.');
            return;
        }

        if (!cleanTelefono) {
            setErrorMessage('El teléfono es obligatorio.');
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

                    mismaDireccionEntrega,

                    ...(mismaDireccionEntrega
                        ? {}
                        : {
                            entregaCalle: calle.trim(),
                            entregaNumero: numero.trim(),
                            entregaPiso: pisoDepto.trim(),
                            entregaReferencia: referencia.trim(),
                            entregaBarrio: barrio.trim(),
                            entregaCiudad: ciudad.trim(),
                            entregaProvincia: provincia.trim(),
                            entregaCp: codigoPostal.trim(),
                        }),
                },
            });

            router.back();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'No se pudieron guardar los cambios.';

            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Carga inicial
    useEffect(() => {
        void loadCustomer();
    }, [loadCustomer]);

    if (isLoading) {
        return (
            <Screen>
                <View style={styles.container}>
                    <Skeleton
                        width="55%"
                        height={28}
                        borderRadius={8}
                    />

                    <Skeleton
                        width="100%"
                        height={52}
                        borderRadius={10}
                    />

                    <Skeleton
                        width="100%"
                        height={52}
                        borderRadius={10}
                    />

                    <Skeleton
                        width="100%"
                        height={52}
                        borderRadius={10}
                    />

                    <Skeleton
                        width="100%"
                        height={120}
                        borderRadius={10}
                    />
                </View>
            </Screen>
        );
    }

    return (
        <Screen scroll>
            <View style={styles.container}>
                <Pressable
                    onPress={() => router.back()}
                    disabled={isSubmitting}
                >
                    <Text style={styles.backText}>
                        Volver
                    </Text>
                </Pressable>

                <Text style={styles.title}>
                    Editar cliente
                </Text>

                {errorMessage ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>
                            {errorMessage}
                        </Text>
                    </View>
                ) : null}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Datos personales
                    </Text>

                    <View>
                        <Text style={styles.label}>
                            Nombre
                        </Text>

                        <TextInput
                            value={nombre}
                            onChangeText={setNombre}
                            style={styles.input}
                            autoCapitalize="words"
                            editable={!isSubmitting}
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
                            editable={!isSubmitting}
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
                            editable={!isSubmitting}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Dirección de entrega
                    </Text>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>
                            Usar la misma dirección del cliente
                        </Text>

                        <Switch
                            value={mismaDireccionEntrega}
                            onValueChange={setMismaDireccionEntrega}
                            disabled={isSubmitting}
                        />
                    </View>

                    {mismaDireccionEntrega ? (
                        <View style={styles.addressSummary}>
                            <Text style={styles.addressSummaryTitle}>
                                Dirección utilizada para la entrega
                            </Text>

                            <Text style={styles.addressSummaryText}>
                                {[
                                    calle,
                                    numero,
                                    pisoDepto
                                        ? `Piso ${pisoDepto}`
                                        : null,
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            </Text>

                            <Text style={styles.addressSummaryText}>
                                {[
                                    barrio,
                                    ciudad,
                                    provincia,
                                    codigoPostal
                                        ? `CP ${codigoPostal}`
                                        : null,
                                ]
                                    .filter(Boolean)
                                    .join(', ')}
                            </Text>

                            {referencia ? (
                                <Text style={styles.addressReference}>
                                    Referencia: {referencia}
                                </Text>
                            ) : null}
                        </View>
                    ) : (
                        <>
                            <View>
                                <Text style={styles.label}>
                                    Calle
                                </Text>

                                <TextInput
                                    value={calle}
                                    onChangeText={setCalle}
                                    style={styles.input}
                                    autoCapitalize="words"
                                    editable={!isSubmitting}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Número
                                </Text>

                                <TextInput
                                    value={numero}
                                    onChangeText={setNumero}
                                    style={styles.input}
                                    keyboardType="numeric"
                                    editable={!isSubmitting}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Piso / Departamento
                                </Text>

                                <TextInput
                                    value={pisoDepto}
                                    onChangeText={setPisoDepto}
                                    style={styles.input}
                                    editable={!isSubmitting}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Referencia
                                </Text>

                                <TextInput
                                    value={referencia}
                                    onChangeText={setReferencia}
                                    style={[
                                        styles.input,
                                        styles.multilineInput,
                                    ]}
                                    multiline
                                    editable={!isSubmitting}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Barrio
                                </Text>

                                <TextInput
                                    value={barrio}
                                    onChangeText={setBarrio}
                                    style={styles.input}
                                    autoCapitalize="words"
                                    editable={!isSubmitting}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Ciudad
                                </Text>

                                <TextInput
                                    value={ciudad}
                                    onChangeText={setCiudad}
                                    style={styles.input}
                                    autoCapitalize="words"
                                    editable={!isSubmitting}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Provincia
                                </Text>

                                <TextInput
                                    value={provincia}
                                    onChangeText={setProvincia}
                                    style={styles.input}
                                    autoCapitalize="words"
                                    editable={!isSubmitting}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Código postal
                                </Text>

                                <TextInput
                                    value={codigoPostal}
                                    onChangeText={setCodigoPostal}
                                    style={styles.input}
                                    editable={!isSubmitting}
                                />
                            </View>
                        </>
                    )}
                </View>

                <Pressable
                    style={[
                        styles.saveButton,
                        isSubmitting && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={isSubmitting}
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
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 20,
    },

    backText: {
        fontSize: 16,
        fontWeight: '500',
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
    },

    section: {
        gap: 14,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
    },

    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
    },

    input: {
        minHeight: 48,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },

    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },

    switchRow: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },

    switchLabel: {
        flex: 1,
        fontSize: 16,
    },

    addressSummary: {
        padding: 14,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        gap: 4,
    },

    addressSummaryTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },

    addressSummaryText: {
        fontSize: 15,
        lineHeight: 21,
    },

    addressReference: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 4,
    },

    errorBox: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#dc2626',
        borderRadius: 10,
    },

    errorText: {
        fontSize: 14,
    },

    saveButton: {
        minHeight: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111827',
    },

    saveButtonDisabled: {
        opacity: 0.6,
    },

    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});