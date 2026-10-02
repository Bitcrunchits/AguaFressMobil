import { StyleSheet, Text, View } from 'react-native';

export default function ClienteHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aguafress</Text>
      <Text>Home Cliente</Text>
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