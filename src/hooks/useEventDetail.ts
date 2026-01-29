import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "../services/ticketmaster";

export function useEventDetail(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
  });
}
