import type { TeaserProps } from "../src/components/search/Teaser";

export function createMockTile({
    name = "Mock Package",
    description = "A mock package",
    type = "trivial",
    downloads = 1000,
    dependencies = 5,
    distinctDependencies = 5,
    pathPrefix = "/packages/",
    searchString
}: Partial<TeaserProps>): TeaserProps {
    return {
        name,
        description,
        type,
        downloads,
        dependencies,
        distinctDependencies,
        pathPrefix,
        ...(searchString !== undefined ? { searchString } : {})
    };
}
