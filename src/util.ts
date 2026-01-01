export type Trend = "increasing" | "decreasing" | "neutral";

export const TrendWeeksDefault = 8;

export function calculateTrend(dailyDownloads: number[], weeks = TrendWeeksDefault): Trend {
    const daysPerWeek = 7;
    const windowSize = weeks * daysPerWeek;

    if (dailyDownloads.length < windowSize * 2) {
        throw new Error("Not enough data to calculate trend");
    }

    const recent = dailyDownloads.slice(-windowSize);
    const previous = dailyDownloads.slice(-windowSize * 2, -windowSize);

    const avg = (arr: number[]) => arr.reduce((sum, v) => sum + v, 0) / arr.length;

    const avgRecent = avg(recent);
    const avgPrevious = avg(previous);

    if (avgRecent > avgPrevious) return "increasing";

    if (avgRecent < avgPrevious) return "decreasing";

    return "neutral";
}
