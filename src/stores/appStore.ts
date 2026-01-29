import { create } from "zustand";

export type ViewMode = "grid" | "list";

interface AppState {
  viewMode: ViewMode;
  searchQuery: string;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  viewMode: "grid",
  searchQuery: "",
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === "grid" ? "list" : "grid",
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
