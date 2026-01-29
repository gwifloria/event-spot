import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchEvents, type FetchEventsParams } from "../services/ticketmaster";

export function useEvents(params: Omit<FetchEventsParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: ["events", params],
    queryFn: ({ pageParam = 0 }) =>
      fetchEvents({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
}
