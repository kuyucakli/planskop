import { timeStrToMinutes } from '@/lib/utils';

describe("convert time str to minutes", () => {
    it("should return 0 for '00:00'", () => {
        expect(timeStrToMinutes("00:00")).toBe(0);
    });

    it("should return 60 for '01:00'", () => {
        expect(timeStrToMinutes("01:00")).toBe(60);
    });

    it("should return 120 for '02:00'", () => {
        expect(timeStrToMinutes("02:00")).toBe(120);
    });

    it("should return 180 for '03:00'", () => {
        expect(timeStrToMinutes("03:00")).toBe(180);
    });

    it("should return 240 for '04:00'", () => {
        expect(timeStrToMinutes("04:00")).toBe(240);
    });

    it("should return 300 for '05:00'", () => {
        expect(timeStrToMinutes("05:00")).toBe(300);
    });

    it("should return 360 for '06:00'", () => {
        expect(timeStrToMinutes("06:00")).toBe(360);
    });

    it("should return 420 for '07:00'", () => {
        expect(timeStrToMinutes("07:00")).toBe(420);
    });

    it("should return 480 for '08:00'", () => {
        expect(timeStrToMinutes("08:00")).toBe(480);
    });

    it("should return 540 for '09:00'", () => {
        expect(timeStrToMinutes("09:00")).toBe(540);
    });

    it("should return 600 for '10:00'", () => {
        expect(timeStrToMinutes("10:00")).toBe(600);
    });

    it("should return 660 for '11:00'", () => {
        expect(timeStrToMinutes("11:00")).toBe(660);
    });

    it("should return 720 for '12:00'", () => {
        expect(timeStrToMinutes("12:00")).toBe(720);
    });

    it("should return 780 for '13:00'", () => {
        expect(timeStrToMinutes("13:00")).toBe(780);
    });

    it("should return 840 for '14:00'", () => {
        expect(timeStrToMinutes("14:00")).toBe(840);
    });
    it("should return 15 for '00:15'", () => {
        expect(timeStrToMinutes("00:15")).toBe(15);
    });


})