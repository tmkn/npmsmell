// This module consolidates the way metadata for npm packages is stored and retrieved.
// First it will check if the metadata exists on the disk, if yes, it will return it,
// otherwise it will use the provided loader function to fetch the data and store it on disk.
// Metadata is never overwritten unless explicitly deleted.

import path from "node:path";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import stringify from "fast-json-stable-stringify";
import {
    getDependencyTree,
    getRegistryData,
    getTeaserData,
    resolveTrendlineData,
    type PackageMetaData
} from "../npm";
import type { TrendlineData } from "./downloadTrendDataLoader";

const METADATA_ROOT = path.join(process.cwd(), "metadata", "packages");

export function getCacheDir(pkgName: string): string {
    if (pkgName.startsWith("@")) {
        const [scope, name, ...rest] = pkgName.split("/");

        if (!scope || !name || rest.length > 0) {
            throw new Error(`Invalid scoped package name: ${pkgName}`);
        }

        return path.join(METADATA_ROOT, scope, name);
    }

    if (pkgName.includes("/")) {
        throw new Error(`Invalid package name: ${pkgName}`);
    }

    return path.join(METADATA_ROOT, pkgName);
}

type LoaderFunction<T> = (pkgName: string) => Promise<T | null>;

export class MetadataStore<T> {
    constructor(
        private readonly _fileName: string,
        private readonly _loader: LoaderFunction<T>
    ) {}

    private filePath(pkgName: string): string {
        return path.join(getCacheDir(pkgName), this._fileName);
    }

    async get(pkgName: string): Promise<T> {
        try {
            const raw = await fs.readFile(this.filePath(pkgName), "utf-8");

            return JSON.parse(raw) as T;
        } catch (err: any) {
            // only throw if error is anything but file not found
            if (err.code !== "ENOENT") throw err;
        }

        const data = await this._loader(pkgName);

        if (!data) {
            throw new Error(`Failed to load metadata for package: ${pkgName}`);
        }

        await this.write(pkgName, data);

        return data;
    }

    async write(pkgName: string, data: T): Promise<void> {
        const filePath = this.filePath(pkgName);

        await fs.mkdir(path.dirname(filePath), { recursive: true });

        try {
            await fs.writeFile(filePath, stringify(data), {
                encoding: "utf-8",
                flag: "wx" // fail if exists
            });
        } catch (err: any) {
            if (err.code !== "EEXIST") throw err;
        }
    }

    async delete(pkgName: string): Promise<void> {
        try {
            await fs.unlink(this.filePath(pkgName));
        } catch (err: any) {
            if (err.code !== "ENOENT") throw err;
        }
    }

    exists(pkgName: string): boolean {
        try {
            fsSync.accessSync(this.filePath(pkgName));
            return true;
        } catch {
            return false;
        }
    }
}

export const packageMetadataStore = new MetadataStore<PackageMetaData>(
    "metadata.json",
    async pkgName => {
        const teaserData = await getTeaserData(pkgName);
        const tree = await getDependencyTree(pkgName);
        const registry = await getRegistryData(pkgName);

        return {
            ...teaserData,
            tree,
            registry
        };
    }
);

export const trendlineStore = new MetadataStore<TrendlineData>("trendline.json", async pkgName => {
    return resolveTrendlineData(pkgName);
});
