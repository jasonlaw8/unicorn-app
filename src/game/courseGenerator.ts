import {
  CourseDifficulty,
  CourseDefinition,
  Obstacle,
  ObstacleType,
  JumpScore,
  JumpResult,
  RideResults,
} from '../types';

const OBSTACLE_TEMPLATES: { type: ObstacleType; label: string; baseHeight: number }[] = [
  { type: 'vertical', label: 'Vertical', baseHeight: 1 },
  { type: 'oxer', label: 'Oxer', baseHeight: 1.2 },
  { type: 'gate', label: 'Gate', baseHeight: 0.9 },
  { type: 'wall', label: 'Wall', baseHeight: 1.1 },
  { type: 'combination', label: 'Combination', baseHeight: 1.3 },
];

const DIFFICULTY_CONFIG: Record<
  CourseDifficulty,
  { count: number; timeLimit: number; heightMultiplier: number; perfectScore: number }
> = {
  easy: { count: 5, timeLimit: 15, heightMultiplier: 1, perfectScore: 100 },
  medium: { count: 8, timeLimit: 12, heightMultiplier: 1.3, perfectScore: 160 },
  hard: { count: 12, timeLimit: 10, heightMultiplier: 1.6, perfectScore: 240 },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateCourse(difficulty: CourseDifficulty): CourseDefinition {
  const config = DIFFICULTY_CONFIG[difficulty];
  const obstacles: Obstacle[] = [];

  for (let i = 0; i < config.count; i++) {
    const template = OBSTACLE_TEMPLATES[i % OBSTACLE_TEMPLATES.length];
    obstacles.push({
      id: i,
      type: template.type,
      label: `${template.label} ${i + 1}`,
      height: Math.round(template.baseHeight * config.heightMultiplier * 10) / 10,
      position: Math.round(((i + 1) / (config.count + 1)) * 100),
    });
  }

  return {
    difficulty,
    obstacles: shuffle(obstacles).map((o, i) => ({
      ...o,
      id: i,
      position: Math.round(((i + 1) / (config.count + 1)) * 100),
    })),
    timeLimit: config.timeLimit,
    perfectScore: config.perfectScore,
  };
}

export function getJumpFaults(result: JumpResult): number {
  switch (result) {
    case 'perfect':
      return 0;
    case 'rail':
      return 4;
    case 'refusal':
      return 8;
    case 'missed':
      return 12;
  }
}

export function calculateJumpResult(
  timingAccuracy: number, // 0-1, 1 = perfect
  obstacleHeight: number
): JumpResult {
  const difficultyPenalty = obstacleHeight * 0.1;
  const effectiveAccuracy = timingAccuracy - difficultyPenalty;

  if (effectiveAccuracy > 0.7) return 'perfect';
  if (effectiveAccuracy > 0.4) return 'rail';
  if (effectiveAccuracy > 0.15) return 'refusal';
  return 'missed';
}

export function calculateRideResults(
  jumps: JumpScore[],
  difficulty: CourseDifficulty
): RideResults {
  const config = DIFFICULTY_CONFIG[difficulty];
  const totalFaults = jumps.reduce((sum, j) => sum + j.faults, 0);

  const perfectJumps = jumps.filter((j) => j.result === 'perfect').length;
  const bonusPoints = perfectJumps * 5;

  const faultPenalty = totalFaults * 2;
  const totalScore = Math.max(0, config.perfectScore - faultPenalty + bonusPoints);

  let grade: string;
  const ratio = totalScore / config.perfectScore;
  if (ratio >= 0.95) grade = 'Champion! 🏆';
  else if (ratio >= 0.85) grade = 'Blue Ribbon! 🥇';
  else if (ratio >= 0.7) grade = 'Red Ribbon! 🥈';
  else if (ratio >= 0.5) grade = 'White Ribbon 🥉';
  else grade = 'Keep Practicing!';

  return { jumps, totalFaults, totalScore, bonusPoints, grade };
}

export function getObstacleEmoji(type: ObstacleType): string {
  switch (type) {
    case 'vertical':
      return '🏗️';
    case 'oxer':
      return '🌿';
    case 'gate':
      return '🚧';
    case 'wall':
      return '🧱';
    case 'combination':
      return '⛩️';
  }
}
