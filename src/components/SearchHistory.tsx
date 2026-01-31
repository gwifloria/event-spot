import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { getColors } from "../constants/colors";

interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  onClear: () => void;
}

export function SearchHistory({
  history,
  onSelect,
  onRemove,
  onClear,
}: SearchHistoryProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  if (history.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.textSecondary }]}>
          Recent Searches
        </Text>
        <Pressable onPress={onClear}>
          <Text style={[styles.clearText, { color: c.textTertiary }]}>
            Clear
          </Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {history.map((item) => (
          <Pressable
            key={item}
            style={[styles.chip, { backgroundColor: c.backgroundSecondary }]}
            onPress={() => onSelect(item)}
          >
            <Feather name="clock" size={12} color={c.textTertiary} />
            <Text
              style={[styles.chipText, { color: c.text }]}
              numberOfLines={1}
            >
              {item}
            </Text>
            <Pressable
              onPress={() => onRemove(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={14} color={c.textTertiary} />
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
  },
  clearText: {
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    maxWidth: 150,
  },
});
