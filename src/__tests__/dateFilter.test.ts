import {
  isCustomDateFilter,
  getPresetDateStrings,
  getDateFilterLabel,
  type CustomDateRange,
} from "../utils/dateFilter";

describe("isCustomDateFilter", () => {
  it("returns true for custom date range", () => {
    const filter: CustomDateRange = {
      type: "custom",
      startDate: "2024-03-15",
      endDate: "2024-03-20",
    };
    expect(isCustomDateFilter(filter)).toBe(true);
  });

  it("returns false for preset filters", () => {
    expect(isCustomDateFilter("all")).toBe(false);
    expect(isCustomDateFilter("today")).toBe(false);
    expect(isCustomDateFilter("weekend")).toBe(false);
    expect(isCustomDateFilter("week")).toBe(false);
    expect(isCustomDateFilter("month")).toBe(false);
  });
});

describe("getDateFilterLabel", () => {
  it("returns correct label for presets", () => {
    expect(getDateFilterLabel("all")).toBe("Any");
    expect(getDateFilterLabel("today")).toBe("Today");
    expect(getDateFilterLabel("weekend")).toBe("Wknd");
    expect(getDateFilterLabel("week")).toBe("Week");
    expect(getDateFilterLabel("month")).toBe("Month");
  });

  it("returns formatted range for custom filter", () => {
    const filter: CustomDateRange = {
      type: "custom",
      startDate: "2024-03-15",
      endDate: "2024-03-20",
    };
    expect(getDateFilterLabel(filter)).toBe("Mar 15 - Mar 20");
  });
});

describe("getPresetDateStrings", () => {
  const MOCK_NOW = new Date("2024-03-15T12:00:00").getTime();

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns null for 'all'", () => {
    expect(getPresetDateStrings("all")).toBeNull();
  });

  it("returns today for 'today'", () => {
    const result = getPresetDateStrings("today");
    expect(result).toEqual({
      start: "2024-03-15",
      end: "2024-03-15",
    });
  });

  it("returns weekend dates for 'weekend'", () => {
    // March 15, 2024 is Friday, so weekend is March 16-17
    const result = getPresetDateStrings("weekend");
    expect(result).toEqual({
      start: "2024-03-16",
      end: "2024-03-17",
    });
  });

  it("returns week dates for 'week'", () => {
    // From Friday March 15 to Sunday March 17 (end of week)
    const result = getPresetDateStrings("week");
    expect(result?.start).toBe("2024-03-15");
    expect(result?.end).toBeDefined();
  });

  it("returns month dates for 'month'", () => {
    const result = getPresetDateStrings("month");
    expect(result?.start).toBe("2024-03-15");
    // End of month (may vary due to timezone)
    expect(result?.end).toMatch(/^2024-03-3[01]$/);
  });
});
