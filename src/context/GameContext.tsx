import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  UnicornColor,
  GameScene,
  GroomingStep,
  CourseDifficulty,
  JumpResult,
  JumpScore,
  UnicornStats,
  GameState,
  PlayerInventory,
  Achievement,
  AchievementId,
  ACHIEVEMENTS,
  RIBBON_DEFINITIONS,
  TACK_SHOP_ITEMS,
} from '../types';
import {
  generateCourse,
  getJumpFaults,
  calculateRideResults,
} from '../game/courseGenerator';

// ─── Constants ───────────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const clamp = (value: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, value));

const clampStats = (stats: UnicornStats): UnicornStats => ({
  hunger: clamp(stats.hunger),
  happiness: clamp(stats.happiness),
  energy: clamp(stats.energy),
  health: clamp(stats.health),
  cleanliness: clamp(stats.cleanliness),
  stallClean: clamp(stats.stallClean),
});

const computeLevel = (points: number): number =>
  Math.floor(points / 200) + 1;

// ─── Initial State ────────────────────────────────────────────────────────────

const initialInventory: PlayerInventory = {
  ownedItemIds: [],
  equippedItems: {},
  ribbons: [],
  unlockedAchievements: [],
};

const initialStats: UnicornStats = {
  hunger: 75,
  happiness: 75,
  energy: 75,
  health: 75,
  cleanliness: 75,
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
  bondLevel: 0,
  totalPoints: 0,
  shopPoints: 0,
  level: 1,
  inventory: { ...initialInventory },
  newAchievement: null,
};

// ─── Achievement Helper ───────────────────────────────────────────────────────

/**
 * Returns the first achievement from the candidate list that has not yet been
 * unlocked, or null if all are already unlocked.
 */
function pickFirstNewAchievement(
  candidates: AchievementId[],
  unlocked: AchievementId[]
): Achievement | null {
  for (const id of candidates) {
    if (!unlocked.includes(id)) {
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) return achievement;
    }
  }
  return null;
}

// ─── Context Interface ────────────────────────────────────────────────────────

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
  useTreat: (itemId: string) => void;
  purchaseItem: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  goToShop: () => void;
  goToTrunk: () => void;
  returnToBarn: () => void;
  dismissAchievement: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GameState>(initialState);

  // ── selectUnicorn ──────────────────────────────────────────────────────────

  const selectUnicorn = useCallback((color: UnicornColor) => {
    setState((prev) => ({
      ...prev,
      selectedUnicorn: color,
      scene: 'crossTies' as GameScene,
    }));
  }, []);

  // ── advanceGrooming ────────────────────────────────────────────────────────

  const advanceGrooming = useCallback(() => {
    setState((prev) => {
      const currentIndex = GROOMING_SEQUENCE.indexOf(prev.groomingStep);
      if (currentIndex < 0 || currentIndex >= GROOMING_SEQUENCE.length - 1) {
        return prev;
      }

      const nextStep = GROOMING_SEQUENCE[currentIndex + 1];
      const newTotalPoints = prev.totalPoints + 5;
      const newShopPoints = prev.shopPoints + 5;
      const newBondLevel = clamp(prev.bondLevel + 5);

      const update: Partial<GameState> = {
        groomingStep: nextStep,
        totalPoints: newTotalPoints,
        shopPoints: newShopPoints,
        bondLevel: newBondLevel,
        level: computeLevel(newTotalPoints),
      };

      if (nextStep === 'done') {
        update.scene = 'courseSelect' as GameScene;

        // Check 'clean_sweep' achievement
        const newAchievement = pickFirstNewAchievement(
          ['clean_sweep'],
          prev.inventory.unlockedAchievements
        );
        if (newAchievement) {
          update.newAchievement = newAchievement;
          update.inventory = {
            ...prev.inventory,
            unlockedAchievements: [
              ...prev.inventory.unlockedAchievements,
              newAchievement.id,
            ],
          };
          update.totalPoints = newTotalPoints + newAchievement.points;
          update.shopPoints = newShopPoints + newAchievement.points;
          update.level = computeLevel(newTotalPoints + newAchievement.points);
        }
      }

      return { ...prev, ...update };
    });
  }, []);

  // ── selectDifficulty ───────────────────────────────────────────────────────

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

  // ── startRide ──────────────────────────────────────────────────────────────

  const startRide = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scene: 'courseRide' as GameScene,
      currentObstacleIndex: 0,
    }));
  }, []);

  // ── recordJump ─────────────────────────────────────────────────────────────

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

      if (!allDone) {
        return {
          ...prev,
          jumpResults: newJumpResults,
          currentObstacleIndex: nextIndex,
        };
      }

      // ── Ride complete ──────────────────────────────────────────────────────

      const baseResults = calculateRideResults(
        newJumpResults,
        prev.courseDifficulty
      );

      // Ribbon calculation
      const scoreRatio =
        baseResults.totalScore / prev.currentCourse.perfectScore;
      // RIBBON_DEFINITIONS is already sorted place 1→8 (highest ratio first)
      const ribbon =
        RIBBON_DEFINITIONS.find((r) => scoreRatio >= r.minScoreRatio) ?? null;
      const ribbonPoints = ribbon ? ribbon.points : 0;

      const newRibbons = ribbon
        ? [
            ...prev.inventory.ribbons,
            {
              id: Date.now().toString(),
              ribbonColor: ribbon.color,
              place: ribbon.place,
              difficulty: prev.courseDifficulty,
              unicornId: prev.selectedUnicorn as UnicornColor,
              date: Date.now(),
            },
          ]
        : prev.inventory.ribbons;

      const pointsGained = baseResults.totalScore + ribbonPoints;
      const newTotalPoints = prev.totalPoints + pointsGained;
      const newShopPoints = prev.shopPoints + pointsGained;

      const rideResults = {
        ...baseResults,
        ribbon,
        ribbonPoints,
      };

      // Achievement candidates (in priority order — first unlocked wins)
      const candidates: AchievementId[] = ['first_ride'];
      if (ribbon) candidates.push('first_ribbon');
      if (ribbon?.place === 1) candidates.push('blue_ribbon');
      if (baseResults.totalFaults === 0) candidates.push('perfect_round');
      if (ribbon?.place === 1 && prev.courseDifficulty === 'hard') {
        candidates.push('champion_hard');
      }
      if (newRibbons.length >= 10) candidates.push('ribbon_collector');

      const newAchievement = pickFirstNewAchievement(
        candidates,
        prev.inventory.unlockedAchievements
      );

      const newUnlocked = newAchievement
        ? [...prev.inventory.unlockedAchievements, newAchievement.id]
        : prev.inventory.unlockedAchievements;

      const achievementPoints = newAchievement ? newAchievement.points : 0;
      const finalTotalPoints = newTotalPoints + achievementPoints;
      const finalShopPoints = newShopPoints + achievementPoints;

      return {
        ...prev,
        jumpResults: newJumpResults,
        currentObstacleIndex: nextIndex,
        rideResults,
        totalPoints: finalTotalPoints,
        shopPoints: finalShopPoints,
        level: computeLevel(finalTotalPoints),
        scene: 'results' as GameScene,
        newAchievement,
        inventory: {
          ...prev.inventory,
          ribbons: newRibbons,
          unlockedAchievements: newUnlocked,
        },
      };
    });
  }, []);

  // ── goToCare ───────────────────────────────────────────────────────────────

  const goToCare = useCallback(() => {
    setState((prev) => ({ ...prev, scene: 'care' as GameScene }));
  }, []);

  // ── feedUnicorn ────────────────────────────────────────────────────────────

  const feedUnicorn = useCallback(() => {
    setState((prev) => {
      const newTotalPoints = prev.totalPoints + 5;
      const newShopPoints = prev.shopPoints + 5;
      const newBondLevel = clamp(prev.bondLevel + 2);
      return {
        ...prev,
        stats: clampStats({
          ...prev.stats,
          hunger: prev.stats.hunger + 20,
          happiness: prev.stats.happiness + 5,
        }),
        bondLevel: newBondLevel,
        totalPoints: newTotalPoints,
        shopPoints: newShopPoints,
        level: computeLevel(newTotalPoints),
      };
    });
  }, []);

  // ── waterUnicorn ───────────────────────────────────────────────────────────

  const waterUnicorn = useCallback(() => {
    setState((prev) => {
      const newTotalPoints = prev.totalPoints + 5;
      const newShopPoints = prev.shopPoints + 5;
      const newBondLevel = clamp(prev.bondLevel + 1);
      return {
        ...prev,
        stats: clampStats({
          ...prev.stats,
          hunger: prev.stats.hunger + 15,
          health: prev.stats.health + 5,
        }),
        bondLevel: newBondLevel,
        totalPoints: newTotalPoints,
        shopPoints: newShopPoints,
        level: computeLevel(newTotalPoints),
      };
    });
  }, []);

  // ── cleanStall ─────────────────────────────────────────────────────────────

  const cleanStall = useCallback(() => {
    setState((prev) => {
      const newTotalPoints = prev.totalPoints + 10;
      const newShopPoints = prev.shopPoints + 10;
      const newBondLevel = clamp(prev.bondLevel + 1);
      return {
        ...prev,
        stats: clampStats({
          ...prev.stats,
          stallClean: prev.stats.stallClean + 30,
        }),
        bondLevel: newBondLevel,
        totalPoints: newTotalPoints,
        shopPoints: newShopPoints,
        level: computeLevel(newTotalPoints),
      };
    });
  }, []);

  // ── exerciseUnicorn ────────────────────────────────────────────────────────

  const exerciseUnicorn = useCallback(() => {
    setState((prev) => {
      const newTotalPoints = prev.totalPoints + 10;
      const newShopPoints = prev.shopPoints + 10;
      const newBondLevel = clamp(prev.bondLevel + 3);

      // Check 'devoted_rider' (>=50) and 'bond_master' (>=100) achievements
      const candidates: AchievementId[] = [];
      if (newBondLevel >= 100) candidates.push('bond_master');
      if (newBondLevel >= 50) candidates.push('devoted_rider');

      const newAchievement = pickFirstNewAchievement(
        candidates,
        prev.inventory.unlockedAchievements
      );

      const newUnlocked = newAchievement
        ? [...prev.inventory.unlockedAchievements, newAchievement.id]
        : prev.inventory.unlockedAchievements;

      const achievementPoints = newAchievement ? newAchievement.points : 0;
      const finalTotalPoints = newTotalPoints + achievementPoints;
      const finalShopPoints = newShopPoints + achievementPoints;

      return {
        ...prev,
        stats: clampStats({
          ...prev.stats,
          health: prev.stats.health + 15,
          energy: prev.stats.energy - 10,
          happiness: prev.stats.happiness + 10,
        }),
        bondLevel: newBondLevel,
        totalPoints: finalTotalPoints,
        shopPoints: finalShopPoints,
        level: computeLevel(finalTotalPoints),
        newAchievement,
        inventory: {
          ...prev.inventory,
          unlockedAchievements: newUnlocked,
        },
      };
    });
  }, []);

  // ── useTreat ───────────────────────────────────────────────────────────────

  const useTreat = useCallback((itemId: string) => {
    setState((prev) => {
      const item = TACK_SHOP_ITEMS.find(
        (i) => i.id === itemId && i.category === 'treats'
      );
      if (!item) return prev;

      const idx = prev.inventory.ownedItemIds.indexOf(itemId);
      if (idx === -1) return prev;

      // Remove the first occurrence of the treat
      const newOwned = [
        ...prev.inventory.ownedItemIds.slice(0, idx),
        ...prev.inventory.ownedItemIds.slice(idx + 1),
      ];

      const newBondLevel = clamp(prev.bondLevel + 3);

      return {
        ...prev,
        stats: clampStats({
          ...prev.stats,
          ...(item.statBoost ?? {}),
        }),
        bondLevel: newBondLevel,
        inventory: {
          ...prev.inventory,
          ownedItemIds: newOwned,
        },
      };
    });
  }, []);

  // ── purchaseItem ───────────────────────────────────────────────────────────

  const purchaseItem = useCallback((itemId: string) => {
    setState((prev) => {
      const item = TACK_SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item || prev.shopPoints < item.price) return prev;

      const newOwned = [...prev.inventory.ownedItemIds, itemId];
      const newShopPoints = prev.shopPoints - item.price;

      // Check 'shopkeeper' achievement (5+ items owned)
      const candidates: AchievementId[] = [];
      if (newOwned.length >= 5) candidates.push('shopkeeper');

      const newAchievement = pickFirstNewAchievement(
        candidates,
        prev.inventory.unlockedAchievements
      );

      const newUnlocked = newAchievement
        ? [...prev.inventory.unlockedAchievements, newAchievement.id]
        : prev.inventory.unlockedAchievements;

      const achievementPoints = newAchievement ? newAchievement.points : 0;
      const finalTotalPoints = prev.totalPoints + achievementPoints;
      const finalShopPoints = newShopPoints + achievementPoints;

      return {
        ...prev,
        shopPoints: finalShopPoints,
        totalPoints: finalTotalPoints,
        level: computeLevel(finalTotalPoints),
        newAchievement,
        inventory: {
          ...prev.inventory,
          ownedItemIds: newOwned,
          unlockedAchievements: newUnlocked,
        },
      };
    });
  }, []);

  // ── equipItem ──────────────────────────────────────────────────────────────

  const equipItem = useCallback((itemId: string) => {
    setState((prev) => {
      const item = TACK_SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item || !prev.inventory.ownedItemIds.includes(itemId)) return prev;

      type EquipSlot = 'bridle' | 'saddle' | 'boots' | 'saddlePad';
      const categoryToSlot: Partial<Record<string, EquipSlot>> = {
        bridles: 'bridle',
        saddles: 'saddle',
        boots: 'boots',
        saddlePads: 'saddlePad',
      };

      const slot = categoryToSlot[item.category];
      if (!slot) return prev;

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          equippedItems: {
            ...prev.inventory.equippedItems,
            [slot]: itemId,
          },
        },
      };
    });
  }, []);

  // ── goToShop ───────────────────────────────────────────────────────────────

  const goToShop = useCallback(() => {
    setState((prev) => ({ ...prev, scene: 'tackShop' as GameScene }));
  }, []);

  // ── goToTrunk ──────────────────────────────────────────────────────────────

  const goToTrunk = useCallback(() => {
    setState((prev) => ({ ...prev, scene: 'trunk' as GameScene }));
  }, []);

  // ── returnToBarn ───────────────────────────────────────────────────────────

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

  // ── dismissAchievement ─────────────────────────────────────────────────────

  const dismissAchievement = useCallback(() => {
    setState((prev) => ({ ...prev, newAchievement: null }));
  }, []);

  // ── Stat decay (5s interval) ───────────────────────────────────────────────

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

  // ── Provider ───────────────────────────────────────────────────────────────

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
        useTreat,
        purchaseItem,
        equipItem,
        goToShop,
        goToTrunk,
        returnToBarn,
        dismissAchievement,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useGame = (): GameContextValue => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
