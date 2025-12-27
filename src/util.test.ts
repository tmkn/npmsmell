import { describe, it, expect } from "vitest";
import { calculateTrend } from "./util";

describe("calculateTrend", () => {
    it("throws if there is not enough data", () => {
        // 4 weeks * 2 * 7 days = 56 days required
        const data = Array.from({ length: 55 }, () => 100);

        expect(() => calculateTrend(data, 4)).toThrow("Not enough data to calculate trend");
    });

    it("returns increasing when recent average is higher", () => {
        const previous = Array(28).fill(100); // weeks 5–8
        const recent = Array(28).fill(120); // weeks 1–4

        const data = [...previous, ...recent];

        expect(calculateTrend(data, 4)).toBe("increasing");
    });

    it("returns decreasing when recent average is lower", () => {
        const previous = Array(28).fill(120);
        const recent = Array(28).fill(100);

        const data = [...previous, ...recent];

        expect(calculateTrend(data, 4)).toBe("decreasing");
    });

    it("returns neutral when averages are equal", () => {
        const previous = Array(28).fill(100);
        const recent = Array(28).fill(100);

        const data = [...previous, ...recent];

        expect(calculateTrend(data, 4)).toBe("neutral");
    });

    it("ignores weekday/weekend noise via averaging", () => {
        // simulate weekday/weekend oscillation
        const previous = Array.from({ length: 28 }, (_, i) =>
            i % 7 === 5 || i % 7 === 6 ? 80 : 120
        );

        const recent = Array.from({ length: 28 }, (_, i) =>
            i % 7 === 5 || i % 7 === 6 ? 90 : 130
        );

        const data = [...previous, ...recent];

        expect(calculateTrend(data, 4)).toBe("increasing");
    });

    it("works with a different week window size", () => {
        const weeks = 2;

        const previous = Array(14).fill(200);
        const recent = Array(14).fill(150);

        const data = [...previous, ...recent];

        expect(calculateTrend(data, weeks)).toBe("decreasing");
    });
});
