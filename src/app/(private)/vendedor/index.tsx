import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSession } from '@/features/auth/useSession';

export default function VendedorHomeScreen() {
  const { user, signOut } = useSession();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aguafress</Text>

      <Text style={styles.subtitle}>
        Home Vendedor
      </Text>

      <Text style={styles.user}>
        {user?.nombre ?? user?.email}
      </Text>

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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },

  user: {
    fontSize: 14,
    marginBottom: 32,
  },

  button: {
    minHeight: 48,
    minWidth: 160,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});