import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';
import StatBar from './StatBar';
import ActionButton from './ActionButton';

const getMoodText = (avg: number): string => {
  if (avg > 80) return 'Magical! ✨';
  if (avg > 60) return 'Happy 😊';
  if (avg > 40) return 'Needs attention 😟';
  return 'Help me! 😢';
};

const UnicornGame: React.FC = () => {
  const { unicorn, feed, play, sleep, clean, heal } = useGame();

  const avgStats =
    (unicorn.hunger +
      unicorn.happiness +
      unicorn.energy +
      unicorn.health +
      unicorn.cleanliness) /
    5;

  const xpPercent = (unicorn.xp / 100) * 100;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{unicorn.name}</Text>
        <View style={styles.levelRow}>
          <Text style={styles.levelText}>Lv. {unicorn.level}</Text>
          <Text style={styles.ageText}>Age: {unicorn.age}</Text>
        </View>
        <View style={styles.xpBarContainer}>
          <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarFill, { width: `${xpPercent}%` }]} />
          </View>
          <Text style={styles.xpText}>XP {unicorn.xp}/100</Text>
        </View>
      </View>

      {/* Unicorn Sprite Area */}
      <View style={styles.spriteArea}>
        <Text style={styles.unicornEmoji}>🦄</Text>
        <Text style={styles.moodText}>{getMoodText(avgStats)}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <StatBar label="Hunger" value={unicorn.hunger} />
        <StatBar label="Happiness" value={unicorn.happiness} />
        <StatBar label="Energy" value={unicorn.energy} />
        <StatBar label="Health" value={unicorn.health} />
        <StatBar label="Cleanliness" value={unicorn.cleanliness} />
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionGrid}>
          <ActionButton label="Feed" emoji="🍎" onPress={feed} />
          <ActionButton label="Play" emoji="⚡" onPress={play} />
          <ActionButton label="Sleep" emoji="💤" onPress={sleep} />
          <ActionButton label="Clean" emoji="🛁" onPress={clean} />
          <ActionButton label="Heal" emoji="💊" onPress={heal} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5EAFF',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    color: '#5E2D82',
    letterSpacing: 1,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 16,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9B59B6',
  },
  ageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E6AAF',
  },
  xpBarContainer: {
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  xpBarBackground: {
    width: '80%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DCC6F0',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E6AAF',
    marginTop: 2,
  },
  spriteArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginVertical: 10,
    backgroundColor: '#EDE0F8',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#D4B8E8',
  },
  unicornEmoji: {
    fontSize: 120,
  },
  moodText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7B3FA0',
    marginTop: 8,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#5E2D82',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5E2D82',
    marginBottom: 10,
  },
  actionsContainer: {
    marginVertical: 10,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default UnicornGame;
