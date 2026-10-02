import { StyleSheet, Text, View } from 'react-native';

import { useNetwork } from '@/network/useNetwork';

export function OfflineBanner() {
  const { isOnline } = useNetwork();

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Sin conexión a Internet
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },

  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});