import { timeBasedDurationToMinutes } from "@/lib/utils";


describe("extract minutes from duration", () => {
    it("should return 120 for '2 hours 0 minutes'", () => {
        expect(timeBasedDurationToMinutes("2 hours 0 minutes")).toBe(120);
    });

    it("should return 90 for '1 hour 30 minutes'", () => {
        expect(timeBasedDurationToMinutes("1 hour 30 minutes")).toBe(90);
    });

    it("should return 60 for '1 hour'", () => {
        expect(timeBasedDurationToMinutes("1 hour")).toBe(60);
    });

    it("should return 30 for '30 minutes'", () => {
        expect(timeBasedDurationToMinutes("30 minutes")).toBe(30);
    });

    it("should return 0 for '0 hours 0 minutes'", () => {
        expect(timeBasedDurationToMinutes("0 hours 0 minutes")).toBe(0);
    });

    it("shouldreturn 210 for 3½ hours", () => {
        expect(timeBasedDurationToMinutes("3½ hours")).toBe(210);
    });

    it("should return 0 for invalid duration", () => {
        expect(timeBasedDurationToMinutes("invalid duration")).toBe(undefined);
    });

});