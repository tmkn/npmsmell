import path from "node:path";
import fs from "node:fs";
import { QueryClient } from "@tanstack/query-core";
import { Visitor, npmOnline, OraLogger, Package } from "@tmkn/packageanalyzer";
import type { LoaderContext } from "astro/loaders";
import { z } from "astro/zod";
import stringify from "fast-json-stable-stringify";
import type { TrendlineData } from "./downloadTrendDataLoader";

const cache = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            staleTime: Infinity
        }
    }
});

export const RegistryDataSchema = z.object({
    latestReleaseDate: z.string(),
    description: z.string()
});

type IRegistryData = z.infer<typeof RegistryDataSchema>;

export async function getRegistryData(name: string): Promise<IRegistryData> {
    const registryData = await cache.fetchQuery<IRegistryData>({
        queryKey: ["registry", name],
        queryFn: async ({ signal }) => {
            const response = await fetch(`https://registry.npmjs.org/${name}`, { signal });
            const data = await response.json();

            return {
                latestReleaseDate: data.time[data["dist-tags"].latest],
                description: data.description
            };
        }
    });

    return registryData;
}

export interface DependencyNode {
    name: string;
    version: string;
    dependencies: DependencyNode[];
    isLoop: boolean;
    subtreeCount: number;
}

export const DependencyNodeSchema: z.ZodType<DependencyNode> = z.lazy(() =>
    z.object({
        name: z.string(),
        version: z.string(),
        dependencies: z.array(DependencyNodeSchema),
        isLoop: z.boolean(),
        subtreeCount: z.number()
    })
);

function buildDependencyNode(pkg: Package): DependencyNode {
    const dependencies = pkg.directDependencies.map(buildDependencyNode);
    const subtreeCount = dependencies.reduce((acc, dep) => acc + 1 + dep.subtreeCount, 0);

    return {
        name: pkg.name,
        version: pkg.version,
        isLoop: pkg.isLoop,
        dependencies,
        subtreeCount
    };
}

export async function getDependencyTree(name: string): Promise<DependencyNode> {
    const visitor = new Visitor([name], npmOnline, new OraLogger());
    const root = await visitor.visit();

    return buildDependencyNode(root);
}

export const TeaserDataSchema = z.object({
    downloads: z.number(),
    dependencies: z.tuple([z.number(), z.number()])
});

type ITeaserData = z.infer<typeof TeaserDataSchema>;

export async function getWeeklyDownloads(name: string): Promise<number> {
    const downloads = await cache.fetchQuery({
        queryKey: ["downloads", name],
        queryFn: async ({ signal }) => {
            const response = await fetch(
                `https://api.npmjs.org/downloads/point/last-week/${name}`,
                { signal }
            );

            const data = await response.json();

            return data.downloads;
        }
    });

    return downloads;
}

export async function getDependencies(name: string): Promise<[number, number]> {
    const dependencies = await cache.fetchQuery<[number, number]>({
        queryKey: ["dependencies", name],
        queryFn: async () => {
            const visitor = new Visitor([name], npmOnline, new OraLogger());
            const root = await visitor.visit();
            const distinceDependencies: Set<string> = new Set();
            let count = 0;

            root.visit(pkg => {
                count += pkg.directDependencies.length;
                distinceDependencies.add(pkg.fullName);
            }, true);

            return [count, distinceDependencies.size - 1];
        }
    });

    return dependencies;
}

export async function getTeaserData(name: string): Promise<ITeaserData> {
    const downloads = await getWeeklyDownloads(name);
    const dependencies = await getDependencies(name);

    return {
        downloads,
        dependencies
    };
}

// TODO: clean up fields
// group stuff from manifest then tree and then downloads
export const PackageMetaDataSchema = TeaserDataSchema.merge(
    z.object({
        tree: DependencyNodeSchema,
        registry: RegistryDataSchema
    })
);

export type PackageMetaData = z.infer<typeof PackageMetaDataSchema>;

export async function getPackageMetadata(name: string): Promise<PackageMetaData> {
    if (hasCachedMetadata(name)) {
        return getCachedMetadata(name);
    } else {
        return resolveMetadata(name);
    }
}

const CACHE_DIR = path.join(process.cwd(), "metadata", "packages");

export function getCacheDir(name: string): string {
    return path.join(CACHE_DIR, ...name.split("/"));
}

function getCachePathForMetadata(name: string): string {
    const cacheDir = getCacheDir(name);

    return path.join(cacheDir, "metadata.json");
}

function getCachePathForTrendline(name: string): string {
    const cacheDir = getCacheDir(name);

    return path.join(cacheDir, "trendline.json");
}

export function hasCachedMetadata(name: string): boolean {
    return fs.existsSync(getCachePathForMetadata(name));
}

export function hasCachedTrendline(name: string): boolean {
    return fs.existsSync(getCachePathForTrendline(name));
}

async function getCachedMetadata(name: string): Promise<PackageMetaData> {
    const filePath = getCachePathForMetadata(name);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return data;
}

async function resolveMetadata(name: string): Promise<PackageMetaData> {
    const teaserData = await getTeaserData(name);
    const tree = await getDependencyTree(name);
    const registry = await getRegistryData(name);

    const data: PackageMetaData = {
        ...teaserData,
        tree,
        registry
    };

    // save to cache
    const cacheDirForPackage = getCacheDir(name);
    const cachePathMetdata = getCachePathForMetadata(name);

    if (!fs.existsSync(cacheDirForPackage)) {
        fs.mkdirSync(cacheDirForPackage, { recursive: true });
    }

    fs.writeFileSync(cachePathMetdata, stringify(data), "utf-8");

    return data;
}

function getDownloadTrendUrl(packageName: string): string {
    const end = new Date();
    const start = new Date();
    const durationMonths = 6;

    // Go back 6 months
    start.setMonth(end.getMonth() - durationMonths);

    const format = (d: Date) => d.toLocaleDateString("en-CA"); // YYYY-MM-DD

    return `https://api.npmjs.org/downloads/range/${format(start)}:${format(end)}/${packageName}`;
}

export async function getTrendlineData(packageName: string): Promise<TrendlineData> {
    if (hasCachedTrendline(packageName)) {
        return getCachedTrendlineData(packageName);
    } else {
        return resolveTrendlineData(packageName);
    }
}

async function getCachedTrendlineData(packageName: string): Promise<TrendlineData> {
    const filePath = getCachePathForTrendline(packageName);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return data;
}

async function resolveTrendlineData(packageName: string): Promise<TrendlineData> {
    const downloadTrend = await cache.fetchQuery<TrendlineData>({
        queryKey: ["trend", packageName],
        queryFn: async () => {
            const response = await fetch(getDownloadTrendUrl(packageName));
            const data = await response.json();
            const downloadsByDate: TrendlineData = {};

            for (const entry of data.downloads) {
                downloadsByDate[entry.day] = entry.downloads;
            }

            return downloadsByDate;
        }
    });

    //save to cache
    const cacheDirForPackage = getCacheDir(packageName);
    const cachePathTrendline = getCachePathForTrendline(packageName);

    if (!fs.existsSync(cacheDirForPackage)) {
        fs.mkdirSync(cacheDirForPackage, { recursive: true });
    }

    fs.writeFileSync(cachePathTrendline, stringify(downloadTrend), "utf-8");

    return downloadTrend;
}
