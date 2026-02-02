import { useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { EventCard } from "./EventCard";
import { EventListSkeleton } from "./Skeleton";
import { ErrorView } from "./ErrorView";
import { getColors } from "../constants/colors";
import type { Event } from "../types/event";

interface EventListProps {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  isRefreshing: boolean;
}

export function EventList({
  events,
  isLoading,
  isError,
  error,
  isFetchingNextPage,
  hasNextPage,
  onRefresh,
  onLoadMore,
  isRefreshing,
}: EventListProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  const renderItem = useCallback(
    ({ item }: { item: Event }) => (
      <View style={styles.gridItem}>
        <EventCard event={item} />
      </View>
    ),
    []
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={c.text} />
      </View>
    );
  }, [isFetchingNextPage, c.text]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.empty}>
        <Feather
          name="calendar"
          size={48}
          color={c.textTertiary}
          style={styles.emptyIcon}
        />
        <Text style={[styles.emptyTitle, { color: c.text }]}>
          No events found
        </Text>
        <Text style={[styles.emptyText, { color: c.textSecondary }]}>
          Try adjusting your filters or search terms
        </Text>
      </View>
    );
  }, [isLoading, c.text, c.textSecondary, c.textTertiary]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (isLoading) {
    return <EventListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorView
        message={error?.message || "Failed to load events"}
        onRetry={onRefresh}
      />
    );
  }

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={c.text}
        />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  gridItem: {
    width: "50%",
    padding: 6,
  },
  footer: {
    padding: 16,
    alignItems: "center",
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
