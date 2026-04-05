import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatBarProps {
  label: string;
  value: number;
  color?: string;
}

const getBarColor = (value: number, fallback?: string): string => {
  if (fallback) return fallback;
  if (value > 60) return '#4CAF50';
  if (value > 30) return '#FFC107';
  return '#F44336';
};

const StatBar: React.FC<StatBarProps> = ({ label, value, color }) => {
  const barColor = getBarColor(value, color);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(value)}</Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A3060',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B4E8B',
  },
  barBackground: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0D6EB',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
});

export default StatBar;
