import { z } from "zod";
import { Visitor, npmOnline, OraLogger } from "@tmkn/packageanalyzer";

export const baseParams = z.object({
    name: z.string(),
    description: z.string()
});

export const uselessDependency = baseParams.extend({
    type: z.literal("trivial")
});

export const obsoleteJSDependency = baseParams.extend({
    type: z.literal("obsolete-js"),
    implementation: z.string()
});

export const obsoleteNodeDependency = baseParams.extend({
    type: z.literal("obsolete-node"),
    date: z.date(),
    version: z.string()
});

export const DependencyTypes = z.union([
    uselessDependency,
    obsoleteJSDependency,
    obsoleteNodeDependency
]);

type _DependencyTypes = z.infer<typeof DependencyTypes>;
export type DependencyType = _DependencyTypes["type"];

interface ITeaserData {
    downloads: number;
    dependencies: [number, number];
}

export async function getTeaserData(name: string): Promise<ITeaserData> {
    const downloads = await getWeeklyDownloads(name);
    const dependencies = await getDependencies(name);

    return {
        downloads,
        dependencies
    };
}

export async function getMockTeaserData(name: string): Promise<ITeaserData> {
    return {
        downloads: 1000,
        dependencies: [10, 7]
    };
}

export async function getWeeklyDownloads(name: string): Promise<number> {
    const response = await fetch(`https://api.npmjs.org/downloads/point/last-week/${name}`);
    const data = await response.json();

    return data.downloads;
}

export async function getDependencies(name: string): Promise<[number, number]> {
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
