# 🦄 Unicorn Care

An interactive unicorn equestrian care game — like Neopets meets hunter/jumper! Choose from 10 unique unicorns, groom them at the cross ties, ride courses in a cloud arena, and care for them in a magical barn. Built with React Native and Expo for cross-platform support (Web, iOS, Android).

## Tech Stack

- React Native with Expo (SDK 52)
- TypeScript
- Expo Router for navigation
- React Context for state management

## Project Structure

```
unicorn-app/
├── app/                          # Expo Router pages
│   ├── _layout.tsx               # Root layout with GameProvider
│   └── index.tsx                 # Entry point → UnicornGame
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── UnicornGame.tsx       # Scene orchestrator (switches between scenes)
│   │   ├── GlowWrapper.tsx       # Animated glow effect for interactive hints
│   │   ├── StatBar.tsx           # Stat display progress bar
│   │   └── ActionButton.tsx      # Styled action button
│   ├── scenes/                   # Game scenes
│   │   ├── BarnScene.tsx         # Cloud barn with 10 unicorn stalls
│   │   ├── CrossTiesScene.tsx    # Grooming: brush, hooves, saddle, bridle
│   │   ├── CourseSelectScene.tsx  # Pick easy/medium/hard course
│   │   ├── CourseMemorizeScene.tsx# Memorize the obstacle course
│   │   ├── CourseRideScene.tsx   # Ride & jump timing gameplay
│   │   ├── ResultsScene.tsx      # Ride scoring & ribbons
│   │   └── CareScene.tsx         # Feed, water, clean, exercise
│   ├── context/
│   │   └── GameContext.tsx       # Full game state machine
│   ├── game/
│   │   └── courseGenerator.ts    # Course generation & scoring logic
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── app.json                      # Expo configuration
├── package.json
├── tsconfig.json
└── babel.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install dependencies

```bash
npm install
```

### Run the app

- **Web:** `npx expo start --web`
- **iOS:** `npx expo start --ios` (requires Xcode on macOS)
- **Android:** `npx expo start --android`

## Cross-Platform Guidelines

This project targets Web, iOS, and Android from a single codebase. All contributors must follow these rules to keep the app working on every platform.

### 1. Use React Native components only

Never use HTML elements (`div`, `span`, `p`, `button`, etc.). Always use the React Native equivalents: `View`, `Text`, `TouchableOpacity`, `ScrollView`, and so on. HTML elements will work on web but crash on native platforms.

### 2. Use StyleSheet.create

Do not use CSS files or inline style objects defined outside of `StyleSheet.create`. The StyleSheet API ensures styles are valid and performant on all platforms.

```tsx
// Good
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});

// Bad - do not do this
const styles = { container: { display: 'grid' } };
```

### 3. Platform-specific code

When platform differences are unavoidable, use `Platform.OS` or `Platform.select()` for small adjustments. For larger divergences, use platform-specific file extensions (`.ios.tsx`, `.android.tsx`, `.web.tsx`).

```tsx
import { Platform } from 'react-native';

const padding = Platform.select({ ios: 20, android: 16, web: 24 });
```

### 4. No web-only libraries

All npm packages must support React Native. Check compatibility before adding any dependency. If a web-only package is needed, provide a React Native alternative and use platform-specific imports.

### 5. Testing on all platforms

Always test changes on both web and iOS before merging. Use responsive layouts that work across screen sizes. Do not assume a fixed screen width or height.

### 6. Assets

Place images in the `assets/` folder. Use `@2x` and `@3x` suffixes for iOS resolution support. Use `expo-image` or `Image` from `react-native` to display images -- never use HTML `<img>` tags.

### 7. Navigation

Use Expo Router (file-based routing) for all navigation. Do not use `react-navigation` directly. Pages live in the `app/` directory.

### 8. State Management

Use React Context for state management. If state grows complex enough to warrant a dedicated library, discuss migrating to Zustand with the team before making changes.

### 9. Expo compatibility

Stay within the Expo managed workflow. Do not eject. If a native module is needed, use an Expo config plugin instead.

## Game Flow

1. **Barn** — Choose from 10 unicorns (purple, pink, baby blue, navy, orange, mint, yellow, red, white, rainbow)
2. **Cross Ties** — Step-by-step grooming: enter station → secure ties → brush → pick hooves → saddle → bridle → mount
3. **Course Select** — Choose easy (5 jumps), medium (8 jumps), or hard (12 jumps)
4. **Memorize** — Study the obstacle course before the timer runs out
5. **Ride** — Tap JUMP with the right timing as your unicorn approaches each obstacle
6. **Results** — Hunter/jumper style scoring: faults for rails, refusals, misses; ribbons awarded
7. **Care** — Feed, water, clean stall, exercise to keep stats high

### Glow System
Interactive elements pulse with a golden glow to guide the user through each step. The `GlowWrapper` component handles this animation.

### Scoring
- Grooming: 5 points per step (35 total)
- Riding: Based on jump accuracy, difficulty multiplier, and bonus for perfect jumps
- Care: 5-10 points per action
- Level up every 200 points

## Game Features (Current)

- **10 unique unicorns** with distinct colors and names
- **Guided grooming flow** with glow indicators
- **Hunter/jumper courses** with 3 difficulty levels
- **Jump timing mechanic** — tap at the right moment for a clean jump
- **Unicorn stats:** hunger, happiness, energy, health, cleanliness, stall cleanliness
- **Care actions:** feed, water, clean stall, exercise
- **Leveling system** with points
- **Real-time stat decay**

## Roadmap

- Animated unicorn sprites (replace emoji placeholders)
- Sound effects and music
- Persistent storage (AsyncStorage / cloud save)
- Unicorn customization (accessories, tack colors)
- More course types (dressage, cross-country)
- Social features (visit friends' barns)
- Push notifications for unicorn needs
- In-app shop with virtual currency
- Leaderboards

## Contributing

1. Create a feature branch from `main`
2. Follow the cross-platform guidelines above
3. Test on web **and** iOS before submitting a PR
4. Keep components small and reusable
5. Use TypeScript strict mode
