import { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {
  EventList,
  SearchBar,
  SearchHistory,
  CategoryFilter,
  FilterChip,
  DateFilterModal,
  RegionModal,
  SortModal,
  CATEGORIES,
} from "../src/components";
import type { Category } from "../src/components";
import { useEvents, useDebouncedValue, useFilters } from "../src/hooks";
import { useAppStore } from "../src/stores/appStore";
import { getColors } from "../src/constants/colors";
import { formatResultCount } from "../src/utils/format";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  const {
    viewMode,
    toggleViewMode,
    searchQuery,
    setSearchQuery,
    searchHistory,
    addToSearchHistory,
    removeFromSearchHistory,
    clearSearchHistory,
    selectedCategory,
    setSelectedCategory,
  } = useAppStore();

  const {
    selectedRegion,
    selectedDateFilter,
    selectedSort,
    currentRegion,
    dateRange,
    activeModal,
    isDateFilterActive,
    isRegionFilterActive,
    hasActiveFilters,
    dateFilterLabel,
    sortLabel,
    openModal,
    closeModal,
    clearFilters,
    handleDateSelect,
    handleRegionSelect,
    handleSortSelect,
  } = useFilters();

  const [showHistory, setShowHistory] = useState(false);
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  const currentCategory = CATEGORIES.find((cat) => cat.id === selectedCategory);

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
  } = useEvents({
    keyword: debouncedQuery || undefined,
    segmentId: currentCategory?.segmentId,
    countryCode: selectedRegion,
    startDateTime: dateRange.startDateTime,
    endDateTime: dateRange.endDateTime,
    sort: selectedSort,
  });

  const events = useMemo(() => {
    return data?.pages.flatMap((page) => page.events) ?? [];
  }, [data]);

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery);
    }
    Keyboard.dismiss();
    setShowHistory(false);
  }, [searchQuery, addToSearchHistory]);

  const handleHistorySelect = useCallback(
    (query: string) => {
      setSearchQuery(query);
      addToSearchHistory(query);
      setShowHistory(false);
      Keyboard.dismiss();
    },
    [setSearchQuery, addToSearchHistory]
  );

  const handleCategorySelect = useCallback(
    (category: Category) => {
      setSelectedCategory(category.id);
    },
    [setSelectedCategory]
  );

  const filterPrefix = useMemo(
    () => (
      <>
        <FilterChip
          label={currentRegion?.flag ?? "🌍"}
          onPress={() => openModal("region")}
          isActive={isRegionFilterActive}
        />
        <FilterChip
          icon="calendar"
          label={dateFilterLabel}
          onPress={() => openModal("date")}
          isActive={isDateFilterActive}
        />
        {hasActiveFilters && (
          <Pressable
            onPress={clearFilters}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.pressed,
            ]}
          >
            <Feather name="x" size={16} color={c.textSecondary} />
          </Pressable>
        )}
      </>
    ),
    [
      currentRegion,
      dateFilterLabel,
      isRegionFilterActive,
      isDateFilterActive,
      hasActiveFilters,
      openModal,
      clearFilters,
      c.textSecondary,
    ]
  );

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
          <Feather
            name={viewMode === "grid" ? "list" : "grid"}
            size={20}
            color={c.text}
          />
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearchSubmit}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 150)}
          placeholder="Search events, artists..."
        />
      </View>

      <View style={styles.filterContainer}>
        <CategoryFilter
          selected={selectedCategory}
          onSelect={handleCategorySelect}
          prefix={filterPrefix}
        />
      </View>

      {showHistory && searchHistory.length > 0 && !searchQuery && (
        <SearchHistory
          history={searchHistory}
          onSelect={handleHistorySelect}
          onRemove={removeFromSearchHistory}
          onClear={clearSearchHistory}
        />
      )}

      {!isLoading && events.length > 0 && (
        <View style={styles.resultRow}>
          <Text style={[styles.resultCount, { color: c.textSecondary }]}>
            {formatResultCount(data?.pages[0]?.totalElements)}
          </Text>
          <Pressable
            onPress={() => openModal("sort")}
            style={({ pressed }) => [
              styles.sortButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.sortLabel, { color: c.textSecondary }]}>
              {sortLabel}
            </Text>
            <Feather name="chevron-down" size={14} color={c.textSecondary} />
          </Pressable>
        </View>
      )}

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

      <DateFilterModal
        visible={activeModal === "date"}
        onClose={closeModal}
        selectedFilter={selectedDateFilter}
        onSelectFilter={handleDateSelect}
      />

      <RegionModal
        visible={activeModal === "region"}
        onClose={closeModal}
        selectedRegion={selectedRegion}
        onSelectRegion={handleRegionSelect}
      />

      <SortModal
        visible={activeModal === "sort"}
        onClose={closeModal}
        selectedSort={selectedSort}
        onSelectSort={handleSortSelect}
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
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterContainer: {
    marginBottom: 8,
  },
  clearButton: {
    padding: 8,
    marginLeft: -4,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultCount: {
    fontSize: 13,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  sortLabel: {
    fontSize: 13,
  },
});
