import type { Loader, LoaderContext } from "astro/loaders";
import fs from "node:fs";

import type { MetadataStore } from "./metadatastore";

type CreateMetadataLoaderOptions<T> = {
    name: string;
    store: MetadataStore<T>;
    updateEnvKey: string;
};

export function createMetadataLoader<T extends Record<string, unknown>>({
    name,
    store,
    updateEnvKey
}: CreateMetadataLoaderOptions<T>): Loader {
    return {
        name,

        load: async (context: LoaderContext): Promise<void> => {
            const shouldUpdate = envFlag("UPDATE") || envFlag(updateEnvKey);

            const files = fs.readdirSync("src/content/dependencies");
            const packages = files
                .filter(name => name.endsWith(".md"))
                .map(name => name.replace(/\.md$/, ""));
            const totalPackages = packages.length;

            for (const [i, pkgName] of packages.entries()) {
                if (shouldUpdate) {
                    await store.delete(pkgName);
                }

                context.logger.info(
                    getProgressMessage(pkgName, i, totalPackages, name => store.exists(name))
                );

                const data = await store.get(pkgName);

                const parsedData = await context.parseData({
                    id: pkgName,
                    data
                });

                context.store.set({
                    id: pkgName,
                    data: parsedData
                });
            }
        }
    };
}

function progress(i: number, total: number): string {
    const width = String(total).length;

    return `[${String(i + 1).padStart(width, " ")}/${total}]`;
}

export function getProgressMessage(
    packageName: string,
    i: number,
    totalPackages: number,
    cacheCheck: (packageName: string) => boolean
): string {
    const prefix = progress(i, totalPackages);

    if (cacheCheck(packageName)) {
        return `${prefix} skipping ${packageName} (cached)`;
    } else {
        return `${prefix} processing ${packageName}`;
    }
}

export function envFlag(name: string) {
    return process.env[name] === "true";
}
