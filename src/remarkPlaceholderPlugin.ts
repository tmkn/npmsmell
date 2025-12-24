import type { Root } from "mdast";
import type { VFile } from "vfile";
import { findAndReplace } from "mdast-util-find-and-replace";
import { toString } from "mdast-util-to-string";

import { loadMetadata } from "./npmDataLoader";

interface IPlaceholderToken {
    token: string;
    data: (name: string) => Promise<string>;
}

const PLACEHOLDER_TOKENS: IPlaceholderToken[] = [
    {
        token: "{{downloads}}",
        data: async name => {
            const data = loadMetadata(name);

            return data.downloads.toLocaleString("en-US");
        }
    },
    {
        token: "{{dependencies}}",
        data: async name => {
            const data = loadMetadata(name);

            return data.dependencies[0].toLocaleString("en-US");
        }
    },
    {
        token: "{{distinct_dependencies}}",
        data: async name => {
            const data = loadMetadata(name);

            return data.dependencies[1].toLocaleString("en-US");
        }
    }
];

export function remarkPlaceholderPlugin() {
    return async function (tree: Root, file: VFile) {
        const name: string | undefined = file?.data?.astro?.frontmatter?.name;
        if (!name) {
            throw new Error(`No name was provided in the frontmatter.`);
        }

        const textOnPage = toString(tree);
        const replacements: [string, string][] = [];

        for (const { token, data } of PLACEHOLDER_TOKENS) {
            if (textOnPage.includes(token)) {
                replacements.push([token, await data(name)]);
            }
        }

        if (replacements.length > 0) {
            findAndReplace(tree, replacements);
        }
    };
}
