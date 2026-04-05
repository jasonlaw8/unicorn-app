import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { UnicornState } from '../types';

interface GameContextValue {
  unicorn: UnicornState;
  feed: () => void;
  play: () => void;
  sleep: () => void;
  clean: () => void;
  heal: () => void;
}

const initialState: UnicornState = {
  name: 'Sparkle',
  hunger: 70,
  happiness: 70,
  energy: 70,
  health: 80,
  cleanliness: 75,
  age: 0,
  level: 1,
  xp: 0,
};

const clamp = (value: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, value));

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unicorn, setUnicorn] = useState<UnicornState>(initialState);
  const unicornRef = useRef(unicorn);
  unicornRef.current = unicorn;

  const applyXp = (state: UnicornState, gained: number): UnicornState => {
    let newXp = state.xp + gained;
    let newLevel = state.level;
    while (newXp >= 100) {
      newXp -= 100;
      newLevel += 1;
    }
    return { ...state, xp: newXp, level: newLevel };
  };

  const feed = useCallback(() => {
    setUnicorn((prev) => {
      const updated: UnicornState = {
        ...prev,
        hunger: clamp(prev.hunger + 20),
        happiness: clamp(prev.happiness + 5),
      };
      return applyXp(updated, 10);
    });
  }, []);

  const play = useCallback(() => {
    setUnicorn((prev) => {
      const updated: UnicornState = {
        ...prev,
        happiness: clamp(prev.happiness + 25),
        energy: clamp(prev.energy - 15),
        hunger: clamp(prev.hunger - 10),
      };
      return applyXp(updated, 15);
    });
  }, []);

  const sleep = useCallback(() => {
    setUnicorn((prev) => {
      const updated: UnicornState = {
        ...prev,
        energy: clamp(prev.energy + 40),
        hunger: clamp(prev.hunger - 5),
      };
      return applyXp(updated, 5);
    });
  }, []);

  const clean = useCallback(() => {
    setUnicorn((prev) => {
      const updated: UnicornState = {
        ...prev,
        cleanliness: clamp(prev.cleanliness + 30),
        happiness: clamp(prev.happiness + 5),
      };
      return applyXp(updated, 10);
    });
  }, []);

  const heal = useCallback(() => {
    setUnicorn((prev) => {
      const updated: UnicornState = {
        ...prev,
        health: clamp(prev.health + 30),
      };
      return applyXp(updated, 5);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUnicorn((prev) => ({
        ...prev,
        hunger: clamp(prev.hunger - 2),
        happiness: clamp(prev.happiness - 1),
        energy: clamp(prev.energy - 1),
        cleanliness: clamp(prev.cleanliness - 1),
        age: prev.age + 1,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider value={{ unicorn, feed, play, sleep, clean, heal }}>
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
