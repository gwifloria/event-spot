import { Platform } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import type { DateFilter } from "../utils/dateFilter";

export type SortOption = "date,asc" | "date,desc" | "name,asc";

interface AppState {
  searchQuery: string;
  searchHistory: string[];
  selectedCategory: string;
  selectedRegion: string;
  selectedDateFilter: DateFilter;
  selectedSort: SortOption;
  favorites: string[];
  setSearchQuery: (query: string) => void;
  addToSearchHistory: (query: string) => void;
  removeFromSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setSelectedCategory: (category: string) => void;
  setSelectedRegion: (region: string) => void;
  setSelectedDateFilter: (filter: DateFilter) => void;
  setSelectedSort: (sort: SortOption) => void;
  toggleFavorite: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
}

const MAX_HISTORY_ITEMS = 10;

// Web uses localStorage, native uses AsyncStorage
const getStorage = (): StateStorage => {
  if (Platform.OS === "web") {
    return {
      getItem: (name) => {
        const value = localStorage.getItem(name); // eslint-disable-line no-undef
        return value ?? null;
      },
      setItem: (name, value) => {
        localStorage.setItem(name, value); // eslint-disable-line no-undef
      },
      removeItem: (name) => {
        localStorage.removeItem(name); // eslint-disable-line no-undef
      },
    };
  }
  // Lazy load AsyncStorage for native
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  return {
    getItem: async (name) => {
      return (await AsyncStorage.getItem(name)) ?? null;
    },
    setItem: async (name, value) => {
      await AsyncStorage.setItem(name, value);
    },
    removeItem: async (name) => {
      await AsyncStorage.removeItem(name);
    },
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      searchQuery: "",
      searchHistory: [],
      selectedCategory: "all",
      selectedRegion: "US",
      selectedDateFilter: "all",
      selectedSort: "date,asc",
      favorites: [],
      setSearchQuery: (query) => set({ searchQuery: query }),
      addToSearchHistory: (query) =>
        set((state) => {
          const trimmed = query.trim();
          if (!trimmed) return state;
          const filtered = state.searchHistory.filter((h) => h !== trimmed);
          return {
            searchHistory: [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS),
          };
        }),
      removeFromSearchHistory: (query) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter((h) => h !== query),
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedRegion: (region) => set({ selectedRegion: region }),
      setSelectedDateFilter: (filter) => set({ selectedDateFilter: filter }),
      setSelectedSort: (sort) => set({ selectedSort: sort }),
      toggleFavorite: (eventId) =>
        set((state) => {
          const isFav = state.favorites.includes(eventId);
          return {
            favorites: isFav
              ? state.favorites.filter((id) => id !== eventId)
              : [...state.favorites, eventId],
          };
        }),
      isFavorite: (eventId) => get().favorites.includes(eventId),
    }),
    {
      name: "event-spot-storage",
      storage: createJSONStorage(getStorage),
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        selectedRegion: state.selectedRegion,
        favorites: state.favorites,
      }),
    }
  )
);
