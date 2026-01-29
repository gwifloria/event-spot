// Ticketmaster API Response Types

export interface TicketmasterImage {
  url: string;
  ratio?: "16_9" | "3_2" | "4_3" | "1_1";
  width: number;
  height: number;
  fallback?: boolean;
}

export interface TicketmasterVenue {
  id: string;
  name: string;
  url?: string;
  city?: {
    name: string;
  };
  state?: {
    name: string;
    stateCode: string;
  };
  country?: {
    name: string;
    countryCode: string;
  };
  address?: {
    line1: string;
    line2?: string;
  };
  location?: {
    longitude: string;
    latitude: string;
  };
}

export interface TicketmasterPriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface TicketmasterClassification {
  primary: boolean;
  segment?: {
    id: string;
    name: string;
  };
  genre?: {
    id: string;
    name: string;
  };
  subGenre?: {
    id: string;
    name: string;
  };
}

export interface TicketmasterDate {
  localDate: string;
  localTime?: string;
  dateTime?: string;
  dateTBD?: boolean;
  dateTBA?: boolean;
  timeTBA?: boolean;
  noSpecificTime?: boolean;
}

export interface TicketmasterEvent {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images: TicketmasterImage[];
  dates: {
    start: TicketmasterDate;
    end?: TicketmasterDate;
    timezone?: string;
    status?: {
      code: string;
    };
  };
  sales?: {
    public?: {
      startDateTime?: string;
      endDateTime?: string;
      startTBD?: boolean;
      startTBA?: boolean;
    };
  };
  priceRanges?: TicketmasterPriceRange[];
  classifications?: TicketmasterClassification[];
  info?: string;
  pleaseNote?: string;
  _embedded?: {
    venues?: TicketmasterVenue[];
    attractions?: {
      id: string;
      name: string;
      url?: string;
      images?: TicketmasterImage[];
    }[];
  };
}

export interface TicketmasterPage {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface TicketmasterEventsResponse {
  _embedded?: {
    events: TicketmasterEvent[];
  };
  page: TicketmasterPage;
}

// App-level transformed types

export interface Event {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  images: TicketmasterImage[];
  date: string;
  time?: string;
  dateTime?: string;
  venue?: {
    name: string;
    city?: string;
    state?: string;
    address?: string;
  };
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  genre?: string;
  segment?: string;
  info?: string;
}

export interface EventsPage {
  events: Event[];
  page: number;
  totalPages: number;
  totalElements: number;
}
