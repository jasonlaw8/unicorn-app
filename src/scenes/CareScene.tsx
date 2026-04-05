import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { UNICORN_DEFINITIONS, TACK_SHOP_ITEMS } from '../types';
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
  const {
    state,
    feedUnicorn,
    waterUnicorn,
    cleanStall,
    exerciseUnicorn,
    useTreat,
    goToShop,
    returnToBarn,
  } = useGame();
  const { stats, totalPoints, level, bondLevel, inventory } = state;

  const unicornDef =
    UNICORN_DEFINITIONS.find((u) => u.id === state.selectedUnicorn) ??
    DEFAULT_UNICORN;

  // Find treat items the player owns
  const ownedTreats = TACK_SHOP_ITEMS.filter(
    (item) =>
      item.category === 'treats' &&
      inventory.ownedItemIds.includes(item.id)
  );

  const bondHearts = Math.round((bondLevel / 100) * 5);

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏠 {unicornDef.name}'s Stall</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.pointsText}>{totalPoints} pts</Text>
        </View>
      </View>

      {/* Unicorn Display */}
      <View style={[styles.unicornDisplay, { backgroundColor: unicornDef.color + '30' }]}>
        <Text style={styles.unicornEmoji}>{unicornDef.emoji}</Text>
      </View>

      {/* Bond Level */}
      <View style={styles.bondCard}>
        <View style={styles.bondHeader}>
          <Text style={styles.bondTitle}>💖 Bond Level</Text>
          <Text style={styles.bondValue}>{bondLevel}/100</Text>
        </View>
        <View style={styles.bondBarBg}>
          <View style={[styles.bondBarFill, { width: `${bondLevel}%` }]} />
        </View>
        <View style={styles.bondHeartsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Text key={i} style={styles.bondHeart}>
              {i <= bondHearts ? '❤️' : '🤍'}
            </Text>
          ))}
        </View>
        <Text style={styles.bondTip}>Higher bond = better performance in the ring!</Text>
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

      {/* Treats Section */}
      {ownedTreats.length > 0 ? (
        <View style={styles.treatsSection}>
          <Text style={styles.sectionTitle}>🎁 Give a Treat</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.treatsRow}>
              {ownedTreats.map((treat) => (
                <GlowWrapper key={treat.id} active color="#FF69B4" style={styles.treatGlow}>
                  <TouchableOpacity
                    style={styles.treatButton}
                    onPress={() => useTreat(treat.id)}
                  >
                    <Text style={styles.treatEmoji}>{treat.emoji}</Text>
                    <Text style={styles.treatName}>{treat.name}</Text>
                    <Text style={styles.treatEffect}>{treat.effect}</Text>
                  </TouchableOpacity>
                </GlowWrapper>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        <TouchableOpacity style={styles.shopPrompt} onPress={goToShop}>
          <Text style={styles.shopPromptText}>🛍️ Visit the Tack Shop for treats!</Text>
        </TouchableOpacity>
      )}

      {/* Return to Barn */}
      <TouchableOpacity style={styles.returnButton} onPress={returnToBarn}>
        <Text style={styles.returnButtonText}>🏠 Return to Barn</Text>
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
    fontSize: 24,
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
    paddingVertical: 20,
    marginBottom: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#C4A46C',
  },
  unicornEmoji: {
    fontSize: 90,
  },
  bondCard: {
    backgroundColor: '#FFF0F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#F48FB1',
  },
  bondHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bondTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#C2185B',
  },
  bondValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E91E63',
  },
  bondBarBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FCE4EC',
    overflow: 'hidden',
    marginBottom: 8,
  },
  bondBarFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#E91E63',
  },
  bondHeartsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 6,
  },
  bondHeart: {
    fontSize: 22,
  },
  bondTip: {
    fontSize: 12,
    color: '#AD1457',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsPanel: {
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
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
    marginBottom: 14,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#5C3A1E',
  },
  treatsSection: {
    marginBottom: 14,
  },
  treatsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
  },
  treatGlow: {
    borderRadius: 12,
  },
  treatButton: {
    backgroundColor: '#FFF0F5',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    width: 110,
    borderWidth: 1,
    borderColor: '#F48FB1',
  },
  treatEmoji: {
    fontSize: 30,
    marginBottom: 4,
  },
  treatName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#880E4F',
    textAlign: 'center',
  },
  treatEffect: {
    fontSize: 10,
    color: '#AD1457',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 2,
  },
  shopPrompt: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D4B896',
    borderStyle: 'dashed',
  },
  shopPromptText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B6914',
  },
  returnButton: {
    backgroundColor: '#5C3A1E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  returnButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default CareScene;
