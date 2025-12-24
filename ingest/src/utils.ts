import path from "path";
import fs from "fs";

import type { PackageMetaData } from "./npm.js";

const OUTPUT_PATH = path.join(process.cwd(), "metadata", "packages");

export function getPackagesFromContentDirectory(): string[] {
    const contentFolder = path.join(process.cwd(), "src/content/dependencies");
    const packages = fs.readdirSync(contentFolder, { withFileTypes: true });
    return packages
        .filter(entry => entry.isFile())
        .filter(entry => entry.name.endsWith(".md"))
        .map(entry => entry.name.replace(/\.md$/, ""));
}

export function progress(i: number, total: number): string {
    const width = String(total).length;

    return `[${String(i + 1).padStart(width, " ")}/${total}]`;
}

export function saveToDisk(pkgName: string, data: PackageMetaData): void {
    const outputFilePath = path.join(OUTPUT_PATH, `${pkgName}.json`);

    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), "utf-8");
}
