import { getCollection } from "astro:content";
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
    uselessDependency,
    type DependencyType
} from "./content/config";

dayjs.extend(relativeTime);

export interface ISection {
    title: string;
    subtitle: string;
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
            return getDetailsForObsoleteJS(data);
        case "obsolete-node":
            return getDetailsForObsoleteNode(data);
    }
}

async function createSharedDetails(data: FrontMatterData): Promise<IData> {
    const baseData = baseParams.parse(data);
    const [{ latestReleaseDate, description }, downloadCount, dependencies] = await Promise.all([
        getNpmData(baseData.name),
        getWeeklyDownloads(baseData.name),
        getDependencies(baseData.name)
    ]);
    const releaseOffset = dayjs(latestReleaseDate).fromNow();

    return {
        name: "foo",
        description: description,
        sections: [
            {
                title: downloadCount.toLocaleString(),
                subtitle: "Weekly Downloads"
            },
            {
                title: dependencies.toLocaleString(),
                subtitle: "Dependencies"
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

async function getDetailsForObsoleteJS(data: FrontMatterData): Promise<IData> {
    const obsoleteJSData = obsoleteJSDependency.parse(data);
    const sharedData = await createSharedDetails(obsoleteJSData);
    const browserSupport = getBrowserSupport(obsoleteJSData.implementation);

    return {
        ...sharedData,
        sections: [
            ...sharedData.sections,
            {
                title: "Obsolete",
                subtitle: `This dependency re-creates a native JavaScript API. It is recommended to use the native API instead`
            },
            {
                title: browserSupport,
                subtitle: "natively supported"
            }
        ]
    };
}

async function getDetailsForObsoleteNode(data: FrontMatterData): Promise<IData> {
    const obsoleteNodeData = obsoleteNodeDependency.parse(data);
    const sharedData = await createSharedDetails(obsoleteNodeData);

    return {
        ...sharedData,
        sections: [
            ...sharedData.sections,
            {
                title: "Obsolete",
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

async function getWeeklyDownloads(name: string): Promise<number> {
    const response = await fetch(`https://api.npmjs.org/downloads/point/last-week/${name}`);
    const data = await response.json();

    return data.downloads;
}

async function getDependencies(name: string): Promise<number> {
    const visitor = new Visitor([name], npmOnline, new OraLogger());
    const root = await visitor.visit();
    let count = 0;

    root.visit(pkg => {
        count += pkg.directDependencies.length;
    }, true);

    return count;
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

interface ITeaserData {
    name: string;
    description: string;
    type: DependencyType;
    downloads: number;
    dependencies: number;
}

export async function getTeaserData(name: string): Promise<ITeaserData> {
    const { description } = await getNpmData(name);
    const downloads = await getWeeklyDownloads(name);
    const dependencies = await getDependencies(name);
    const allDependencies = await getCollection("dependencies");
    const dependency = allDependencies.find(dep => dep.data.name === name);

    if (!dependency) {
        throw new Error(`Dependency ${name} not found`);
    }

    return {
        name,
        description,
        type: dependency.data.type,
        downloads,
        dependencies
    };
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

export function getDescription({ name, type }: FrontMatterData): string {
    switch (type) {
        case "trivial":
            return `Using ${name} is not recommended. The provided functionality does not warrant its own package.`;
        case "obsolete-js":
            return `Using ${name} is not recommended. This dependency re-creates a native JavaScript API. It is recommended to use the native API instead.`;
        case "obsolete-node":
            return `Using ${name} is not recommended. This dependency re-creates a native Node.js API. It is recommended to use the native API instead.`;
    }
}
