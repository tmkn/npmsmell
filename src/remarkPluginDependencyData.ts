import type { Root } from "mdast";
import type { VFile } from "vfile";
import { findAndReplace } from "mdast-util-find-and-replace";
import { toString } from "mdast-util-to-string";
import { getDependencies, getWeeklyDownloads } from "./npm";

export function remarkDependencyData() {
    return async function (tree: Root, file: VFile) {
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
