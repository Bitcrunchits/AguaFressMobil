import { StyleSheet, View } from 'react-native';

type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
};

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 6,
}: SkeletonProps) {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#777',
    opacity: 0.2,
  },
});