// ─── Unicorn Definitions ────────────────────────────────────────────────────

export type UnicornColor =
  | 'purple'
  | 'pink'
  | 'babyBlue'
  | 'navyBlue'
  | 'orange'
  | 'mint'
  | 'yellow'
  | 'red'
  | 'white'
  | 'rainbow';

export interface UnicornDefinition {
  id: UnicornColor;
  name: string;
  color: string;
  maneColor: string;
  emoji: string;
}

export const UNICORN_DEFINITIONS: UnicornDefinition[] = [
  { id: 'purple',   name: 'Violet Star',    color: '#9B59B6', maneColor: '#D4A5E5', emoji: '🦄' },
  { id: 'pink',     name: 'Rose Sparkle',   color: '#FF69B4', maneColor: '#FFB6D9', emoji: '🦄' },
  { id: 'babyBlue', name: 'Sky Dancer',     color: '#87CEEB', maneColor: '#B0E0E6', emoji: '🦄' },
  { id: 'navyBlue', name: 'Midnight Storm', color: '#2C3E6B', maneColor: '#5B7FBF', emoji: '🦄' },
  { id: 'orange',   name: 'Sunset Blaze',   color: '#FF8C42', maneColor: '#FFB380', emoji: '🦄' },
  { id: 'mint',     name: 'Minty Dream',    color: '#98E8C1', maneColor: '#C5F5DC', emoji: '🦄' },
  { id: 'yellow',   name: 'Golden Ray',     color: '#FFD700', maneColor: '#FFF3B0', emoji: '🦄' },
  { id: 'red',      name: 'Crimson Flame',  color: '#E74C3C', maneColor: '#F5A8A1', emoji: '🦄' },
  { id: 'white',    name: 'Pearl Grace',    color: '#F8F8FF', maneColor: '#E8E0F0', emoji: '🦄' },
  { id: 'rainbow',  name: 'Prisma Magic',   color: '#FF6B6B', maneColor: '#4ECDC4', emoji: '🦄' },
];

// ─── Ribbon System ───────────────────────────────────────────────────────────

export type RibbonColor =
  | 'blue'      // 1st
  | 'red'       // 2nd
  | 'yellow'    // 3rd
  | 'white'     // 4th
  | 'pink'      // 5th
  | 'green'     // 6th
  | 'purple'    // 7th
  | 'brown';    // 8th

export interface RibbonDefinition {
  place: number;
  color: RibbonColor;
  hex: string;
  label: string;
  points: number;       // bonus points awarded for this placement
  minScoreRatio: number; // minimum score/perfectScore to qualify
}

export const RIBBON_DEFINITIONS: RibbonDefinition[] = [
  { place: 1, color: 'blue',   hex: '#1565C0', label: '1st Place',  points: 100, minScoreRatio: 0.95 },
  { place: 2, color: 'red',    hex: '#C62828', label: '2nd Place',  points: 80,  minScoreRatio: 0.85 },
  { place: 3, color: 'yellow', hex: '#F9A825', label: '3rd Place',  points: 60,  minScoreRatio: 0.75 },
  { place: 4, color: 'white',  hex: '#EEEEEE', label: '4th Place',  points: 40,  minScoreRatio: 0.65 },
  { place: 5, color: 'pink',   hex: '#F06292', label: '5th Place',  points: 25,  minScoreRatio: 0.55 },
  { place: 6, color: 'green',  hex: '#388E3C', label: '6th Place',  points: 15,  minScoreRatio: 0.45 },
  { place: 7, color: 'purple', hex: '#6A1B9A', label: '7th Place',  points: 10,  minScoreRatio: 0.35 },
  { place: 8, color: 'brown',  hex: '#795548', label: '8th Place',  points: 5,   minScoreRatio: 0.00 },
];

export interface RibbonEarned {
  id: string;               // unique ID
  ribbonColor: RibbonColor;
  place: number;
  difficulty: CourseDifficulty;
  unicornId: UnicornColor;
  date: number;             // timestamp
}

// ─── Tack Shop ───────────────────────────────────────────────────────────────

export type TackCategory =
  | 'bridles'
  | 'saddles'
  | 'boots'
  | 'saddlePads'
  | 'careEquipment'
  | 'treats';

export interface TackShopItem {
  id: string;
  name: string;
  category: TackCategory;
  price: number;            // in game points
  description: string;
  emoji: string;
  effect: string;           // human-readable effect description
  statBoost?: Partial<UnicornStats>;       // optional stat boost on use/equip
  performanceBonus?: number; // 0-10, added to score multiplier
}

export const TACK_SHOP_ITEMS: TackShopItem[] = [
  // Bridles
  {
    id: 'fancy_bridle',
    name: 'Crystal Bridle',
    category: 'bridles',
    price: 300,
    description: 'A sparkling bridle fit for a champion unicorn.',
    emoji: '👑',
    effect: '+5 happiness per grooming session',
    statBoost: { happiness: 5 },
  },
  {
    id: 'show_bridle',
    name: 'Show Bridle',
    category: 'bridles',
    price: 150,
    description: 'Classic leather show bridle. Judges love it.',
    emoji: '🎀',
    effect: '+3 points per jump',
    performanceBonus: 3,
  },
  // Saddles
  {
    id: 'leather_saddle',
    name: 'Premium Saddle',
    category: 'saddles',
    price: 500,
    description: 'Hand-stitched leather saddle for peak performance.',
    emoji: '🐴',
    effect: '+8% performance bonus on all courses',
    performanceBonus: 8,
  },
  {
    id: 'cloud_saddle',
    name: 'Cloud Saddle',
    category: 'saddles',
    price: 350,
    description: 'So light it feels like riding on a cloud.',
    emoji: '☁️',
    effect: '+5% performance bonus',
    performanceBonus: 5,
  },
  // Boots
  {
    id: 'show_boots',
    name: 'Show Boots',
    category: 'boots',
    price: 200,
    description: 'Tall black boots that command the arena.',
    emoji: '👢',
    effect: '+5% performance on hard courses',
    performanceBonus: 5,
  },
  {
    id: 'sport_boots',
    name: 'Sport Boots',
    category: 'boots',
    price: 120,
    description: 'Protective boots for your unicorn\'s legs.',
    emoji: '🦵',
    effect: '+5 health after each ride',
    statBoost: { health: 5 },
  },
  // Saddle Pads
  {
    id: 'embroidered_pad',
    name: 'Embroidered Pad',
    category: 'saddlePads',
    price: 150,
    description: 'Gold-embroidered saddle pad with your unicorn\'s name.',
    emoji: '🌟',
    effect: '+5 happiness per ride',
    statBoost: { happiness: 5 },
  },
  {
    id: 'fluffy_pad',
    name: 'Rainbow Pad',
    category: 'saddlePads',
    price: 80,
    description: 'Colorful rainbow saddle pad. Extra fluffy!',
    emoji: '🌈',
    effect: '+2 happiness daily',
    statBoost: { happiness: 2 },
  },
  // Care Equipment
  {
    id: 'magic_brush',
    name: 'Magic Grooming Kit',
    category: 'careEquipment',
    price: 400,
    description: 'Enchanted brush set. Your unicorn shines brighter.',
    emoji: '✨',
    effect: '+15 cleanliness per brush session',
    statBoost: { cleanliness: 15 },
  },
  {
    id: 'silver_pick',
    name: 'Silver Hoof Pick',
    category: 'careEquipment',
    price: 250,
    description: 'Sterling silver hoof pick. Unicorns can\'t resist.',
    emoji: '🪝',
    effect: '+10 cleanliness per hoof pick',
    statBoost: { cleanliness: 10 },
  },
  {
    id: 'healing_balm',
    name: 'Healing Balm',
    category: 'careEquipment',
    price: 300,
    description: 'Magical balm that restores health instantly.',
    emoji: '💊',
    effect: '+30 health instantly when used',
    statBoost: { health: 30 },
  },
  // Treats
  {
    id: 'crystal_treats',
    name: 'Crystal Treats',
    category: 'treats',
    price: 100,
    description: 'Sparkling treats your unicorn adores.',
    emoji: '💎',
    effect: '+20 happiness, +10 hunger',
    statBoost: { happiness: 20, hunger: 10 },
  },
  {
    id: 'cloud_carrots',
    name: 'Cloud Carrots',
    category: 'treats',
    price: 60,
    description: 'Fluffy cloud-grown carrots, extra magical.',
    emoji: '🥕',
    effect: '+15 hunger, +5 energy',
    statBoost: { hunger: 15, energy: 5 },
  },
  {
    id: 'rainbow_oats',
    name: 'Rainbow Oats',
    category: 'treats',
    price: 80,
    description: 'Fortified oats for peak performance.',
    emoji: '🌈',
    effect: '+15 energy, +10 health',
    statBoost: { energy: 15, health: 10 },
  },
];

// ─── Game Scenes ─────────────────────────────────────────────────────────────

export type GameScene =
  | 'barn'
  | 'crossTies'
  | 'courseSelect'
  | 'courseMemorize'
  | 'courseRide'
  | 'results'
  | 'care'
  | 'tackShop'
  | 'trunk';

// ─── Grooming ────────────────────────────────────────────────────────────────

export type GroomingStep =
  | 'enterStation'
  | 'secureTies'
  | 'brush'
  | 'pickHooves'
  | 'saddle'
  | 'bridle'
  | 'mount'
  | 'done';

// ─── Course / Riding ─────────────────────────────────────────────────────────

export type CourseDifficulty = 'easy' | 'medium' | 'hard';

export type ObstacleType = 'vertical' | 'oxer' | 'combination' | 'wall' | 'gate';

export interface Obstacle {
  id: number;
  type: ObstacleType;
  label: string;
  height: number;
  position: number;
}

export interface CourseDefinition {
  difficulty: CourseDifficulty;
  obstacles: Obstacle[];
  timeLimit: number;
  perfectScore: number;
}

export type JumpResult = 'perfect' | 'rail' | 'refusal' | 'missed';

export interface JumpScore {
  obstacleId: number;
  result: JumpResult;
  faults: number;
}

export interface RideResults {
  jumps: JumpScore[];
  totalFaults: number;
  totalScore: number;
  bonusPoints: number;
  grade: string;
  ribbon: RibbonDefinition | null;
  ribbonPoints: number;
}

// ─── Unicorn Stats ───────────────────────────────────────────────────────────

export interface UnicornStats {
  hunger: number;
  happiness: number;
  energy: number;
  health: number;
  cleanliness: number;
  stallClean: number;
}

// ─── Achievements ────────────────────────────────────────────────────────────

export type AchievementId =
  | 'first_ride'
  | 'first_ribbon'
  | 'blue_ribbon'
  | 'perfect_round'
  | 'devoted_rider'
  | 'shopkeeper'
  | 'clean_sweep'
  | 'champion_hard'
  | 'ribbon_collector'
  | 'bond_master';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  emoji: string;
  points: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_ride',       name: 'First Ride',        description: 'Complete your first course',               emoji: '🐎', points: 25 },
  { id: 'first_ribbon',     name: 'Ribbon Earner',     description: 'Win any ribbon',                           emoji: '🎀', points: 25 },
  { id: 'blue_ribbon',      name: 'Blue Ribbon!',      description: 'Win 1st place',                            emoji: '🥇', points: 100 },
  { id: 'perfect_round',    name: 'Perfect Round',     description: 'Complete a course with zero faults',       emoji: '⭐', points: 75 },
  { id: 'devoted_rider',    name: 'Devoted Rider',     description: 'Reach bond level 50 with your unicorn',    emoji: '💖', points: 50 },
  { id: 'shopkeeper',       name: 'Tack Room Pro',     description: 'Purchase 5 items from the tack shop',      emoji: '🏪', points: 50 },
  { id: 'clean_sweep',      name: 'Clean Sweep',       description: 'Complete the full grooming routine',       emoji: '🧹', points: 30 },
  { id: 'champion_hard',    name: 'Cloud Champion',    description: 'Win 1st place on a hard course',           emoji: '🏆', points: 200 },
  { id: 'ribbon_collector', name: 'Ribbon Wall',       description: 'Earn 10 ribbons total',                    emoji: '🎖️', points: 100 },
  { id: 'bond_master',      name: 'Soul Bond',         description: 'Reach maximum bond level 100',             emoji: '💫', points: 150 },
];

// ─── Game State ───────────────────────────────────────────────────────────────

export interface PlayerInventory {
  ownedItemIds: string[];         // IDs of purchased tack shop items
  equippedItems: {
    bridle?: string;
    saddle?: string;
    boots?: string;
    saddlePad?: string;
  };
  ribbons: RibbonEarned[];
  unlockedAchievements: AchievementId[];
}

export interface GameState {
  scene: GameScene;
  selectedUnicorn: UnicornColor | null;
  groomingStep: GroomingStep;
  courseDifficulty: CourseDifficulty | null;
  currentCourse: CourseDefinition | null;
  currentObstacleIndex: number;
  jumpResults: JumpScore[];
  rideResults: RideResults | null;
  stats: UnicornStats;
  bondLevel: number;             // 0-100, bond with selected unicorn
  totalPoints: number;
  shopPoints: number;            // spendable currency (same pool as totalPoints)
  level: number;
  inventory: PlayerInventory;
  newAchievement: Achievement | null;   // set briefly when an achievement unlocks
}
