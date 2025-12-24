import { QueryClient } from "@tanstack/query-core";
import { Visitor, npmOnline, OraLogger, Package } from "@tmkn/packageanalyzer";
import { z } from "astro/zod";

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
            const data: any = await response.json();

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

            const data: any = await response.json();

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

export async function getPackageMetaData(name: string): Promise<PackageMetaData> {
    const teaserData = await getTeaserData(name);
    const tree = await getDependencyTree(name);
    const registry = await getRegistryData(name);

    return {
        ...teaserData,
        tree,
        registry
    };
}
