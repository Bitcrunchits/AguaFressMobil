import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  authenticateWithBiometrics,
  isBiometricAvailable,
} from '@/features/auth/services/biometric.service';

import {
  isBiometricEnabled,
  setBiometricEnabled,
} from '@/lib/storage/secure-storage';

import { login } from '@/features/auth/services/auth.service';
import { useSession } from '@/features/auth/useSession';
import { ApiError } from '@/lib/api/api.types';
import { useNetwork } from '@/network/useNetwork';

export default function LoginScreen() {
  const { signIn } = useSession();
  const { isOnline } = useNetwork();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  async function offerBiometricActivation() {
    try {
      const enabled = await isBiometricEnabled();

      if (enabled) return;

      const available = await isBiometricAvailable();

      if (!available) return;

      Alert.alert(
        'Acceso biométrico',
        '¿Querés utilizar tu huella digital o reconocimiento facial para desbloquear Aguafress en próximos ingresos?',
        [
          {
            text: 'Ahora no',
            style: 'cancel',
          },
          {
            text: 'Activar',
            onPress: async () => {
              try {
                const authenticated =
                  await authenticateWithBiometrics();

                if (authenticated) {
                  await setBiometricEnabled(true);
                } else {
                  Alert.alert(
                    'Biometría no activada',
                    'No se pudo completar la verificación biométrica.'
                  );
                }
              } catch {
                Alert.alert(
                  'Error',
                  'No se pudo activar el acceso biométrico.'
                );
              }
            },
          },
        ]
      );
    } catch {
      // La biometría es opcional: no debe impedir el login.
    }
  }

  async function handleLogin() {
    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage(
        'Ingresá tu correo electrónico y contraseña.'
      );
      return;
    }

    if (!isOnline) {
      setErrorMessage(
        'No hay conexión a Internet.'
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await login({
        email: email.trim(),
        password,
      });

      await signIn(response);
      await offerBiometricActivation();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.type === 'API_UNAVAILABLE') {
          setErrorMessage(
            'No se pudo conectar con el servidor.'
          );
          return;
        }

        if (error.statusCode === 401) {
          setErrorMessage(
            'Correo electrónico o contraseña incorrectos.'
          );
          return;
        }

        setErrorMessage(error.message);
        return;
      }

      setErrorMessage(
        'Ocurrió un error inesperado.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aguafress</Text>

      <Text style={styles.subtitle}>
        Iniciar sesión
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        editable={!isSubmitting}
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
        editable={!isSubmitting}
        style={styles.input}
      />

      {errorMessage ? (
        <Text style={styles.error}>
          {errorMessage}
        </Text>
      ) : null}

      <Pressable
        onPress={handleLogin}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isSubmitting && styles.buttonDisabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>
            Ingresar
          </Text>
        )}
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
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },

  error: {
    marginBottom: 16,
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
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});