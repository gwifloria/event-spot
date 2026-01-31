import type { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import { getColors } from "../constants/colors";

export interface Category {
  id: string;
  name: string;
  segmentId?: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "All" },
  { id: "music", name: "Music", segmentId: "KZFzniwnSyZfZ7v7nJ" },
  { id: "sports", name: "Sports", segmentId: "KZFzniwnSyZfZ7v7nE" },
  { id: "arts", name: "Arts", segmentId: "KZFzniwnSyZfZ7v7na" },
  { id: "film", name: "Film", segmentId: "KZFzniwnSyZfZ7v7nn" },
  { id: "misc", name: "Misc", segmentId: "KZFzniwnSyZfZ7v7n1" },
];

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: Category) => void;
  prefix?: ReactNode;
}

export function CategoryFilter({
  selected,
  onSelect,
  prefix,
}: CategoryFilterProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");
  const isDark = colorScheme === "dark";

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {prefix}
      {prefix && <View style={styles.divider} />}
      {CATEGORIES.map((category) => {
        const isSelected = selected === category.id;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(category)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? isDark
                    ? "#fff"
                    : "#0f172a"
                  : c.backgroundSecondary,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected ? (isDark ? "#0f172a" : "#fff") : c.text,
                },
              ]}
            >
              {category.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingRight: 32,
    gap: 8,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(128,128,128,0.3)",
    marginHorizontal: 4,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
