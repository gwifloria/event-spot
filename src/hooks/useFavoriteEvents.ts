import { useQueries } from "@tanstack/react-query";
import { fetchEventById } from "../services/ticketmaster";
import { useAppStore } from "../stores/appStore";
import type { Event } from "../types/event";

export function useFavoriteEvents() {
  const favorites = useAppStore((state) => state.favorites);

  const queries = useQueries({
    queries: favorites.map((id) => ({
      queryKey: ["event", id],
      queryFn: () => fetchEventById(id),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const events: Event[] = queries
    .filter((q) => q.data)
    .map((q) => q.data as Event);

  const refetch = () => {
    queries.forEach((q) => q.refetch());
  };

  return {
    events,
    isLoading,
    isError,
    isEmpty: favorites.length === 0,
    refetch,
  };
}
