import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';
import { UNICORN_DEFINITIONS } from '../types';
import { getObstacleEmoji } from '../game/courseGenerator';
import GlowWrapper from '../components/GlowWrapper';

const RESULT_DISPLAY: Record<string, { emoji: string; label: string }> = {
  perfect: { emoji: '✨', label: 'Perfect' },
  rail: { emoji: '💥', label: 'Rail Down' },
  refusal: { emoji: '🚫', label: 'Refusal' },
  missed: { emoji: '❌', label: 'Missed' },
};

const ResultsScene: React.FC = () => {
  const { state, returnToBarn, goToCare } = useGame();

  const unicorn = UNICORN_DEFINITIONS.find((u) => u.id === state.selectedUnicorn);
  const results = state.rideResults;
  const course = state.currentCourse;

  if (!results || !course) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No results available</Text>
        <TouchableOpacity style={styles.barnButton} onPress={returnToBarn}>
          <Text style={styles.barnButtonText}>Return to Barn</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const scoreRatio = results.totalScore / course.perfectScore;

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      {/* Grade Banner */}
      <View style={styles.gradeBanner}>
        <Text style={styles.gradeText}>{results.grade}</Text>
        <Text style={styles.unicornName}>
          {unicorn?.emoji ?? '🦄'} {unicorn?.name ?? 'Your Unicorn'}
        </Text>
      </View>

      {/* Score Circle */}
      <View style={styles.scoreCircle}>
        <Text style={styles.scoreNumber}>{results.totalScore}</Text>
        <Text style={styles.scoreDivider}>/ {course.perfectScore}</Text>
        <Text style={styles.scoreLabel}>points</Text>
      </View>

      {/* Score Bar */}
      <View style={styles.scoreBarContainer}>
        <View style={styles.scoreBarBg}>
          <View
            style={[
              styles.scoreBarFill,
              {
                width: `${Math.min(scoreRatio * 100, 100)}%`,
                backgroundColor:
                  scoreRatio >= 0.85
                    ? '#FFD700'
                    : scoreRatio >= 0.6
                      ? '#4CAF50'
                      : '#FF8C42',
              },
            ]}
          />
        </View>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{results.totalFaults}</Text>
          <Text style={styles.summaryLabel}>Total Faults</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>+{results.bonusPoints}</Text>
          <Text style={styles.summaryLabel}>Bonus Points</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{state.level}</Text>
          <Text style={styles.summaryLabel}>Level</Text>
        </View>
      </View>

      {/* Jump Breakdown */}
      <View style={styles.breakdownContainer}>
        <Text style={styles.sectionTitle}>Jump Breakdown</Text>
        {results.jumps.map((jump, index) => {
          const obstacle = course.obstacles[index];
          const display = RESULT_DISPLAY[jump.result] ?? RESULT_DISPLAY.missed;
          return (
            <View
              key={jump.obstacleId}
              style={[
                styles.jumpRow,
                jump.result === 'perfect' && styles.jumpRowPerfect,
              ]}
            >
              <Text style={styles.jumpNumber}>{index + 1}</Text>
              <Text style={styles.jumpObstacle}>
                {obstacle ? getObstacleEmoji(obstacle.type) : '🏗️'}{' '}
                {obstacle?.label ?? `Jump ${index + 1}`}
              </Text>
              <Text style={styles.jumpResult}>
                {display.emoji} {display.label}
              </Text>
              <Text
                style={[
                  styles.jumpFaults,
                  jump.faults === 0 && styles.jumpFaultsZero,
                ]}
              >
                {jump.faults}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Total Points */}
      <View style={styles.totalPointsContainer}>
        <Text style={styles.totalPointsLabel}>Total Points Earned</Text>
        <Text style={styles.totalPointsValue}>
          🏆 {state.totalPoints} points
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <GlowWrapper active={true} color="#FFD700" style={styles.actionWrapper}>
          <TouchableOpacity style={styles.barnButton} onPress={returnToBarn}>
            <Text style={styles.barnButtonText}>🏠 Return to Barn</Text>
          </TouchableOpacity>
        </GlowWrapper>

        <TouchableOpacity style={styles.careButton} onPress={goToCare}>
          <Text style={styles.careButtonText}>🧹 Care for Unicorn</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  errorText: {
    color: '#FFF',
    fontSize: 18,
    marginTop: 40,
    textAlign: 'center',
  },
  gradeBanner: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  gradeText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  unicornName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0D0FF',
    marginTop: 4,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#2A2A4A',
    borderWidth: 4,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  scoreNumber: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFD700',
  },
  scoreDivider: {
    fontSize: 16,
    color: '#A0A0C0',
    fontWeight: '600',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#8080A0',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  scoreBarContainer: {
    width: '90%',
    marginBottom: 20,
  },
  scoreBarBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3A3A5A',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#2A2A4A',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFD700',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#A0A0C0',
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  breakdownContainer: {
    width: '100%',
    backgroundColor: '#2A2A4A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 12,
  },
  jumpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A5A',
  },
  jumpRowPerfect: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 8,
  },
  jumpNumber: {
    width: 24,
    fontSize: 14,
    fontWeight: '700',
    color: '#8080A0',
  },
  jumpObstacle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#E0E0FF',
  },
  jumpResult: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C0C0E0',
    marginRight: 8,
  },
  jumpFaults: {
    width: 30,
    fontSize: 16,
    fontWeight: '800',
    color: '#FF6B6B',
    textAlign: 'right',
  },
  jumpFaultsZero: {
    color: '#4CAF50',
  },
  totalPointsContainer: {
    width: '100%',
    backgroundColor: '#2A2A4A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  totalPointsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A0A0C0',
    textTransform: 'uppercase',
  },
  totalPointsValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD700',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  actionWrapper: {
    flex: 1,
  },
  barnButton: {
    backgroundColor: '#5E2D82',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  barnButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  careButton: {
    flex: 1,
    backgroundColor: '#8B6914',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  careButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default ResultsScene;
