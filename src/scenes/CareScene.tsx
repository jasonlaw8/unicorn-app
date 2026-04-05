import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { UNICORN_DEFINITIONS } from '../types';
import StatBar from '../components/StatBar';
import GlowWrapper from '../components/GlowWrapper';

const DEFAULT_UNICORN = {
  id: 'purple' as const,
  name: 'Mystery Unicorn',
  color: '#9B59B6',
  maneColor: '#D4A5E5',
  emoji: '🦄',
};

const CareScene: React.FC = () => {
  const { state, feedUnicorn, waterUnicorn, cleanStall, exerciseUnicorn, returnToBarn } = useGame();
  const { stats, totalPoints, level } = state;

  const unicornDef =
    UNICORN_DEFINITIONS.find((u) => u.id === state.selectedUnicorn) ??
    DEFAULT_UNICORN;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          🏠 {unicornDef.name}&apos;s Stall
        </Text>
        <View style={styles.headerInfo}>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.pointsText}>{totalPoints} pts</Text>
        </View>
      </View>

      {/* Unicorn Display */}
      <View
        style={[
          styles.unicornDisplay,
          { backgroundColor: unicornDef.color + '30' },
        ]}
      >
        <Text style={styles.unicornEmoji}>{unicornDef.emoji}</Text>
      </View>

      {/* Stats Panel */}
      <View style={styles.statsPanel}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <StatBar label="Hunger" value={stats.hunger} color="#FF8C42" />
        <StatBar label="Happiness" value={stats.happiness} color="#FF69B4" />
        <StatBar label="Energy" value={stats.energy} color="#FFD700" />
        <StatBar label="Health" value={stats.health} color="#4CAF50" />
        <StatBar label="Cleanliness" value={stats.cleanliness} color="#87CEEB" />
        <StatBar label="Stall Clean" value={stats.stallClean} color="#8B4513" />
      </View>

      {/* Care Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Care Actions</Text>
        <View style={styles.actionGrid}>
          <GlowWrapper active={stats.hunger < 50} color="#FF8C42" style={styles.actionWrapper}>
            <TouchableOpacity style={styles.actionButton} onPress={feedUnicorn}>
              <Text style={styles.actionEmoji}>🍎</Text>
              <Text style={styles.actionLabel}>Feed</Text>
            </TouchableOpacity>
          </GlowWrapper>

          <GlowWrapper active={stats.hunger < 40} color="#4FC3F7" style={styles.actionWrapper}>
            <TouchableOpacity style={styles.actionButton} onPress={waterUnicorn}>
              <Text style={styles.actionEmoji}>💧</Text>
              <Text style={styles.actionLabel}>Water</Text>
            </TouchableOpacity>
          </GlowWrapper>

          <GlowWrapper active={stats.stallClean < 50} color="#8B4513" style={styles.actionWrapper}>
            <TouchableOpacity style={styles.actionButton} onPress={cleanStall}>
              <Text style={styles.actionEmoji}>🧹</Text>
              <Text style={styles.actionLabel}>Clean Stall</Text>
            </TouchableOpacity>
          </GlowWrapper>

          <GlowWrapper active={stats.energy > 30} color="#FFD700" style={styles.actionWrapper}>
            <TouchableOpacity style={styles.actionButton} onPress={exerciseUnicorn}>
              <Text style={styles.actionEmoji}>🏃</Text>
              <Text style={styles.actionLabel}>Exercise</Text>
            </TouchableOpacity>
          </GlowWrapper>
        </View>
      </View>

      {/* Return to Barn */}
      <TouchableOpacity style={styles.returnButton} onPress={returnToBarn}>
        <Text style={styles.returnButtonText}>Return to Barn</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5E6D0',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#5C3A1E',
  },
  headerInfo: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 6,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B6914',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#A0522D',
  },
  unicornDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#C4A46C',
  },
  unicornEmoji: {
    fontSize: 100,
  },
  statsPanel: {
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4B896',
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5C3A1E',
    marginBottom: 10,
  },
  actionsSection: {
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4B896',
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5C3A1E',
  },
  returnButton: {
    backgroundColor: '#8B6914',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  returnButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default CareScene;
