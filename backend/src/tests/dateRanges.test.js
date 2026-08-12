import { describe, expect, it } from "vitest";

import { getUtcWeekRange } from "../utils/dateRanges.js";

describe("getUtcWeekRange", () => {
  it("returns the current Sunday and the following Sunday", () => {
    const referenceDate = new Date("2026-08-05T15:30:00.000Z");

    const result = getUtcWeekRange(referenceDate);

    expect(result).toEqual({
      weekStart: new Date("2026-08-02T00:00:00.000Z"),
      nextWeekStart: new Date("2026-08-09T00:00:00.000Z"),
    });
  });

  it("does not modify the reference date", () => {
    const referenceDate = new Date("2026-08-05T15:30:00.000Z");
    const originalTime = referenceDate.getTime();

    getUtcWeekRange(referenceDate);

    expect(referenceDate.getTime()).toBe(originalTime);
  });
});
