import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { CourseDifficulty, UNICORN_DEFINITIONS } from '../types';
import GlowWrapper from '../components/GlowWrapper';

interface DifficultyOption {
  difficulty: CourseDifficulty;
  label: string;
  obstacles: number;
  description: string;
  memorizeTime: number;
  color: string;
  glowColor: string;
  emoji: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  {
    difficulty: 'easy',
    label: 'Easy',
    obstacles: 5,
    description: 'Gentle course, perfect for beginners',
    memorizeTime: 15,
    color: '#7BCF72',
    glowColor: '#4CAF50',
    emoji: '🌿',
  },
  {
    difficulty: 'medium',
    label: 'Medium',
    obstacles: 8,
    description: 'Challenging jumps, test your skill',
    memorizeTime: 12,
    color: '#F5A623',
    glowColor: '#FF9800',
    emoji: '🔥',
  },
  {
    difficulty: 'hard',
    label: 'Hard',
    obstacles: 12,
    description: 'Championship level, only the brave',
    memorizeTime: 10,
    color: '#E74C3C',
    glowColor: '#F44336',
    emoji: '💎',
  },
];

const CourseSelectScene: React.FC = () => {
  const { state, selectDifficulty } = useGame();

  const unicorn = UNICORN_DEFINITIONS.find(
    (u) => u.id === state.selectedUnicorn
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Cloud decorations */}
      <View style={styles.cloudLeft}>
        <Text style={styles.cloudText}>☁️</Text>
      </View>
      <View style={styles.cloudRight}>
        <Text style={styles.cloudText}>☁️</Text>
      </View>

      <Text style={styles.header}>⛳ Equestrian Ring</Text>
      <Text style={styles.subHeader}>Choose Your Course</Text>

      {unicorn && (
        <View style={styles.unicornBadge}>
          <Text style={styles.unicornEmoji}>{unicorn.emoji}</Text>
          <Text style={[styles.unicornName, { color: unicorn.color }]}>
            {unicorn.name}
          </Text>
        </View>
      )}

      <View style={styles.greenAccent} />

      {DIFFICULTIES.map((option) => (
        <GlowWrapper
          key={option.difficulty}
          active
          color={option.glowColor}
          style={styles.cardWrapper}
        >
          <TouchableOpacity
            style={[styles.card, { borderColor: option.color }]}
            onPress={() => selectDifficulty(option.difficulty)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>{option.emoji}</Text>
              <Text style={[styles.cardLabel, { color: option.color }]}>
                {option.label}
              </Text>
            </View>
            <Text style={styles.cardDescription}>{option.description}</Text>
            <View style={styles.cardDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailValue}>{option.obstacles}</Text>
                <Text style={styles.detailLabel}>Obstacles</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailValue}>{option.memorizeTime}s</Text>
                <Text style={styles.detailLabel}>Memorize</Text>
              </View>
            </View>
          </TouchableOpacity>
        </GlowWrapper>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
  },
  cloudLeft: {
    position: 'absolute',
    top: 30,
    left: 10,
  },
  cloudRight: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  cloudText: {
    fontSize: 40,
    opacity: 0.6,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 18,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 16,
  },
  unicornBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  unicornEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  unicornName: {
    fontSize: 18,
    fontWeight: '600',
  },
  greenAccent: {
    width: '90%',
    height: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    marginBottom: 20,
    opacity: 0.5,
  },
  cardWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    padding: 20,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  cardLabel: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 14,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 10,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  detailLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  detailDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#DDD',
  },
});

export default CourseSelectScene;
