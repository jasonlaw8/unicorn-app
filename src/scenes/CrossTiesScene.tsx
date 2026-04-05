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

  return (
    <View style={styles.container}>
      {/* Background accents */}
      <View style={styles.bgAccent1} />
      <View style={styles.bgAccent2} />

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
  bgAccent1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#4A2866',
    opacity: 0.6,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  bgAccent2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: '#5C3A1E',
    opacity: 0.3,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
