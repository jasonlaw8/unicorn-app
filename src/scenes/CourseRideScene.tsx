import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useGame } from '../context/GameContext';
import {
  calculateJumpResult,
  getObstacleEmoji,
} from '../game/courseGenerator';
import { UNICORN_DEFINITIONS, JumpResult } from '../types';
import GlowWrapper from '../components/GlowWrapper';

const APPROACH_DURATION = 3000;
const RESULT_DISPLAY_MS = 800;

const RESULT_DISPLAY: Record<JumpResult, { text: string; color: string }> = {
  perfect: { text: 'Perfect! ✨', color: '#2ECC71' },
  rail: { text: 'Rail down! 💥', color: '#F39C12' },
  refusal: { text: 'Refusal! 🚫', color: '#E67E22' },
  missed: { text: 'Missed! ❌', color: '#E74C3C' },
};

const CourseRideScene: React.FC = () => {
  const { state, recordJump } = useGame();
  const { currentCourse, currentObstacleIndex, selectedUnicorn } = state;

  const unicorn = UNICORN_DEFINITIONS.find((u) => u.id === selectedUnicorn);

  const approachAnim = useRef(new Animated.Value(0)).current;
  const approachValueRef = useRef(0);
  const [resultFlash, setResultFlash] = useState<JumpResult | null>(null);
  const [jumped, setJumped] = useState(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const obstacle =
    currentCourse && currentObstacleIndex < currentCourse.obstacles.length
      ? currentCourse.obstacles[currentObstacleIndex]
      : null;

  const totalObstacles = currentCourse?.obstacles.length ?? 0;

  const startApproach = useCallback(() => {
    approachAnim.setValue(0);
    approachValueRef.current = 0;
    setJumped(false);
    setResultFlash(null);

    const listenerId = approachAnim.addListener(({ value }) => {
      approachValueRef.current = value;
    });

    const animation = Animated.timing(approachAnim, {
      toValue: 1,
      duration: APPROACH_DURATION,
      useNativeDriver: false,
    });

    animationRef.current = animation;
    animation.start(({ finished }) => {
      approachAnim.removeListener(listenerId);
      if (finished && !jumped) {
        // Ran out of time - missed
        setJumped(true);
        setResultFlash('missed');
        recordJump('missed');
      }
    });

    return () => {
      approachAnim.removeListener(listenerId);
      animation.stop();
    };
  }, [approachAnim, recordJump, jumped]);

  useEffect(() => {
    if (!obstacle) return;
    const cleanup = startApproach();
    return cleanup;
    // We only want to restart when the obstacle index changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentObstacleIndex, obstacle?.id]);

  // Clear result flash after delay
  useEffect(() => {
    if (resultFlash === null) return;
    const timeout = setTimeout(() => {
      setResultFlash(null);
    }, RESULT_DISPLAY_MS);
    return () => clearTimeout(timeout);
  }, [resultFlash]);

  const handleJump = () => {
    if (jumped || !obstacle) return;
    setJumped(true);

    if (animationRef.current) {
      animationRef.current.stop();
    }

    const currentValue = approachValueRef.current;
    const rawAccuracy = 1 - Math.abs(0.75 - currentValue) * 4;
    const timingAccuracy = Math.max(0, Math.min(1, rawAccuracy));

    const result = calculateJumpResult(timingAccuracy, obstacle.height);
    setResultFlash(result);
    recordJump(result);
  };

  if (!currentCourse || !obstacle) return null;

  const barWidth = approachAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const barColor = approachAnim.interpolate({
    inputRange: [0, 0.55, 0.65, 0.75, 0.85, 0.95, 1],
    outputRange: [
      '#3498DB',
      '#3498DB',
      '#2ECC71',
      '#FFD700',
      '#2ECC71',
      '#E74C3C',
      '#E74C3C',
    ],
  });

  return (
    <View style={styles.container}>
      {/* Obstacle info header */}
      <View style={styles.obstacleHeader}>
        <Text style={styles.obstacleCount}>
          Jump {currentObstacleIndex + 1} of {totalObstacles}
        </Text>
        <Text style={styles.obstacleLabel}>
          {getObstacleEmoji(obstacle.type)} {obstacle.label}
        </Text>
        <Text style={styles.obstacleHeight}>Height: {obstacle.height}m</Text>
      </View>

      {/* Arena area */}
      <View style={styles.arena}>
        {/* Sky */}
        <View style={styles.sky} />

        {/* Course ground */}
        <View style={styles.ground}>
          {/* Fence rail decorations */}
          <View style={styles.fenceRail} />
          <View style={[styles.fenceRail, styles.fenceRailBottom]} />

          {/* Unicorn and obstacle display */}
          <View style={styles.courseTrack}>
            <Animated.View
              style={[
                styles.unicornContainer,
                {
                  left: barWidth,
                },
              ]}
            >
              <Text style={styles.unicornEmoji}>
                {unicorn?.emoji ?? '🦄'}
              </Text>
            </Animated.View>

            <View style={styles.obstacleContainer}>
              <Text style={styles.obstacleEmoji}>
                {getObstacleEmoji(obstacle.type)}
              </Text>
            </View>
          </View>

          {/* Approach bar */}
          <View style={styles.approachBarContainer}>
            <View style={styles.approachBarTrack}>
              {/* Perfect zone indicator */}
              <View style={styles.perfectZone} />
              <Animated.View
                style={[
                  styles.approachBarFill,
                  {
                    width: barWidth,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </View>
            <View style={styles.approachBarLabels}>
              <Text style={styles.approachLabel}>Start</Text>
              <Text style={styles.perfectLabel}>Sweet Spot</Text>
              <Text style={styles.approachLabel}>End</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Result flash overlay */}
      {resultFlash && (
        <View style={styles.resultOverlay}>
          <Text
            style={[
              styles.resultText,
              { color: RESULT_DISPLAY[resultFlash].color },
            ]}
          >
            {RESULT_DISPLAY[resultFlash].text}
          </Text>
        </View>
      )}

      {/* Jump button */}
      <View style={styles.bottomSection}>
        <GlowWrapper
          active={!jumped}
          color="#FFD700"
          style={styles.jumpButtonWrapper}
        >
          <TouchableOpacity
            style={[styles.jumpButton, jumped && styles.jumpButtonDisabled]}
            onPress={handleJump}
            activeOpacity={0.7}
            disabled={jumped}
          >
            <Text style={styles.jumpButtonText}>JUMP! 🏇</Text>
          </TouchableOpacity>
        </GlowWrapper>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2838',
  },
  obstacleHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  obstacleCount: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  obstacleLabel: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  obstacleHeight: {
    color: '#F5A623',
    fontSize: 16,
    fontWeight: '600',
  },
  arena: {
    flex: 1,
  },
  sky: {
    flex: 1,
    backgroundColor: '#2C3E6B',
  },
  ground: {
    flex: 2,
    backgroundColor: '#2D5A27',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  fenceRail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.4,
  },
  fenceRailBottom: {
    top: undefined,
    bottom: 0,
  },
  courseTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    marginBottom: 20,
    position: 'relative',
  },
  unicornContainer: {
    position: 'absolute',
    top: 10,
    marginLeft: -20,
  },
  unicornEmoji: {
    fontSize: 40,
  },
  obstacleContainer: {
    position: 'absolute',
    right: 40,
    top: 10,
  },
  obstacleEmoji: {
    fontSize: 40,
  },
  approachBarContainer: {
    marginHorizontal: 8,
  },
  approachBarTrack: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  perfectZone: {
    position: 'absolute',
    left: '65%',
    width: '20%',
    height: '100%',
    backgroundColor: 'rgba(46, 204, 113, 0.25)',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(46, 204, 113, 0.5)',
  },
  approachBarFill: {
    height: '100%',
    borderRadius: 12,
  },
  approachBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  approachLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
  },
  perfectLabel: {
    color: '#2ECC71',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: '15%',
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  resultText: {
    fontSize: 42,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  jumpButtonWrapper: {
    width: '100%',
  },
  jumpButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
  },
  jumpButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  jumpButtonText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default CourseRideScene;
