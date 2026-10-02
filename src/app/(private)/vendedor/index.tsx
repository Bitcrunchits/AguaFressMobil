import { StyleSheet, Text, View } from 'react-native';

export default function VendedorHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aguafress</Text>
      <Text>Home Vendedor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
});