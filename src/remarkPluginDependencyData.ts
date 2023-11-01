import type { Root } from "mdast";
import type { VFile } from "vfile";
import { findAndReplace } from "mdast-util-find-and-replace";
import { toString } from "mdast-util-to-string";
import { Visitor, npmOnline, OraLogger } from "@tmkn/packageanalyzer";

export function remarkDependencyData() {
    return async function (tree: Root, file: VFile) {
        //@ts-expect-error
        const name = file?.data?.astro?.frontmatter?.name;
        const textOnPage = toString(tree);
        const tokens: IMagicToken[] = [
            new DownloadToken(),
            new DependenciesToken(),
            new DistinctDependenciesToken()
        ];

        if (!name) {
            tokens.forEach(({ token }) => {
                if (textOnPage.includes(token)) {
                    throw new Error(
                        `Token ${token} was found on the page, but no name was provided in the frontmatter.`
                    );
                }
            });

            return;
        }

        for (const { token, data } of tokens) {
            if (textOnPage.includes(token)) {
                findAndReplace(tree, [[token, await data(name)]]);
            }
        }
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

// Replaces the token with dynamic data
interface IMagicToken {
    token: string;
    data: (name: string) => Promise<string>;
}

class DownloadToken implements IMagicToken {
    public token: string = "{{downloads}}";
    public async data(name: string): Promise<string> {
        return (await getWeeklyDownloads(name)).toLocaleString();
    }
}

class DependenciesToken implements IMagicToken {
    public token: string = "{{dependencies}}";
    public async data(name: string): Promise<string> {
        const [dependencies] = await getDependencies(name);

        return dependencies.toLocaleString();
    }
}

class DistinctDependenciesToken implements IMagicToken {
    public token: string = "{{distinct_dependencies}}";
    public async data(name: string): Promise<string> {
        const [, distinct] = await getDependencies(name);

        return distinct.toLocaleString();
    }
}
