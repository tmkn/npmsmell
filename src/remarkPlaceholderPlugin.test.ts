import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Root } from "mdast";
import type { VFile } from "vfile";
import { toString } from "mdast-util-to-string";

import { remarkPlaceholderPlugin } from "./remarkPlaceholderPlugin";
import type { loadMetadata } from "./npmDataLoader";
import type { PackageMetaData } from "../ingest/src/npm";

const mocks = vi.hoisted(() => {
    return {
        mockLoadMetadata: vi.fn<typeof loadMetadata>()
    };
});

vi.mock(import("./npmDataLoader"), () => ({
    loadMetadata: mocks.mockLoadMetadata
}));

function createMockPackageMetaData(): PackageMetaData {
    return {
        downloads: 0,
        dependencies: [0, 0],
        tree: {
            name: "example-package",
            version: "1.0.0",
            dependencies: [],
            subtreeCount: 0,
            isLoop: false
        },
        registry: {
            latestReleaseDate: new Date("2026-01-01").toISOString(),
            description: "A sample package"
        }
    };
}

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
        const mockPackageData = createMockPackageMetaData();
        mockPackageData.downloads = 9999;

        mocks.mockLoadMetadata.mockReturnValue(mockPackageData);

        const plugin = remarkPlaceholderPlugin();
        await plugin(tree, file);

        const text = toString(tree);
        expect(text).toEqual("Downloads: 9,999");
        expect(mocks.mockLoadMetadata).toHaveBeenCalledWith("example-package");
    });

    it("replaces {{dependencies}} correctly", async () => {
        const tree = createMockRoot("Dependencies: {{dependencies}}");
        const mockPackageData = createMockPackageMetaData();
        mockPackageData.dependencies = [42, 0];

        mocks.mockLoadMetadata.mockReturnValue(mockPackageData);
        const plugin = remarkPlaceholderPlugin();
        await plugin(tree, file);

        const text = toString(tree);
        expect(text).toEqual("Dependencies: 42");
        expect(mocks.mockLoadMetadata).toHaveBeenCalledWith("example-package");
    });

    it("replaces {{distinct_dependencies}} correctly", async () => {
        const tree = createMockRoot("Distinct: {{distinct_dependencies}}");
        const mockPackageData = createMockPackageMetaData();
        mockPackageData.dependencies = [0, 7];

        mocks.mockLoadMetadata.mockReturnValue(mockPackageData);
        const plugin = remarkPlaceholderPlugin();
        await plugin(tree, file);

        const text = toString(tree);
        expect(text).toEqual("Distinct: 7");
        expect(mocks.mockLoadMetadata).toHaveBeenCalledWith("example-package");
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
