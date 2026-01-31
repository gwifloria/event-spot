/**
 * Format a date string to a human-readable format
 * @param dateStr - ISO date string (YYYY-MM-DD)
 * @param timeStr - Optional time string (HH:mm:ss)
 * @returns Formatted date string
 */
export function formatEventDate(dateStr: string, timeStr?: string): string {
  const date = new Date(dateStr + (timeStr ? `T${timeStr}` : ""));
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffDays = Math.floor(
    (eventDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Today
  if (diffDays === 0) {
    return "Today";
  }

  // Tomorrow
  if (diffDays === 1) {
    return "Tomorrow";
  }

  // Within this week (2-6 days)
  if (diffDays >= 2 && diffDays <= 6) {
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    return `This ${dayName}`;
  }

  // Next week
  if (diffDays >= 7 && diffDays <= 13) {
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    return `Next ${dayName}`;
  }

  // Default format
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

/**
 * Format time to 12-hour format
 * @param timeStr - Time string (HH:mm:ss)
 * @returns Formatted time string (e.g., "7:30 PM")
 */
export function formatEventTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Format price range
 * @param min - Minimum price
 * @param max - Maximum price
 * @param currency - Currency code (default: USD)
 * @returns Formatted price range string
 */
export function formatPriceRange(
  min: number,
  max: number,
  currency: string = "USD"
): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (min === max) {
    return formatter.format(min);
  }

  return `${formatter.format(min)} - ${formatter.format(max)}`;
}

/**
 * Format a single price value
 * @param price - Price value
 * @param currency - Currency code (default: USD)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
