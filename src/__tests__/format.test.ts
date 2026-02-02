import {
  formatEventDate,
  formatEventTime,
  formatPrice,
  formatPriceRange,
  formatResultCount,
} from "../utils/format";

describe("formatEventTime", () => {
  it("formats morning time correctly", () => {
    expect(formatEventTime("09:30:00")).toBe("9:30 AM");
  });

  it("formats afternoon time correctly", () => {
    expect(formatEventTime("14:00:00")).toBe("2:00 PM");
  });

  it("formats evening time correctly", () => {
    expect(formatEventTime("19:30:00")).toBe("7:30 PM");
  });

  it("formats midnight correctly", () => {
    expect(formatEventTime("00:00:00")).toBe("12:00 AM");
  });

  it("formats noon correctly", () => {
    expect(formatEventTime("12:00:00")).toBe("12:00 PM");
  });
});

describe("formatPrice", () => {
  it("formats USD price", () => {
    expect(formatPrice(45, "USD")).toBe("$45");
  });

  it("formats EUR price", () => {
    expect(formatPrice(50, "EUR")).toBe("€50");
  });

  it("formats GBP price", () => {
    expect(formatPrice(30, "GBP")).toBe("£30");
  });

  it("rounds decimal prices", () => {
    expect(formatPrice(45.99, "USD")).toBe("$46");
  });

  it("defaults to USD", () => {
    expect(formatPrice(100)).toBe("$100");
  });
});

describe("formatPriceRange", () => {
  it("formats price range", () => {
    expect(formatPriceRange(25, 150, "USD")).toBe("$25 - $150");
  });

  it("formats same min and max as single price", () => {
    expect(formatPriceRange(50, 50, "USD")).toBe("$50");
  });

  it("formats EUR price range", () => {
    expect(formatPriceRange(30, 100, "EUR")).toBe("€30 - €100");
  });
});

describe("formatResultCount", () => {
  it("returns 'No events' for undefined", () => {
    expect(formatResultCount(undefined)).toBe("No events");
  });

  it("returns 'No events' for 0", () => {
    expect(formatResultCount(0)).toBe("No events");
  });

  it("returns exact count for small numbers", () => {
    expect(formatResultCount(42)).toBe("42 events");
  });

  it("returns rounded count for 100+", () => {
    expect(formatResultCount(156)).toBe("150+ events");
  });

  it("returns '1000+ events' for large numbers", () => {
    expect(formatResultCount(2500)).toBe("1000+ events");
  });
});

describe("formatEventDate", () => {
  const MOCK_NOW = new Date("2024-03-15T12:00:00").getTime();

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns 'Today' for today's date", () => {
    expect(formatEventDate("2024-03-15")).toBe("Today");
  });

  it("returns 'Tomorrow' for tomorrow's date", () => {
    expect(formatEventDate("2024-03-16")).toBe("Tomorrow");
  });

  it("returns 'This [Day]' for dates within this week", () => {
    // March 15, 2024 is Friday, so March 18 (Monday) is within "this week"
    expect(formatEventDate("2024-03-18")).toBe("This Mon");
  });

  it("returns 'Next [Day]' for dates in next week", () => {
    // March 22 is next Friday
    expect(formatEventDate("2024-03-22")).toBe("Next Fri");
  });

  it("returns formatted date for dates beyond next week", () => {
    expect(formatEventDate("2024-04-15")).toBe("Mon, Apr 15");
  });
});
