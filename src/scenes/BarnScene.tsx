import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { UNICORN_DEFINITIONS } from '../types';
import GlowWrapper from '../components/GlowWrapper';
import { useGame } from '../context/GameContext';

const BarnScene: React.FC = () => {
  const { state, selectUnicorn, goToCare } = useGame();

  return (
    <View style={styles.container}>
      {/* Cloud-themed background layers */}
      <View style={styles.bgLayer1} />
      <View style={styles.bgLayer2} />
      <View style={styles.bgLayer3} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>✨ Cloud Barn ✨</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Points</Text>
              <Text style={styles.statValue}>{state.totalPoints}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>{state.level}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Tap a unicorn to begin your ride</Text>
        </View>

        {/* Unicorn Grid */}
        <View style={styles.grid}>
          {UNICORN_DEFINITIONS.map((unicorn) => {
            const isSelected = state.selectedUnicorn === unicorn.id;
            return (
              <GlowWrapper
                key={unicorn.id}
                active
                color="#FFD700"
                style={styles.glowContainer}
              >
                <TouchableOpacity
                  style={[
                    styles.stall,
                    { backgroundColor: unicorn.color },
                    isSelected && styles.stallSelected,
                  ]}
                  onPress={() => selectUnicorn(unicorn.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.stallInner}>
                    <Text style={styles.unicornEmoji}>{unicorn.emoji}</Text>
                    <Text
                      style={[
                        styles.unicornName,
                        unicorn.id === 'white' && styles.unicornNameDark,
                        unicorn.id === 'yellow' && styles.unicornNameDark,
                        unicorn.id === 'mint' && styles.unicornNameDark,
                      ]}
                    >
                      {unicorn.name}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </GlowWrapper>
            );
          })}
        </View>

        {/* Care Button */}
        <TouchableOpacity
          style={styles.careButton}
          onPress={goToCare}
          activeOpacity={0.8}
        >
          <Text style={styles.careButtonText}>🐴 Care for Unicorn</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  bgLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: '#D6ECFA',
    opacity: 0.7,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  bgLayer2: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    height: '25%',
    backgroundColor: '#FFFFFF',
    opacity: 0.4,
    borderRadius: 100,
  },
  bgLayer3: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: '#F0F8FF',
    opacity: 0.6,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E6B',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8899AA',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#C8960C',
  },
  subtitle: {
    fontSize: 16,
    color: '#5A7A9A',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  glowContainer: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
  },
  stall: {
    borderRadius: 14,
    padding: 16,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  stallSelected: {
    borderColor: '#FFD700',
    borderWidth: 4,
  },
  stallInner: {
    alignItems: 'center',
  },
  unicornEmoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  unicornName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  unicornNameDark: {
    color: '#2C3E6B',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  careButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'center',
    shadowColor: '#C8960C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#E8B800',
  },
  careButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E6B',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default BarnScene;
