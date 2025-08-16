import { fillHoursInbetween } from "@/components/charts/ChartFamousDailyRoutines";


describe("fill hours", () => {
    test("start hour < end hour", () => {
        expect(fillHoursInbetween("21:00", "23:00")).toEqual([21, 22, 23]);
    })


    test("start hour > end hour ", () => {
        expect(fillHoursInbetween("21:00", "00:00")).toEqual([21, 22, 23, 0]);
    })

    test("hour 00:00", () => {
        expect(fillHoursInbetween("00:00", "03:00")).toEqual([0, 1, 2, 3]);
    })

})