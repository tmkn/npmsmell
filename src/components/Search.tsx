import { component$, useSignal, useTask$, useComputed$ } from "@builder.io/qwik";

import { getMockTeaserData, getTeaserData, type DependencyType } from "../npm";
import { Teaser, type TeaserProps } from "./Teaser";

export interface FrontmatterData {
    name: string;
    description: string;
    type: DependencyType;
}

interface Props {
    tiles: FrontmatterData[];
    pathPrefix: string;
    showAllInitially: boolean;
}

export const Search = component$<Props>(({ tiles: propTiles, pathPrefix, showAllInitially }) => {
    const tiles = useSignal<TeaserProps[]>([]);
    useTask$(async () => {
        const _tiles: TeaserProps[] = [];

        for (const tile of propTiles) {
            const data = await (import.meta.env.DEV
                ? getMockTeaserData(tile.name)
                : getTeaserData(tile.name));

            _tiles.push({
                ...tile,
                downloads: data.downloads,
                dependencies: data.dependencies[0],
                distinctDependencies: data.dependencies[1],
                pathPrefix
            });
        }

        tiles.value = _tiles;
    });
    const searchString = useSignal<string | undefined>(undefined);
    const filteredTiles = useComputed$<TeaserProps[]>(() => {
        const term = searchString.value;

        // user hasn't searched yet
        if (typeof term === "undefined") {
            if (showAllInitially) return tiles.value;
            else return [];
        } else {
            return tiles.value.filter(tile => {
                return tile.name.includes(term);
            });
        }
    });

    const infoText = useComputed$<string>(() => {
        if (searchString.value === "" || typeof searchString.value === "undefined") {
            return `Searching ${tiles.value.length} entries`;
        } else {
            return `Found ${filteredTiles.value.length} entries for "${searchString.value}"`;
        }
    });

    return (
        <section>
            <div class="search flex border-2 rounded xl:rounded-2xl bg-neutral-50 border-indigo-500 text-indigo-500 focus:outline-none focus:border-indigo-700">
                <div class="bg-indigo-50 rounded-l xl:rounded-l-2xl px-4 py-2 xl:py-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        ></path>
                    </svg>
                </div>
                <input
                    type="text"
                    class="outline-none w-full px-2 py-2 xl:py-4 rounded-r xl:rounded-r-2xl"
                    placeholder="Search"
                    bind:value={searchString}
                />
            </div>
            <p class="my-2 text-sm italic">{infoText}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 search-results">
                {filteredTiles.value.map(tile => (
                    <Teaser key={tile.name} {...tile} />
                ))}
            </div>
        </section>
    );
});
