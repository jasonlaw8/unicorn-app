import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  UnicornColor,
  GameScene,
  GroomingStep,
  CourseDifficulty,
  JumpResult,
  JumpScore,
  RideResults,
  UnicornStats,
  CourseDefinition,
  GameState,
} from '../types';
import {
  generateCourse,
  getJumpFaults,
  calculateRideResults,
} from '../game/courseGenerator';

const GROOMING_SEQUENCE: GroomingStep[] = [
  'enterStation',
  'secureTies',
  'brush',
  'pickHooves',
  'saddle',
  'bridle',
  'mount',
  'done',
];

const clamp = (value: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, value));

const initialStats: UnicornStats = {
  hunger: 75,
  happiness: 75,
  energy: 80,
  health: 80,
  cleanliness: 70,
  stallClean: 70,
};

const initialState: GameState = {
  scene: 'barn',
  selectedUnicorn: null,
  groomingStep: 'enterStation',
  courseDifficulty: null,
  currentCourse: null,
  currentObstacleIndex: 0,
  jumpResults: [],
  rideResults: null,
  stats: { ...initialStats },
  totalPoints: 0,
  level: 1,
};

interface GameContextValue {
  state: GameState;
  selectUnicorn: (color: UnicornColor) => void;
  advanceGrooming: () => void;
  selectDifficulty: (d: CourseDifficulty) => void;
  startRide: () => void;
  recordJump: (result: JumpResult) => void;
  goToCare: () => void;
  feedUnicorn: () => void;
  waterUnicorn: () => void;
  cleanStall: () => void;
  exerciseUnicorn: () => void;
  returnToBarn: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GameState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const computeLevel = (points: number): number =>
    Math.floor(points / 200) + 1;

  const clampStats = (stats: UnicornStats): UnicornStats => ({
    hunger: clamp(stats.hunger),
    happiness: clamp(stats.happiness),
    energy: clamp(stats.energy),
    health: clamp(stats.health),
    cleanliness: clamp(stats.cleanliness),
    stallClean: clamp(stats.stallClean),
  });

  const selectUnicorn = useCallback((color: UnicornColor) => {
    setState((prev) => ({
      ...prev,
      selectedUnicorn: color,
      scene: 'crossTies' as GameScene,
    }));
  }, []);

  const advanceGrooming = useCallback(() => {
    setState((prev) => {
      const currentIndex = GROOMING_SEQUENCE.indexOf(prev.groomingStep);
      if (currentIndex < 0 || currentIndex >= GROOMING_SEQUENCE.length - 1) {
        return prev;
      }
      const nextStep = GROOMING_SEQUENCE[currentIndex + 1];
      const newPoints = prev.totalPoints + 5;
      const update: Partial<GameState> = {
        groomingStep: nextStep,
        totalPoints: newPoints,
        level: computeLevel(newPoints),
      };
      if (nextStep === 'done') {
        update.scene = 'courseSelect';
      }
      return { ...prev, ...update };
    });
  }, []);

  const selectDifficulty = useCallback((d: CourseDifficulty) => {
    const course = generateCourse(d);
    setState((prev) => ({
      ...prev,
      courseDifficulty: d,
      currentCourse: course,
      jumpResults: [],
      rideResults: null,
      currentObstacleIndex: 0,
      scene: 'courseMemorize' as GameScene,
    }));
  }, []);

  const startRide = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scene: 'courseRide' as GameScene,
      currentObstacleIndex: 0,
    }));
  }, []);

  const recordJump = useCallback((result: JumpResult) => {
    setState((prev) => {
      if (!prev.currentCourse || !prev.courseDifficulty) return prev;

      const faults = getJumpFaults(result);
      const jumpScore: JumpScore = {
        obstacleId: prev.currentObstacleIndex,
        result,
        faults,
      };
      const newJumpResults = [...prev.jumpResults, jumpScore];
      const nextIndex = prev.currentObstacleIndex + 1;
      const allDone = nextIndex >= prev.currentCourse.obstacles.length;

      if (allDone) {
        const rideResults = calculateRideResults(
          newJumpResults,
          prev.courseDifficulty
        );
        const newPoints = prev.totalPoints + rideResults.totalScore;
        return {
          ...prev,
          jumpResults: newJumpResults,
          currentObstacleIndex: nextIndex,
          rideResults,
          totalPoints: newPoints,
          level: computeLevel(newPoints),
          scene: 'results' as GameScene,
        };
      }

      return {
        ...prev,
        jumpResults: newJumpResults,
        currentObstacleIndex: nextIndex,
      };
    });
  }, []);

  const goToCare = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scene: 'care' as GameScene,
    }));
  }, []);

  const feedUnicorn = useCallback(() => {
    setState((prev) => {
      const newPoints = prev.totalPoints + 5;
      return {
        ...prev,
        stats: clampStats({
          ...prev.stats,
          hunger: prev.stats.hunger + 20,
          happiness: prev.stats.happiness + 5,
        }),
        totalPoints: newPoints,
        level: computeLevel(newPoints),
      };
    });
  }, []);

  const waterUnicorn = useCallback(() => {
    setState((prev) => {
      const newPoints = prev.totalPoints + 5;
      return {
        ...prev,
        stats: clampStats({
          ...prev.stats,
          hunger: prev.stats.hunger + 15,
          health: prev.stats.health + 5,
        }),
        totalPoints: newPoints,
        level: computeLevel(newPoints),
      };
    });
  }, []);

  const cleanStall = useCallback(() => {
    setState((prev) => {
      const newPoints = prev.totalPoints + 10;
      return {
        ...prev,
        stats: clampStats({
          ...prev.stats,
          stallClean: prev.stats.stallClean + 30,
        }),
        totalPoints: newPoints,
        level: computeLevel(newPoints),
      };
    });
  }, []);

  const exerciseUnicorn = useCallback(() => {
    setState((prev) => {
      const newPoints = prev.totalPoints + 10;
      return {
        ...prev,
        stats: clampStats({
          ...prev.stats,
          health: prev.stats.health + 15,
          energy: prev.stats.energy - 10,
          happiness: prev.stats.happiness + 10,
        }),
        totalPoints: newPoints,
        level: computeLevel(newPoints),
      };
    });
  }, []);

  const returnToBarn = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scene: 'barn' as GameScene,
      groomingStep: 'enterStation' as GroomingStep,
      courseDifficulty: null,
      currentCourse: null,
      currentObstacleIndex: 0,
      jumpResults: [],
      rideResults: null,
    }));
  }, []);

  // Stat decay every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        stats: clampStats({
          ...prev.stats,
          hunger: prev.stats.hunger - 1,
          happiness: prev.stats.happiness - 1,
          energy: prev.stats.energy - 0.5,
          cleanliness: prev.stats.cleanliness - 0.5,
          stallClean: prev.stats.stallClean - 0.5,
        }),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        selectUnicorn,
        advanceGrooming,
        selectDifficulty,
        startRide,
        recordJump,
        goToCare,
        feedUnicorn,
        waterUnicorn,
        cleanStall,
        exerciseUnicorn,
        returnToBarn,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextValue => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
