export interface UnicornState {
  name: string;
  hunger: number;
  happiness: number;
  energy: number;
  health: number;
  cleanliness: number;
  age: number;
  level: number;
  xp: number;
}

export type UnicornStats =
  | 'hunger'
  | 'happiness'
  | 'energy'
  | 'health'
  | 'cleanliness';

export type GameAction = 'feed' | 'play' | 'sleep' | 'clean' | 'heal';
