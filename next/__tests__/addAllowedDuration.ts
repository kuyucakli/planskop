import { addRepeatDuration } from "@/lib/utils"

describe("addRepeatDuration", () => {
  it("adds 2 weeks to a date", () => {
    const base = new Date("2025-04-01");
    const result = addRepeatDuration(base, "2 weeks");
    expect(result.toISOString().slice(0, 10)).toBe("2025-04-15");
  });

  it("adds 1 month to a date", () => {
    const base = new Date("2025-04-01");
    const result = addRepeatDuration(base, "1 month");
    expect(result.toISOString().slice(0, 10)).toBe("2025-05-01");
  });

  it("throws on invalid duration", () => {
    const base = new Date("2025-04-01");
    expect(() => addRepeatDuration(base, "banana")).toThrow("Invalid duration");
  });
});