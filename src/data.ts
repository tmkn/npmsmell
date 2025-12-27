import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import bcd from "@mdn/browser-compat-data" assert { type: "json" };
import get from "lodash/get";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
    baseParams,
    obsoleteJSDependency,
    obsoleteNodeDependency,
    uselessDependency
} from "./types";
import { calculateTrend, type Trend } from "./util";

dayjs.extend(relativeTime);

export interface ISection {
    title: string;
    subtitle: string;
    wobble?: boolean;
    sparkline?: number[];
    trend?: Trend;
}

export interface IData {
    name: string;
    description: string;
    sections: ISection[];
}

export type FrontMatterData = CollectionEntry<"dependencies">["data"];

export function getDetails(data: FrontMatterData): Promise<IData> {
    switch (data.type) {
        case "trivial":
            return getDetailsForTrivial(data);
        case "obsolete-js":
            return getDetailsForOutdatedJS(data);
        case "obsolete-node":
            return getDetailsForOutdatedNode(data);
    }
}

function sortDownloadsByDate(data: Record<string, number>): [string, number][] {
    return Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
}

function aggregateWeekly(daily: [string, number][]): number[] {
    const weeks = new Map<string, { total: number; days: number }>();

    for (const [dateStr, count] of daily) {
        const date = new Date(dateStr);

        const day = date.getUTCDay() || 7;
        const monday = new Date(date);
        monday.setUTCDate(date.getUTCDate() - (day - 1));

        const weekKey = monday.toISOString().slice(0, 10);

        const entry = weeks.get(weekKey) ?? { total: 0, days: 0 };
        entry.total += count;
        entry.days += 1;
        weeks.set(weekKey, entry);
    }

    return [...weeks.entries()]
        .filter(([, { days }]) => days === 7) // ✅ only full weeks
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, { total }]) => total);
}

async function createSharedDetails(data: FrontMatterData): Promise<IData> {
    const baseData = baseParams.parse(data);
    const npmData = await getEntry("npmData", baseData.name);

    if (!npmData) {
        throw new Error(`No npmData found for ${baseData.name}`);
    }

    const {
        registry: { latestReleaseDate },
        downloads: downloadCount,
        dependencies
    } = npmData.data;

    const releaseOffset = dayjs(latestReleaseDate).fromNow();

    // download trend sparkline
    const downloadTrendData = await getEntry("trends", baseData.name);
    const daily = sortDownloadsByDate(downloadTrendData?.data ?? {});
    const sparkline = aggregateWeekly(daily);
    const trend = calculateTrend(
        daily.map(([, count]) => count),
        8
    );

    return {
        name: "foo",
        description: baseData.description,
        sections: [
            {
                title: downloadCount.toLocaleString(),
                subtitle: "Weekly Downloads",
                sparkline,
                trend
            },
            {
                title: getDependencyString(dependencies),
                subtitle: "Dependencies",
                wobble: data.type === "trivial" && dependencies[0] > 0
            },
            {
                title: releaseOffset,
                subtitle: `Latest Release`
            }
        ]
    };
}

async function getDetailsForTrivial(data: FrontMatterData): Promise<IData> {
    const trivialData = uselessDependency.parse(data);
    const sharedData = await createSharedDetails(trivialData);

    return {
        ...sharedData,
        sections: [
            ...sharedData.sections,
            {
                title: "Trivial",
                subtitle: "Better as a utility function"
            }
        ]
    };
}

async function getDetailsForOutdatedJS(data: FrontMatterData): Promise<IData> {
    const obsoleteJSData = obsoleteJSDependency.parse(data);
    const sharedData = await createSharedDetails(obsoleteJSData);
    const browserSupport = getBrowserSupport(obsoleteJSData.implementation);

    return {
        ...sharedData,
        sections: [
            ...sharedData.sections,
            {
                title: "Outdated",
                subtitle: `Switch to the native implementation.`
            },
            {
                title: browserSupport,
                subtitle: "natively supported"
            }
        ]
    };
}

async function getDetailsForOutdatedNode(data: FrontMatterData): Promise<IData> {
    const obsoleteNodeData = obsoleteNodeDependency.parse(data);
    const sharedData = await createSharedDetails(obsoleteNodeData);

    return {
        ...sharedData,
        sections: [
            ...sharedData.sections,
            {
                title: "Outdated",
                subtitle: `Switch to the native implementation.`
            },
            {
                title: `Node.js ${obsoleteNodeData.version}`,
                subtitle: "First version with native support"
            },
            {
                title: dayjs(obsoleteNodeData.date).fromNow(),
                subtitle: "added to Node.js"
            }
        ]
    };
}

function getBrowserSupport(id: string): string {
    const browsers: string[] = ["chrome", "firefox", "safari", "nodejs"];

    const supportedSinceVersion = browsers.map(browser => {
        const supportedSince = get(
            bcd,
            `${id}.__compat.support.${browser}.version_added`
        ) as any as string;

        return { browser, addedIn: supportedSince };
    });

    const supportedSinceVersionString = supportedSinceVersion.map(({ browser, addedIn }) => {
        const releaseDate = getBrowserReleaseDate(browser, addedIn);

        return {
            browser,
            addedIn,
            release_date: releaseDate
        };
    });

    // get youngest release date
    const youngestReleaseDate = supportedSinceVersionString.reduce((acc, { release_date }) => {
        if (release_date === undefined) {
            return acc;
        }

        return dayjs(release_date).isAfter(dayjs(acc)) ? release_date : acc;
    }, "2000-01-01");

    const _browsers = supportedSinceVersionString
        .filter(({ release_date }) => {
            return release_date !== undefined;
        })
        .map(({ browser }) => browser)
        .join(", ");

    return `since ${dayjs(youngestReleaseDate).fromNow(true)} (${_browsers})`;
}

function getBrowserReleaseDate(browser: string, version: string): string | undefined {
    const releases = get(bcd, `browsers.${browser}.releases`) as any;

    return releases[version].release_date;
}

function getDependencyString([dependencies, distinct]: [number, number]): string {
    if (dependencies === distinct) {
        return `${dependencies}`;
    }

    return `${dependencies} (${distinct} distinct)`;
}

export async function getDependencyCollection() {
    const dependencies = await getCollection("dependencies");

    return dependencies.sort((a, b) =>
        a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase())
    );
}
