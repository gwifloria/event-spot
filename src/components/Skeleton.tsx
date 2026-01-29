import { View, StyleSheet, useColorScheme } from "react-native";
import { getColors } from "../constants/colors";

interface SkeletonProps {
  variant?: "grid" | "list";
}

type ThemeColors = ReturnType<typeof getColors>;

function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  colors: c,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  colors: ThemeColors;
}) {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: c.placeholder,
        },
      ]}
    />
  );
}

export function EventCardSkeleton({ variant = "grid" }: SkeletonProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  if (variant === "grid") {
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: c.card, shadowOpacity: c.shadowOpacity },
        ]}
      >
        <SkeletonBox width="100%" height={140} borderRadius={0} colors={c} />
        <View style={styles.content}>
          <SkeletonBox width="80%" height={18} colors={c} />
          <SkeletonBox width="50%" height={14} colors={c} />
          <SkeletonBox width="60%" height={14} colors={c} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.card, shadowOpacity: c.shadowOpacity },
      ]}
    >
      <View style={styles.listContent}>
        <SkeletonBox width={80} height={80} colors={c} />
        <View style={styles.listInfo}>
          <SkeletonBox width="80%" height={18} colors={c} />
          <SkeletonBox width="50%" height={14} colors={c} />
          <SkeletonBox width="60%" height={14} colors={c} />
        </View>
      </View>
    </View>
  );
}

export function EventListSkeleton({
  count = 6,
  variant = "grid",
}: {
  count?: number;
  variant?: "grid" | "list";
}) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "grid") {
    return (
      <View style={styles.gridContainer}>
        {items.map((i) => (
          <View key={i} style={styles.gridItem}>
            <EventCardSkeleton variant="grid" />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {items.map((i) => (
        <EventCardSkeleton key={i} variant="list" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    opacity: 0.7,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 12,
    gap: 8,
  },
  listContent: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    alignItems: "center",
  },
  listInfo: {
    flex: 1,
    gap: 8,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 12,
  },
  gridItem: {
    width: "48%",
  },
  listContainer: {
    padding: 12,
    gap: 12,
  },
});
