import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();

  if (!hasHardware) {
    return false;
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  return isEnrolled;
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const available = await isBiometricAvailable();

  if (!available) {
    return false;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Desbloquear Aguafress',
    cancelLabel: 'Cancelar',
    disableDeviceFallback: true,
  });

  return result.success;
}