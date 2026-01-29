import { api } from "./api";
import type {
  TicketmasterEvent,
  TicketmasterEventsResponse,
  Event,
  EventsPage,
} from "../types/event";

// Helper to get the best image URL
function getBestImage(images: TicketmasterEvent["images"]): string {
  if (!images || images.length === 0) {
    return "";
  }

  // Prefer 16:9 ratio with higher resolution
  const preferred = images.find(
    (img) => img.ratio === "16_9" && img.width >= 640
  );
  if (preferred) return preferred.url;

  // Fallback to largest image
  const sorted = [...images].sort((a, b) => b.width - a.width);
  return sorted[0]?.url || "";
}

// Transform Ticketmaster event to app Event type
function transformEvent(event: TicketmasterEvent): Event {
  const venue = event._embedded?.venues?.[0];
  const classification = event.classifications?.find((c) => c.primary);

  return {
    id: event.id,
    name: event.name,
    url: event.url,
    imageUrl: getBestImage(event.images),
    images: event.images,
    date: event.dates.start.localDate,
    time: event.dates.start.localTime,
    dateTime: event.dates.start.dateTime,
    venue: venue
      ? {
          name: venue.name,
          city: venue.city?.name,
          state: venue.state?.stateCode,
          address: venue.address?.line1,
        }
      : undefined,
    priceRange: event.priceRanges?.[0]
      ? {
          min: event.priceRanges[0].min,
          max: event.priceRanges[0].max,
          currency: event.priceRanges[0].currency,
        }
      : undefined,
    genre: classification?.genre?.name,
    segment: classification?.segment?.name,
    info: event.info,
  };
}

export interface FetchEventsParams {
  page?: number;
  size?: number;
  keyword?: string;
  sort?: string;
}

export async function fetchEvents(
  params: FetchEventsParams = {}
): Promise<EventsPage> {
  const { page = 0, size = 20, keyword, sort = "date,asc" } = params;

  const data = await api<TicketmasterEventsResponse>("/events.json", {
    params: { page, size, keyword, sort },
  });

  const events = data._embedded?.events || [];

  return {
    events: events.map(transformEvent),
    page: data.page.number,
    totalPages: data.page.totalPages,
    totalElements: data.page.totalElements,
  };
}

export async function fetchEventById(id: string): Promise<Event> {
  const data = await api<TicketmasterEvent>(`/events/${id}.json`);
  return transformEvent(data);
}
