import { resolvePath } from "@/lib/utils";


describe("resolvePath", () => {
    it("should return the value at the given path", () => {
        const obj = { a: ["value"] };
        expect(resolvePath(obj, "a")).toStrictEqual(["value"]);
    });

    it("should return the value at the given path", () => {
        const obj = { a: { b: { c: 42 } } };
        expect(resolvePath(obj, "a.b.c")).toBe(42);
    });

    it("should return undefined for non-existent paths", () => {
        const obj = { a: { b: { c: 42 } } };
        expect(resolvePath(obj, "a.b.d")).toBeUndefined();
    });

    it("should handle empty paths", () => {
        const obj = { a: { b: { c: 42 } } };
        expect(resolvePath(obj, "")).toBeUndefined();
    });

    it("should handle paths with array indices", () => {
        const obj = { a: [{ b: 1 }, { b: 2 }] };
        expect(resolvePath(obj, "a.1.b")).toBe(2);
    });

    it("should return undefined for invalid paths", () => {
        const obj = { a: { b: 1 } };
        expect(resolvePath(obj, "a.b.c.d")).toBeUndefined();
    });

    it("should work with zod formatted error obj", () => {
        const obj = {
            "_errors": [],
            "title": {
                "_errors": [
                    "Required"
                ]
            },
            "content": {
                "_errors": [
                    "Required"
                ]
            },
            "rrule": {
                "_errors": [
                    "Required"
                ]
            },
            "dtstart": {
                "_errors": [
                    "Required"
                ]
            },
            "until": {
                "_errors": [
                    "Required"
                ]
            },
            "userId": {
                "_errors": [
                    "Required"
                ]
            },
            "timezone": {
                "_errors": [
                    "Required"
                ]
            },
            "slots": {
                "0": {
                    "_errors": [],
                    "at": {
                        "_errors": [
                            "hi"
                        ]
                    },
                    "for": {
                        "_errors": [
                            "Invalid enum value. Expected '15 min' | '30 min' | '45 min' | '1 hour' | '1 hour 15 min' | '1½ hours' | '1 hour 45 min' | '2 hours' | '2 hours 15 min' | '2½ hours' | '2 hours 45 min' | '3 hours' | '3 hours 15 min' | '3½ hours' | '3 hours 45 min' | '4 hours' | '4 hours 15 min' | '4½ hours' | '4 hours 45 min' | '5 hours' | '5 hours 15 min' | '5½ hours' | '5 hours 45 min' | '6 hours', received ''"
                        ]
                    }
                },
                "_errors": []
            }
        }
        expect(resolvePath(obj, "slots[0].at")).toStrictEqual({ "_errors": ["hi"] });


    })
})