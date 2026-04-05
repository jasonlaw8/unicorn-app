import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';
import BarnScene from '../scenes/BarnScene';
import CrossTiesScene from '../scenes/CrossTiesScene';
import CourseSelectScene from '../scenes/CourseSelectScene';
import CourseMemorizeScene from '../scenes/CourseMemorizeScene';
import CourseRideScene from '../scenes/CourseRideScene';
import ResultsScene from '../scenes/ResultsScene';
import CareScene from '../scenes/CareScene';
import TackShopScene from '../scenes/TackShopScene';
import TrunkScene from '../scenes/TrunkScene';

const AchievementToast: React.FC = () => {
  const { state, dismissAchievement } = useGame();
  const translateY = useRef(new Animated.Value(120)).current;
  const achievement = state.newAchievement;

  useEffect(() => {
    if (achievement) {
      // Slide in
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: 120,
          duration: 300,
          useNativeDriver: true,
        }).start(() => dismissAchievement());
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(120);
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <Animated.View
      style={[styles.toast, { transform: [{ translateY }] }]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.toastInner}
        onPress={dismissAchievement}
        activeOpacity={0.9}
      >
        <Text style={styles.toastEmoji}>{achievement.emoji}</Text>
        <View style={styles.toastText}>
          <Text style={styles.toastTitle}>Achievement Unlocked!</Text>
          <Text style={styles.toastName}>{achievement.name}</Text>
          <Text style={styles.toastDesc}>{achievement.description}</Text>
        </View>
        <Text style={styles.toastPoints}>+{achievement.points}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const UnicornGame: React.FC = () => {
  const { state } = useGame();

  const renderScene = () => {
    switch (state.scene) {
      case 'barn':         return <BarnScene />;
      case 'crossTies':    return <CrossTiesScene />;
      case 'courseSelect': return <CourseSelectScene />;
      case 'courseMemorize': return <CourseMemorizeScene />;
      case 'courseRide':   return <CourseRideScene />;
      case 'results':      return <ResultsScene />;
      case 'care':         return <CareScene />;
      case 'tackShop':     return <TackShopScene />;
      case 'trunk':        return <TrunkScene />;
      default:             return <BarnScene />;
    }
  };

  return (
    <View style={styles.root}>
      {renderScene()}
      <AchievementToast />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toastInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A0F0A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    gap: 12,
  },
  toastEmoji: {
    fontSize: 36,
  },
  toastText: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D4AF37',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  toastName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 1,
  },
  toastDesc: {
    fontSize: 12,
    color: '#B0A090',
    marginTop: 2,
  },
  toastPoints: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D4AF37',
  },
});

export default UnicornGame;
