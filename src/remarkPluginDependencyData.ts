import type { Root } from "mdast";
import type { VFile } from "vfile";
import { findAndReplace } from "mdast-util-find-and-replace";
import { Visitor, npmOnline, OraLogger, Package } from "@tmkn/packageanalyzer";

export function remarkDependencyData() {
    return async function (tree: Root, foo: VFile) {
        //@ts-expect-error
        const name = foo?.data?.astro?.frontmatter?.name;

        const downloads = await getWeeklyDownloads(name);
        const [dependencies, distinct] = await getDependencies(name);

        findAndReplace(tree, [
            [/{{downloads}}/g, downloads.toLocaleString()],
            [/{{dependencies}}/g, dependencies.toLocaleString()],
            [/{{distinct_dependencies}}/g, distinct.toLocaleString()]
        ]);
    };
}

async function getWeeklyDownloads(name: string): Promise<number> {
    const response = await fetch(`https://api.npmjs.org/downloads/point/last-week/${name}`);
    const data = await response.json();

    return data.downloads;
}

async function getDependencies(name: string): Promise<[number, number]> {
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
