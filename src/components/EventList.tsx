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
import type { ViewMode } from "../stores/appStore";

interface EventListProps {
  events: Event[];
  viewMode: ViewMode;
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
  viewMode,
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
  const isGrid = viewMode === "grid";

  const renderItem = useCallback(
    ({ item }: { item: Event }) => {
      if (isGrid) {
        return (
          <View style={styles.gridItem}>
            <EventCard event={item} variant="grid" />
          </View>
        );
      }
      return (
        <View style={styles.listItem}>
          <EventCard event={item} variant="list" />
        </View>
      );
    },
    [isGrid]
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
    return <EventListSkeleton variant={viewMode} />;
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
      numColumns={isGrid ? 2 : 1}
      key={isGrid ? "grid" : "list"}
      contentContainerStyle={[styles.container, isGrid && styles.gridContainer]}
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
    flexGrow: 1,
  },
  gridContainer: {
    paddingHorizontal: 8,
  },
  gridItem: {
    width: "50%",
    padding: 6,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    overflow: "hidden",
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
