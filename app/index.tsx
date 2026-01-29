import { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EventList } from "../src/components";
import { useEvents } from "../src/hooks";
import { useAppStore } from "../src/stores/appStore";
import { getColors } from "../src/constants/colors";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  const { viewMode, toggleViewMode } = useAppStore();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useEvents();

  const events = useMemo(() => {
    return data?.pages.flatMap((page) => page.events) ?? [];
  }, [data]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: c.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>Event Spot</Text>
        <Pressable
          onPress={toggleViewMode}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: c.backgroundSecondary },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.iconText, { color: c.text }]}>
            {viewMode === "grid" ? "☰" : "▦"}
          </Text>
        </Pressable>
      </View>

      <EventList
        events={events}
        viewMode={viewMode}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        onRefresh={refetch}
        onLoadMore={fetchNextPage}
        isRefreshing={isRefetching}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  iconText: {
    fontSize: 18,
  },
});
