import type { Loader, LoaderContext } from "astro/loaders";
import fs from "node:fs";
import type { PackageMetaData } from "../ingest/src/npm";

export function npmDataLoader(): Loader {
    return {
        name: "npm-data-loader",

        load: async (context: LoaderContext): Promise<void> => {
            const files = fs
                .readdirSync("metadata/packages", { withFileTypes: true })
                .filter(entry => entry.isFile() && entry.name.endsWith(".json"));
            const totalPackages = files.length;

            for (const [i, entry] of files.entries()) {
                const prefix = progress(i, totalPackages);
                const pkgName = entry.name.replace(/\.json$/, "");
                context.logger.info(`${prefix} processing ${pkgName}`);

                const data = loadMetadata(pkgName);

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

export function loadMetadata(pkgName: string): PackageMetaData {
    const fileContent = fs.readFileSync(`metadata/packages/${pkgName}.json`, "utf-8");
    const data = JSON.parse(fileContent);

    return data;
}

function progress(i: number, total: number): string {
    const width = String(total).length;

    return `[${String(i + 1).padStart(width, " ")}/${total}]`;
}
