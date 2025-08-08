import { calculateRemainingDuration } from "@/lib/utils"

describe("Calculate Remaining Duration", ()=>{
    it("should return '2 days remaining' for ('2025-12-09T03:00:00.000+03:00', '2025-12-11T03:00:00.000+03:00')", ()=>{
        expect( calculateRemainingDuration( new Date("2025-12-09T03:00:00.000+03:00"), new Date("2025-12-11T03:00:00.000+03:00") ))
        .toBe("2 days remaining");
    })

    it("should return '1 hour remaining' for ('2025-12-11T03:00:00.000+03:00', '2025-12-11T04:20:00.000+03:00')", ()=>{
        expect( calculateRemainingDuration( new Date("2025-12-11T03:00:00.000+03:00"), new Date("2025-12-11T04:20:00.000+03:00") ))
        .toBe("1 hour remaining");
    })
})