
import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useSession } from '@/features/auth/useSession';
import type { VendedorEstado } from '@/features/admin/types/admin.types';

const estados: {
  estado: VendedorEstado;
  titulo: string;
  descripcion: string;
}[] = [
  {
    estado: 'pendiente',
    titulo: 'Pendientes',
    descripcion: 'Esperan aprobación',
  },
  {
    estado: 'activo',
    titulo: 'Activos',
    descripcion: 'Vendedores habilitados',
  },
  {
    estado: 'inactivo',
    titulo: 'Inactivos',
    descripcion: 'Vendedores desactivados',
  },
  {
    estado: 'bloqueado',
    titulo: 'Bloqueados',
    descripcion: 'Vendedores con acceso restringido',
  },
];

export default function VendedoresEstadosScreen() {
  const { user, isLoading } = useSession();

  if (isLoading) return null;

  if (user?.role !== 'super_admin') {
    return <Redirect href="/login" />;
  }

  function abrirListado(estado?: VendedorEstado) {
    router.push({
      pathname: '/super-admin/vendedores',
      params: estado ? { estado } : {},
    });
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Administrar vendedores</Text>

      <Text style={styles.subtitle}>
        Seleccioná un estado para consultar los vendedores.
      </Text>

      <View style={styles.grid}>
        {estados.map((item) => (
          <Pressable
            key={item.estado}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.pressed,
            ]}
            onPress={() => abrirListado(item.estado)}
            accessibilityRole="button"
            accessibilityLabel={`Ver vendedores ${item.titulo.toLowerCase()}`}
          >
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardDescription}>
              {item.descripcion}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.allButton,
          pressed && styles.pressed,
        ]}
        onPress={() => abrirListado()}
        accessibilityRole="button"
      >
        <Text style={styles.allButtonText}>
          Ver todos los vendedores
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
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    justifyContent: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  allButton: {
    marginTop: 20,
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  allButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
