export type DateFilterPreset = "all" | "today" | "weekend" | "week" | "month";

export type CustomDateRange = {
  type: "custom";
  startDate: string;
  endDate: string;
};

export type DateFilter = DateFilterPreset | CustomDateRange;

export interface DateFilterOption {
  id: DateFilterPreset;
  label: string;
}

export const DATE_FILTERS: DateFilterOption[] = [
  { id: "all", label: "All Dates" },
  { id: "today", label: "Today" },
  { id: "weekend", label: "This Weekend" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const SHORT_LABELS: Record<DateFilterPreset, string> = {
  all: "Any",
  today: "Today",
  weekend: "Wknd",
  week: "Week",
  month: "Month",
};

export function getDateFilterLabel(filter: DateFilter): string {
  if (typeof filter === "object" && filter.type === "custom") {
    return `${formatShortDate(filter.startDate)} - ${formatShortDate(filter.endDate)}`;
  }
  return SHORT_LABELS[filter as DateFilterPreset] ?? "Date";
}

export function isCustomDateFilter(
  filter: DateFilter
): filter is CustomDateRange {
  return typeof filter === "object" && filter.type === "custom";
}

/**
 * 获取预设对应的日期字符串（YYYY-MM-DD 格式）
 */
export function getPresetDateStrings(
  preset: DateFilterPreset
): { start: string; end: string } | null {
  if (preset === "all") return null;

  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  switch (preset) {
    case "today":
      return { start: formatDate(today), end: formatDate(today) };

    case "weekend": {
      const day = today.getDay();
      const saturday = new Date(today);
      saturday.setDate(today.getDate() + ((6 - day + 7) % 7));
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      // 如果今天是周末，从今天开始
      const start = day === 0 || day === 6 ? today : saturday;
      return { start: formatDate(start), end: formatDate(sunday) };
    }

    case "week": {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      return { start: formatDate(today), end: formatDate(endOfWeek) };
    }

    case "month": {
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start: formatDate(today), end: formatDate(endOfMonth) };
    }

    default:
      return null;
  }
}

interface DateRange {
  startDateTime?: string;
  endDateTime?: string;
}

export function getDateRange(filter: DateFilter): DateRange {
  if (filter === "all") {
    return {};
  }

  // Handle custom date range
  if (typeof filter === "object" && filter.type === "custom") {
    const startDate = new Date(filter.startDate);
    const endDate = new Date(filter.endDate);
    endDate.setHours(23, 59, 59, 999);
    return {
      startDateTime: startDate.toISOString().replace(/\.\d{3}Z$/, "Z"),
      endDateTime: endDate.toISOString().replace(/\.\d{3}Z$/, "Z"),
    };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const formatISO = (date: Date): string => {
    return date.toISOString().replace(/\.\d{3}Z$/, "Z");
  };

  switch (filter) {
    case "today": {
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      return {
        startDateTime: formatISO(now),
        endDateTime: formatISO(endOfDay),
      };
    }

    case "weekend": {
      const dayOfWeek = today.getDay();
      // Saturday = 6, Sunday = 0
      let saturday: Date;
      if (dayOfWeek === 6) {
        // Today is Saturday
        saturday = today;
      } else if (dayOfWeek === 0) {
        // Today is Sunday, use today
        saturday = today;
      } else {
        // Find next Saturday
        saturday = new Date(today);
        saturday.setDate(today.getDate() + (6 - dayOfWeek));
      }

      const sunday = new Date(saturday);
      if (saturday.getDay() === 6) {
        sunday.setDate(saturday.getDate() + 1);
      }
      sunday.setHours(23, 59, 59, 999);

      const startDate = dayOfWeek === 0 || dayOfWeek === 6 ? now : saturday;

      return {
        startDateTime: formatISO(startDate),
        endDateTime: formatISO(sunday),
      };
    }

    case "week": {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);
      return {
        startDateTime: formatISO(now),
        endDateTime: formatISO(endOfWeek),
      };
    }

    case "month": {
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      return {
        startDateTime: formatISO(now),
        endDateTime: formatISO(endOfMonth),
      };
    }

    default:
      return {};
  }
}
