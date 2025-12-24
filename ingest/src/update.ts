import { getPackageMetaData } from "./npm.js";
import { getPackagesFromContentDirectory, progress, saveToDisk } from "./utils.js";

async function main() {
    const packages = getPackagesFromContentDirectory();
    const totalPackages = packages.length;

    for (const [i, pkgName] of packages.entries()) {
        const prefix = progress(i, totalPackages);
        console.log(`${prefix} processing ${pkgName}`);

        const data = await getPackageMetaData(pkgName);

        saveToDisk(pkgName, data);
    }
}

await main();
