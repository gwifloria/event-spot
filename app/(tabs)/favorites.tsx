import { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { EventCard, EventListSkeleton } from "../../src/components";
import { useFavoriteEvents } from "../../src/hooks";
import { getColors } from "../../src/constants/colors";
import type { Event } from "../../src/types/event";

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  const { events, isLoading, isEmpty, refetch } = useFavoriteEvents();

  const renderItem = useCallback(
    ({ item }: { item: Event }) => (
      <View style={styles.gridItem}>
        <EventCard event={item} />
      </View>
    ),
    []
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.empty}>
        <Feather
          name="heart"
          size={48}
          color={c.textTertiary}
          style={styles.emptyIcon}
        />
        <Text style={[styles.emptyTitle, { color: c.text }]}>
          No favorites yet
        </Text>
        <Text style={[styles.emptyText, { color: c.textSecondary }]}>
          Tap the heart icon on events to save them here
        </Text>
      </View>
    );
  }, [isLoading, c.text, c.textSecondary, c.textTertiary]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: c.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>Favorites</Text>
      </View>

      {isLoading && isEmpty ? (
        <EventListSkeleton />
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refetch}
              tintColor={c.text}
            />
          }
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  listContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  gridItem: {
    width: "50%",
    padding: 6,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
