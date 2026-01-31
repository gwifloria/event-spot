export const colors = {
  light: {
    background: "#f8fafc",
    backgroundSecondary: "#f1f5f9",
    card: "#fff",
    text: "#0f172a",
    textSecondary: "#64748b",
    textTertiary: "#94a3b8",
    border: "#e2e8f0",
    placeholder: "#e5e5e5",
    shadow: "#000",
    shadowOpacity: 0.1,
    indicatorInactive: "rgba(0,0,0,0.3)",
    indicatorActive: "#000",
    backButton: "rgba(255,255,255,0.9)",
  },
  dark: {
    background: "#0f0f0f",
    backgroundSecondary: "#1a1a1a",
    card: "#1a1a1a",
    text: "#f1f5f9",
    textSecondary: "#94a3b8",
    textTertiary: "#64748b",
    border: "#27272a",
    placeholder: "#333",
    shadow: "#000",
    shadowOpacity: 0.3,
    indicatorInactive: "rgba(255,255,255,0.4)",
    indicatorActive: "#fff",
    backButton: "rgba(0,0,0,0.6)",
  },
  // 不随主题变化的颜色
  primary: "#6366f1",
  primaryLight: "#3b82f6",
  primaryDark: "#2563eb",
  white: "#fff",
  black: "#000",
} as const;

export type ColorScheme = "light" | "dark";

export function getColors(scheme: ColorScheme) {
  return colors[scheme];
}
