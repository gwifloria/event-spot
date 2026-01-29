import { createAnimations } from "@tamagui/animations-react-native";
import { createTamagui } from "tamagui";
import { config as tamaguiConfig } from "@tamagui/config/v3";

const animations = createAnimations({
  fast: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
});

export const config = createTamagui({
  ...tamaguiConfig,
  animations,
  tokens: {
    ...tamaguiConfig.tokens,
    color: {
      ...tamaguiConfig.tokens.color,
      primary: "#6366f1",
      primaryDark: "#4f46e5",
      secondary: "#ec4899",
      background: "#ffffff",
      backgroundDark: "#0f0f0f",
      card: "#f8fafc",
      cardDark: "#1a1a1a",
      text: "#0f172a",
      textDark: "#f1f5f9",
      textMuted: "#64748b",
      textMutedDark: "#94a3b8",
      border: "#e2e8f0",
      borderDark: "#27272a",
    },
  },
});

export default config;

export type AppConfig = typeof config;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}
