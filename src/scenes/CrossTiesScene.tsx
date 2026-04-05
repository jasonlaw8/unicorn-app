import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { UNICORN_DEFINITIONS, GroomingStep } from '../types';
import GlowWrapper from '../components/GlowWrapper';
import { useGame } from '../context/GameContext';

const GROOMING_STEPS: GroomingStep[] = [
  'enterStation',
  'secureTies',
  'brush',
  'pickHooves',
  'saddle',
  'bridle',
  'mount',
  'done',
];

interface StepInfo {
  getLabel: (name: string) => string;
  icon: string;
}

const STEP_CONFIG: Record<Exclude<GroomingStep, 'done'>, StepInfo> = {
  enterStation: {
    getLabel: (name) => `Bring ${name} to the cross ties`,
    icon: '🔗',
  },
  secureTies: {
    getLabel: () => 'Secure the cross ties',
    icon: '⛓️',
  },
  brush: {
    getLabel: (name) => `Brush ${name}'s coat`,
    icon: '🪥',
  },
  pickHooves: {
    getLabel: (name) => `Pick ${name}'s hooves`,
    icon: '🦶',
  },
  saddle: {
    getLabel: () => 'Place the saddle',
    icon: '🐴',
  },
  bridle: {
    getLabel: () => 'Put on the bridle',
    icon: '👑',
  },
  mount: {
    getLabel: (name) => `Mount ${name}!`,
    icon: '🏇',
  },
};

// Icons for the tools wall, in order matching GROOMING_STEPS (excluding 'done')
const TOOL_WALL_ICONS = ['🔗', '⛓️', '🪥', '🦶', '🐴', '👑', '🏇'];

const CrossTiesScene: React.FC = () => {
  const { state, advanceGrooming } = useGame();

  const unicorn = UNICORN_DEFINITIONS.find(
    (u) => u.id === state.selectedUnicorn
  );

  if (!unicorn) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No unicorn selected</Text>
      </View>
    );
  }

  const currentStep = state.groomingStep;
  const currentStepIndex = GROOMING_STEPS.indexOf(currentStep);
  const totalSteps = GROOMING_STEPS.length - 1; // exclude 'done'
  const progress = currentStepIndex / totalSteps;

  const stepConfig =
    currentStep !== 'done'
      ? STEP_CONFIG[currentStep]
      : null;

  const bondLevel: number = (state as any).bondLevel ?? 0;

  return (
    <View style={styles.container}>
      {/* ── Immersive barn environment ── */}

      {/* Left wall panel */}
      <View style={styles.wallLeft} />
      {/* Right wall panel */}
      <View style={styles.wallRight} />

      {/* Top beam */}
      <View style={styles.topBeam} />

      {/* Floor strip */}
      <View style={styles.floor} />

      {/* Cross tie ropes — left side */}
      <View style={styles.crossTieLeft} />
      {/* Cross tie ropes — right side */}
      <View style={styles.crossTieRight} />

      {/* ── Bond level indicator (top-right) ── */}
      <View style={styles.bondBadge}>
        <Text style={styles.bondText}>💖 Bond: {bondLevel}</Text>
      </View>

      {/* ── Tools wall row ── */}
      <View style={styles.toolsWallRow}>
        {TOOL_WALL_ICONS.map((icon, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isFuture = index > currentStepIndex;

          const toolCircle = (
            <View
              style={[
                styles.toolCircle,
                isCompleted && styles.toolCircleCompleted,
                isCurrent && styles.toolCircleCurrent,
                isFuture && styles.toolCircleFuture,
              ]}
            >
              <Text style={[styles.toolIcon, isFuture && styles.toolIconFuture]}>
                {icon}
              </Text>
            </View>
          );

          return isCurrent ? (
            <GlowWrapper key={index} active color="#FFD700" style={styles.toolGlow}>
              {toolCircle}
            </GlowWrapper>
          ) : (
            <View key={index} style={styles.toolGlow}>
              {toolCircle}
            </View>
          );
        })}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.unicornTitle}>{unicorn.name}</Text>
        <Text style={styles.subtitle}>Getting Ready to Ride</Text>
      </View>

      {/* Unicorn Display */}
      <View
        style={[
          styles.unicornDisplay,
          { backgroundColor: unicorn.color },
        ]}
      >
        <View style={styles.unicornDisplayInner}>
          <Text style={styles.largeEmoji}>{unicorn.emoji}</Text>
        </View>
        <View
          style={[
            styles.maneAccent,
            { backgroundColor: unicorn.maneColor },
          ]}
        />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>
          Step {Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps}
        </Text>
        <View style={styles.progressBarOuter}>
          <View
            style={[
              styles.progressBarInner,
              { width: `${Math.min(progress * 100, 100)}%` },
            ]}
          />
        </View>
        {/* Step dots */}
        <View style={styles.dotsRow}>
          {GROOMING_STEPS.slice(0, -1).map((step, index) => (
            <View
              key={step}
              style={[
                styles.dot,
                index < currentStepIndex && styles.dotCompleted,
                index === currentStepIndex && styles.dotCurrent,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Current Step Instruction */}
      {stepConfig && (
        <View style={styles.instructionSection}>
          <Text style={styles.instructionText}>
            {stepConfig.getLabel(unicorn.name)}
          </Text>
        </View>
      )}

      {/* Action Area */}
      {stepConfig && (
        <View style={styles.actionSection}>
          <GlowWrapper active color="#FFD700" style={styles.glowAction}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={advanceGrooming}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>{stepConfig.icon}</Text>
            </TouchableOpacity>
          </GlowWrapper>
          <Text style={styles.hintText}>
            Tap the glowing item to continue
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B2052',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  // ── Barn environment ──────────────────────────────────────────────────────
  wallLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 18,
    bottom: 80,
    backgroundColor: '#3D1F08',
    borderRightWidth: 3,
    borderRightColor: '#5C2E0A',
  },
  wallRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    bottom: 80,
    backgroundColor: '#3D1F08',
    borderLeftWidth: 3,
    borderLeftColor: '#5C2E0A',
  },
  topBeam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#2A1205',
    borderBottomWidth: 2,
    borderBottomColor: '#6B3A10',
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#4A2D10',
    borderTopWidth: 3,
    borderTopColor: '#6B3A10',
  },
  crossTieLeft: {
    position: 'absolute',
    // Centered vertically around the unicorn display area
    top: '42%',
    left: 18,
    width: '28%',
    height: 3,
    backgroundColor: '#8B6914',
    opacity: 0.8,
  },
  crossTieRight: {
    position: 'absolute',
    top: '42%',
    right: 18,
    width: '28%',
    height: 3,
    backgroundColor: '#8B6914',
    opacity: 0.8,
  },

  // ── Bond badge ───────────────────────────────────────────────────────────
  bondBadge: {
    position: 'absolute',
    top: 18,
    right: 24,
    backgroundColor: 'rgba(255, 20, 147, 0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 20, 147, 0.4)',
    zIndex: 10,
  },
  bondText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF69B4',
  },

  // ── Tools wall row ───────────────────────────────────────────────────────
  toolsWallRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    zIndex: 5,
  },
  toolGlow: {
    borderRadius: 22,
  },
  toolCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolCircleCompleted: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  toolCircleCurrent: {
    backgroundColor: '#3A2A10',
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  toolCircleFuture: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toolIcon: {
    fontSize: 18,
  },
  toolIconFuture: {
    opacity: 0.35,
  },

  // ── Existing styles ───────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 5,
  },
  unicornTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4A5E5',
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 100,
  },
  unicornDisplay: {
    alignSelf: 'center',
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
    zIndex: 5,
  },
  unicornDisplayInner: {
    zIndex: 1,
  },
  largeEmoji: {
    fontSize: 100,
  },
  maneAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    opacity: 0.5,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  progressSection: {
    marginBottom: 24,
    alignItems: 'center',
    zIndex: 5,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D4A5E5',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressBarOuter: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotCompleted: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  dotCurrent: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  instructionSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    zIndex: 5,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    zIndex: 5,
  },
  glowAction: {
    borderRadius: 60,
    marginBottom: 16,
  },
  actionButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5C3A1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  actionIcon: {
    fontSize: 50,
  },
  hintText: {
    fontSize: 14,
    color: 'rgba(212, 165, 229, 0.8)',
    fontStyle: 'italic',
  },
});

export default CrossTiesScene;
