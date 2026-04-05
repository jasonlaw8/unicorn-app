import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';
import { UNICORN_DEFINITIONS, RIBBON_DEFINITIONS } from '../types';
import { getObstacleEmoji } from '../game/courseGenerator';
import GlowWrapper from '../components/GlowWrapper';

const RESULT_DISPLAY: Record<string, { emoji: string; label: string }> = {
  perfect: { emoji: '✨', label: 'Perfect' },
  rail: { emoji: '💥', label: 'Rail Down' },
  refusal: { emoji: '🚫', label: 'Refusal' },
  missed: { emoji: '❌', label: 'Missed' },
};

// Derive an accent color from ribbon color for dynamic theming
function getRibbonAccent(hex: string | null): { primary: string; secondary: string; bg: string } {
  if (!hex) {
    return { primary: '#808080', secondary: '#A0A0A0', bg: '#2A2A2A' };
  }
  // Use the ribbon hex as primary, lighten for secondary, darken for bg
  return { primary: hex, secondary: hex + 'CC', bg: hex + '22' };
}

const ResultsScene: React.FC = () => {
  const { state, returnToBarn, goToCare, goToShop } = useGame();

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

  const ribbon = results.ribbon;
  const accent = getRibbonAccent(ribbon?.hex ?? null);
  const hasRibbon = ribbon !== null;

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: '#0F0F1E' }]}
      contentContainerStyle={styles.container}
    >
      {/* Ribbon Hero */}
      <View style={[styles.heroSection, { backgroundColor: accent.bg, borderColor: accent.primary }]}>
        {/* Big rosette circle */}
        <View
          style={[
            styles.ribbonCircle,
            {
              backgroundColor: hasRibbon ? accent.primary : '#3A3A3A',
              borderColor: hasRibbon ? accent.secondary : '#555',
              shadowColor: hasRibbon ? accent.primary : '#000',
            },
          ]}
        >
          <Text style={styles.ribbonPlaceNumber}>
            {hasRibbon ? String(ribbon!.place) : '—'}
          </Text>
        </View>

        {/* Ribbon label */}
        <Text style={[styles.ribbonLabel, { color: hasRibbon ? accent.primary : '#888' }]}>
          {hasRibbon ? ribbon!.label : 'No Ribbon'}
        </Text>

        {/* Subtitle */}
        <Text style={styles.ribbonSubtitle}>
          {hasRibbon ? '🎀 Ribbon earned!' : 'Keep Practicing!'}
        </Text>

        {/* Unicorn name */}
        <Text style={styles.unicornName}>
          {unicorn?.emoji ?? '🦄'}  {unicorn?.name ?? 'Your Unicorn'}
        </Text>
      </View>

      {/* Score Section */}
      <View style={[styles.scoreSection, { borderColor: accent.primary + '66' }]}>
        <Text style={[styles.scoreMainText, { color: accent.primary === '#808080' ? '#AAA' : accent.primary }]}>
          {results.totalScore} / {course.perfectScore}
        </Text>

        <View style={styles.scoreDetailsRow}>
          <View style={styles.scoreDetailItem}>
            <Text style={styles.scoreDetailValue}>{results.totalFaults}</Text>
            <Text style={styles.scoreDetailLabel}>faults</Text>
          </View>
          <View style={styles.scoreDetailDivider} />
          <View style={styles.scoreDetailItem}>
            <Text style={[styles.scoreDetailValue, styles.bonusText]}>+{results.bonusPoints}</Text>
            <Text style={styles.scoreDetailLabel}>bonus</Text>
          </View>
          <View style={styles.scoreDetailDivider} />
          <View style={styles.scoreDetailItem}>
            <Text style={[styles.scoreDetailValue, styles.ribbonBonusText]}>
              +{results.ribbonPoints}
            </Text>
            <Text style={styles.scoreDetailLabel}>ribbon pts</Text>
          </View>
        </View>

        {/* Score bar */}
        <View style={styles.scoreBarBg}>
          <View
            style={[
              styles.scoreBarFill,
              {
                width: `${Math.min((results.totalScore / course.perfectScore) * 100, 100)}%`,
                backgroundColor: hasRibbon ? accent.primary : '#555',
              },
            ]}
          />
        </View>
      </View>

      {/* Jump Breakdown */}
      <View style={styles.breakdownContainer}>
        <Text style={[styles.sectionTitle, { color: accent.primary === '#808080' ? '#AAA' : accent.primary }]}>
          Jump Breakdown
        </Text>
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

      {/* Points Summary */}
      <View style={[styles.totalPointsContainer, { borderColor: accent.primary }]}>
        <View style={styles.pointsRow}>
          <View style={styles.pointsItem}>
            <Text style={styles.pointsItemLabel}>Points This Ride</Text>
            <Text style={[styles.pointsItemValue, { color: accent.primary === '#808080' ? '#AAA' : accent.primary }]}>
              +{results.totalScore + results.bonusPoints + results.ribbonPoints}
            </Text>
          </View>
          <View style={styles.pointsDivider} />
          <View style={styles.pointsItem}>
            <Text style={styles.pointsItemLabel}>Total Points</Text>
            <Text style={styles.pointsTotal}>🏆 {state.totalPoints}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsColumn}>
        <GlowWrapper active={true} color={hasRibbon ? accent.primary : '#FFD700'} style={styles.fullWidth}>
          <TouchableOpacity
            style={[styles.barnButton, { backgroundColor: hasRibbon ? accent.primary + 'CC' : '#5E2D82' }]}
            onPress={returnToBarn}
          >
            <Text style={styles.barnButtonText}>🏠 Return to Barn</Text>
          </TouchableOpacity>
        </GlowWrapper>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.shopButton} onPress={goToShop}>
            <Text style={styles.shopButtonText}>🛍️ Spend Points</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.careButton} onPress={goToCare}>
            <Text style={styles.careButtonText}>🧹 Care for Unicorn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 48,
    alignItems: 'center',
  },
  errorText: {
    color: '#FFF',
    fontSize: 18,
    marginTop: 40,
    textAlign: 'center',
  },

  // Hero
  heroSection: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 2,
    marginBottom: 20,
  },
  ribbonCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 14,
    marginBottom: 14,
  },
  ribbonPlaceNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    lineHeight: 90,
  },
  ribbonLabel: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ribbonSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D0D0E0',
    marginTop: 4,
    marginBottom: 12,
  },
  unicornName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8E0FF',
    marginTop: 4,
  },

  // Score
  scoreSection: {
    width: '100%',
    backgroundColor: '#1E1E32',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  scoreMainText: {
    fontSize: 44,
    fontWeight: '900',
    marginBottom: 16,
  },
  scoreDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
  },
  scoreDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  scoreDetailValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF6B6B',
  },
  bonusText: {
    color: '#4CAF50',
  },
  ribbonBonusText: {
    color: '#FFD700',
  },
  scoreDetailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8080A0',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  scoreDetailDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#3A3A5A',
  },
  scoreBarBg: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2A2A4A',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 5,
  },

  // Jump Breakdown
  breakdownContainer: {
    width: '100%',
    backgroundColor: '#1E1E32',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  jumpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A42',
  },
  jumpRowPerfect: {
    backgroundColor: 'rgba(255, 215, 0, 0.07)',
    borderRadius: 8,
  },
  jumpNumber: {
    width: 22,
    fontSize: 13,
    fontWeight: '700',
    color: '#6060A0',
  },
  jumpObstacle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#D0D0F0',
  },
  jumpResult: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B0B0D0',
    marginRight: 8,
  },
  jumpFaults: {
    width: 28,
    fontSize: 15,
    fontWeight: '800',
    color: '#FF6B6B',
    textAlign: 'right',
  },
  jumpFaultsZero: {
    color: '#4CAF50',
  },

  // Points
  totalPointsContainer: {
    width: '100%',
    backgroundColor: '#1E1E32',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 2,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsItem: {
    flex: 1,
    alignItems: 'center',
  },
  pointsItemLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8080A0',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  pointsItemValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  pointsTotal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFD700',
  },
  pointsDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#3A3A5A',
    marginHorizontal: 12,
  },

  // Buttons
  actionsColumn: {
    width: '100%',
    gap: 12,
  },
  fullWidth: {
    width: '100%',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  barnButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
  },
  barnButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  },
  shopButton: {
    flex: 1,
    backgroundColor: '#1A4A6E',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A7AB8',
  },
  shopButtonText: {
    color: '#7EC8F0',
    fontSize: 15,
    fontWeight: '800',
  },
  careButton: {
    flex: 1,
    backgroundColor: '#2A1A0A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B6914',
  },
  careButtonText: {
    color: '#C8A040',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default ResultsScene;
