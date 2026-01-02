import path from "node:path";
import { describe, expect, test } from "vitest";

import { getCacheDir } from "./metadatastore";

describe("getCacheDir", () => {
    const baseSegments = [process.cwd(), "metadata", "packages"];

    test("returns correct path for standard package", () => {
        const name = "foo";
        const expected = path.join(...baseSegments, "foo");
        expect(getCacheDir(name)).toBe(expected);
    });

    test("returns correct path for scoped package", () => {
        const name = "@foo/bar";
        const expected = path.join(...baseSegments, "@foo", "bar");
        expect(getCacheDir(name)).toBe(expected);
    });
});
