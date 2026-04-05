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
  { id: 'purple', name: 'Violet Star', color: '#9B59B6', maneColor: '#D4A5E5', emoji: '🦄' },
  { id: 'pink', name: 'Rose Sparkle', color: '#FF69B4', maneColor: '#FFB6D9', emoji: '🦄' },
  { id: 'babyBlue', name: 'Sky Dancer', color: '#87CEEB', maneColor: '#B0E0E6', emoji: '🦄' },
  { id: 'navyBlue', name: 'Midnight Storm', color: '#2C3E6B', maneColor: '#5B7FBF', emoji: '🦄' },
  { id: 'orange', name: 'Sunset Blaze', color: '#FF8C42', maneColor: '#FFB380', emoji: '🦄' },
  { id: 'mint', name: 'Minty Dream', color: '#98E8C1', maneColor: '#C5F5DC', emoji: '🦄' },
  { id: 'yellow', name: 'Golden Ray', color: '#FFD700', maneColor: '#FFF3B0', emoji: '🦄' },
  { id: 'red', name: 'Crimson Flame', color: '#E74C3C', maneColor: '#F5A8A1', emoji: '🦄' },
  { id: 'white', name: 'Pearl Grace', color: '#F8F8FF', maneColor: '#E8E0F0', emoji: '🦄' },
  { id: 'rainbow', name: 'Prisma Magic', color: '#FF6B6B', maneColor: '#4ECDC4', emoji: '🦄' },
];

export type GameScene =
  | 'barn'
  | 'crossTies'
  | 'courseSelect'
  | 'courseMemorize'
  | 'courseRide'
  | 'results'
  | 'care';

export type GroomingStep =
  | 'enterStation'
  | 'secureTies'
  | 'brush'
  | 'pickHooves'
  | 'saddle'
  | 'bridle'
  | 'mount'
  | 'done';

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
}

export interface UnicornStats {
  hunger: number;
  happiness: number;
  energy: number;
  health: number;
  cleanliness: number;
  stallClean: number;
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
  totalPoints: number;
  level: number;
}
