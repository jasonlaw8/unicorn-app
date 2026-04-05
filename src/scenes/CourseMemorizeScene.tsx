import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { getObstacleEmoji } from '../game/courseGenerator';
import { ObstacleType } from '../types';
import GlowWrapper from '../components/GlowWrapper';

const OBSTACLE_COLORS: Record<ObstacleType, string> = {
  vertical: '#3498DB',
  oxer: '#27AE60',
  gate: '#F39C12',
  wall: '#E67E22',
  combination: '#9B59B6',
};

const CourseMemorizeScene: React.FC = () => {
  const { state, startRide } = useGame();
  const { currentCourse, courseDifficulty } = state;
  const [timeLeft, setTimeLeft] = useState(currentCourse?.timeLimit ?? 15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!currentCourse) return;

    setTimeLeft(currentCourse.timeLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          startRide();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentCourse, startRide]);

  const handleStartEarly = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startRide();
  };

  if (!currentCourse) return null;

  const timerColor =
    timeLeft <= 3 ? '#E74C3C' : timeLeft <= 6 ? '#F39C12' : '#2ECC71';

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>📋 Memorize the Course!</Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>
            {courseDifficulty?.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={[styles.timerContainer, { borderColor: timerColor }]}>
        <Text style={[styles.timerText, { color: timerColor }]}>
          {timeLeft}
        </Text>
        <Text style={styles.timerLabel}>seconds</Text>
      </View>

      <ScrollView
        style={styles.courseList}
        contentContainerStyle={styles.courseListContent}
      >
        {currentCourse.obstacles.map((obstacle, index) => {
          const obstacleColor = OBSTACLE_COLORS[obstacle.type];
          return (
            <View
              key={obstacle.id}
              style={[styles.obstacleCard, { borderLeftColor: obstacleColor }]}
            >
              <View
                style={[
                  styles.obstacleNumber,
                  { backgroundColor: obstacleColor },
                ]}
              >
                <Text style={styles.obstacleNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.obstacleEmoji}>
                {getObstacleEmoji(obstacle.type)}
              </Text>
              <View style={styles.obstacleInfo}>
                <Text style={styles.obstacleLabel}>{obstacle.label}</Text>
                <Text style={styles.obstacleHeight}>{obstacle.height}m</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.bottomSection}>
        <GlowWrapper active color="#2ECC71" style={styles.startButtonWrapper}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartEarly}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Ready! Start Ride 🏇</Text>
          </TouchableOpacity>
        </GlowWrapper>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  headerSection: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  difficultyText: {
    color: '#F5A623',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  timerContainer: {
    alignSelf: 'center',
    borderWidth: 4,
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  timerText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  timerLabel: {
    color: '#AAA',
    fontSize: 12,
  },
  courseList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  courseListContent: {
    paddingBottom: 12,
  },
  obstacleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    borderLeftWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  obstacleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  obstacleNumberText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  obstacleEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  obstacleInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  obstacleLabel: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '600',
  },
  obstacleHeight: {
    color: '#F5A623',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  startButtonWrapper: {
    width: '100%',
  },
  startButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CourseMemorizeScene;
