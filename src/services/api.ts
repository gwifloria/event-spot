const TICKETMASTER_BASE_URL = "https://app.ticketmaster.com/discovery/v2";
const API_KEY = process.env.EXPO_PUBLIC_TICKETMASTER_API_KEY;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  params?: Record<string, string | number | undefined>;
}

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params = {} } = options;

  // Build URL with query params
  const url = new URL(`${TICKETMASTER_BASE_URL}${endpoint}`);
  url.searchParams.set("apikey", API_KEY || "");

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API request failed: ${response.statusText}`
    );
  }

  return response.json();
}
