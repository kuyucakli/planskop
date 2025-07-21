import { addAllowedDuration } from "@/lib/utils"

describe("addAllowedDuration", () => {
  it("adds 2 weeks to a date", () => {
    const base = new Date("2025-04-01");
    const result = addAllowedDuration(base, "2 weeks");
    expect(result.toISOString().slice(0, 10)).toBe("2025-04-15");
  });

  it("adds 1 month to a date", () => {
    const base = new Date("2025-04-01");
    const result = addAllowedDuration(base, "1 month");
    expect(result.toISOString().slice(0, 10)).toBe("2025-05-01");
  });

  it("throws on invalid duration", () => {
    const base = new Date("2025-04-01");
    expect(() => addAllowedDuration(base, "banana")).toThrow("Invalid duration");
  });
});