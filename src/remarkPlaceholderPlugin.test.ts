import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Root } from "mdast";
import type { VFile } from "vfile";
import { toString } from "mdast-util-to-string";

import { remarkPlaceholderPlugin } from "./remarkPlaceholderPlugin";
import type { getWeeklyDownloads, getDependencies } from "./npm";

const mocks = vi.hoisted(() => {
    return {
        mockGetWeeklyDownloads: vi.fn<typeof getWeeklyDownloads>(),
        mockGetDependencies: vi.fn<typeof getDependencies>()
    };
});

vi.mock("./npm", () => ({
    getWeeklyDownloads: mocks.mockGetWeeklyDownloads,
    getDependencies: mocks.mockGetDependencies
}));

const createMockRoot = (text: string): Root => {
    return {
        type: "root",
        children: [{ type: "text", value: text }]
    } as unknown as Root;
};

describe("remarkPlaceholderPlugin", () => {
    let file: VFile;

    beforeEach(() => {
        vi.resetAllMocks();
        file = {
            data: { astro: { frontmatter: { name: "example-package" } } }
        } as unknown as VFile;
    });

    it("replaces {{downloads}} correctly", async () => {
        const tree = createMockRoot("Downloads: {{downloads}}");

        mocks.mockGetWeeklyDownloads.mockResolvedValue(9999);

        const plugin = remarkPlaceholderPlugin();
        await plugin(tree, file);

        const text = toString(tree);
        expect(text).toEqual("Downloads: 9,999");
        expect(mocks.mockGetWeeklyDownloads).toHaveBeenCalledWith("example-package");
    });

    it("replaces {{dependencies}} correctly", async () => {
        const tree = createMockRoot("Dependencies: {{dependencies}}");

        mocks.mockGetDependencies.mockResolvedValue([42, 0]);
        const plugin = remarkPlaceholderPlugin();
        await plugin(tree, file);

        const text = toString(tree);
        expect(text).toEqual("Dependencies: 42");
        expect(mocks.mockGetDependencies).toHaveBeenCalledWith("example-package");
    });

    it("replaces {{distinct_dependencies}} correctly", async () => {
        const tree = createMockRoot("Distinct: {{distinct_dependencies}}");

        mocks.mockGetDependencies.mockResolvedValue([0, 7]);
        const plugin = remarkPlaceholderPlugin();
        await plugin(tree, file);

        const text = toString(tree);
        expect(text).toEqual("Distinct: 7");
        expect(mocks.mockGetDependencies).toHaveBeenCalledWith("example-package");
    });

    it("throws an error if name is missing", async () => {
        const tree = createMockRoot("");
        const file: VFile = {} as unknown as VFile;

        const plugin = remarkPlaceholderPlugin();

        await expect(plugin(tree, file)).rejects.toThrow(
            "No name was provided in the frontmatter."
        );
    });
});
