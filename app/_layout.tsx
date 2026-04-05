import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GameProvider } from "../src/context/GameContext";

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#7B2D8E" },
          headerTintColor: "#FFF",
          headerTitle: "Unicorn Care",
        }}
      />
      <StatusBar style="light" />
    </GameProvider>
  );
}
