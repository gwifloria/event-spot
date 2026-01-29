import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { colors, getColors } from "../constants/colors";

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({
  message = "Something went wrong",
  onRetry,
}: ErrorViewProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      <Text style={[styles.emoji, { color: c.textSecondary }]}>Oops!</Text>
      <Text style={[styles.message, { color: c.textTertiary }]}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: isDark
                ? colors.primaryLight
                : colors.primaryDark,
            },
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  emoji: {
    fontSize: 24,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
  },
});
