import type { CollectionEntry } from "astro:content";
import bcd from "@mdn/browser-compat-data" assert { type: "json" };
import _ from "lodash";
const { get } = _;
import { Visitor, npmOnline, OraLogger, Package } from "@tmkn/packageanalyzer";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
    baseParams,
    obsoleteJSDependency,
    obsoleteNodeDependency,
    uselessDependency
} from "./types";
import { getDependencies, getWeeklyDownloads } from "./npm";

dayjs.extend(relativeTime);

export interface ISection {
    title: string;
    subtitle: string;
    wobble?: boolean;
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

async function createSharedDetails(data: FrontMatterData): Promise<IData> {
    const baseData = baseParams.parse(data);
    const [{ latestReleaseDate }, downloadCount, dependencies] = await Promise.all([
        getNpmData(baseData.name),
        getWeeklyDownloads(baseData.name),
        getDependencies(baseData.name)
    ]);
    const releaseOffset = dayjs(latestReleaseDate).fromNow();

    return {
        name: "foo",
        description: baseData.description,
        sections: [
            {
                title: downloadCount.toLocaleString(),
                subtitle: "Weekly Downloads"
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
                subtitle: "The provided functionality does not warrant its own package"
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
                subtitle: `This dependency re-creates a native JavaScript API. It is recommended to use the native API instead`
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
                title: "Outedated",
                subtitle: `This dependency re-creates a native Node.js API. It is recommended to use the native API instead`
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

interface INpmData {
    latestReleaseDate: string;
    description: string;
}

async function getNpmData(name: string): Promise<INpmData> {
    const response = await fetch(`https://registry.npmjs.org/${name}`);
    const data = await response.json();

    return {
        latestReleaseDate: data.time[data["dist-tags"].latest],
        description: data.description
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

export async function getDependencyTree(name: string): Promise<string[]> {
    const visitor = new Visitor([name], npmOnline, new OraLogger());
    const root = await visitor.visit();
    let dependencies: string[] = [];

    root.visit(pkg => {
        const ident = getIdent(pkg);
        const spaces = " ".repeat(ident);

        dependencies = [...dependencies, spaces + pkg.name];
    }, true);

    return dependencies;
}

function getIdent(pkg: Package): number {
    let ident = 0;
    let current = pkg;

    while (current.parent) {
        ident += 2;
        current = current.parent;
    }

    return ident;
}
