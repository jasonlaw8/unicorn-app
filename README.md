# 🦄 Unicorn Care

A tamagotchi-style unicorn care game. Take care of your unicorn by feeding, playing, cleaning, and more. Built with React Native and Expo for cross-platform support (Web, iOS, Android).

## Tech Stack

- React Native with Expo (SDK 52)
- TypeScript
- Expo Router for navigation
- React Context for state management

## Project Structure

```
unicorn-app/
├── app/                    # Expo Router pages
│   ├── _layout.tsx         # Root layout with providers
│   └── index.tsx           # Main game screen
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── UnicornGame.tsx # Main game component
│   │   ├── StatBar.tsx     # Stat display bar
│   │   └── ActionButton.tsx# Action button component
│   ├── context/
│   │   └── GameContext.tsx  # Game state management
│   └── types/
│       └── index.ts        # TypeScript type definitions
├── app.json                # Expo configuration
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

## Game Features (Current)

- **Unicorn stats:** hunger, happiness, energy, health, cleanliness
- **Actions:** feed, play, sleep, clean, heal
- **Leveling system** with XP
- **Real-time stat decay**

## Roadmap

- Unicorn customization (colors, accessories)
- Mini-games for earning XP
- Multiple unicorns
- Social features (visit friends' unicorns)
- Persistent storage (AsyncStorage / cloud save)
- Animations and sound effects
- Push notifications for unicorn needs
- In-app shop with virtual currency

## Contributing

1. Create a feature branch from `main`
2. Follow the cross-platform guidelines above
3. Test on web **and** iOS before submitting a PR
4. Keep components small and reusable
5. Use TypeScript strict mode
