import type { Loader, LoaderContext } from "astro/loaders";
import fs from "node:fs";

import { getPackageMetaData } from "./npm";

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
                context.logger.info(`[${i + 1}/${totalPackages}] processing ${pkgName}`);

                const data = await getPackageMetaData(pkgName);

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
