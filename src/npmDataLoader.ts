import type { Loader, LoaderContext } from "astro/loaders";
import fs from "node:fs";

import { getPackageMetadata, hasCachedMetadata } from "./npm";

export function npmDataLoader(): Loader {
    return {
        name: "npm-data-loader",

        load: async (context: LoaderContext): Promise<void> => {
            const files = fs.readdirSync("src/content/dependencies");
            const packages = files
                .filter(name => name.endsWith(".md"))
                .map(name => name.replace(/\.md$/, ""));
            const totalPackages = packages.length;

            for (const [i, pkgName] of packages.entries()) {
                context.logger.info(getProgressMessage(pkgName, i, totalPackages));

                const data = await getPackageMetadata(pkgName, context);

                const npmData = await context.parseData({
                    id: pkgName,
                    data
                });

                context.store.set({
                    id: pkgName,
                    data: npmData
                });
            }
        }
    };
}

function progress(i: number, total: number): string {
    const width = String(total).length;

    return `[${String(i + 1).padStart(width, " ")}/${total}]`;
}

function getProgressMessage(packageName: string, i: number, totalPackages: number): string {
    const prefix = progress(i, totalPackages);

    if (hasCachedMetadata(packageName)) {
        return `${prefix} skipping ${packageName} (cached)`;
    } else {
        return `${prefix} processing ${packageName}`;
    }
}
