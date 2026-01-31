import { Pressable, Text, StyleSheet, useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, getColors } from "../constants/colors";

interface FilterChipProps {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  isActive?: boolean;
}

export function FilterChip({
  label,
  onPress,
  icon,
  isActive = false,
}: FilterChipProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: isActive ? colors.primary : c.backgroundSecondary,
        },
        pressed && styles.pressed,
      ]}
    >
      {icon && (
        <Feather
          name={icon}
          size={14}
          color={isActive ? colors.white : c.textSecondary}
        />
      )}
      <Text
        style={[styles.label, { color: isActive ? colors.white : c.text }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Feather
        name="chevron-down"
        size={10}
        color={isActive ? colors.white : c.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
