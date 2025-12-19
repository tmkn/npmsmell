import { type FC, useState, useMemo, useEffect } from "react";

import { type DependencyType } from "../../types.ts";
import { Teaser, type TeaserProps } from "./Teaser.tsx";

export interface FrontmatterData {
    name: string;
    description: string;
    type: DependencyType;
}

interface Props {
    tiles: TeaserProps[];
    // when true lists all entries on empty search
    showAllOnEmpty: boolean;
}

export const SearchWidget: FC<Props> = ({ tiles, showAllOnEmpty }) => {
    const [searchString, setSearchString] = useState<string>("");
    const filteredTiles = useMemo<TeaserProps[]>(() => {
        if (searchString.trim() === "" && showAllOnEmpty) return tiles;
        else if (searchString.trim() === "") return [];
        else {
            return tiles.filter(tile => {
                return tile.name.includes(searchString);
            });
        }
    }, [searchString, tiles]);

    const infoText = useMemo<string>(() => {
        if (searchString.trim() === "") {
            return `Searching ${tiles.length} entries`;
        } else {
            return `Found ${filteredTiles.length} entries for "${searchString}"`;
        }
    }, [searchString, tiles, filteredTiles]);

    useEffect(() => {
        // needs to be added so that E2E tests can wait for search to be hydrated
        document.documentElement.dataset.searchHydrated = "true";
    }, []);

    return (
        <section>
            <div className="text-search bg-search-bg flex rounded border-2 xl:rounded-2xl">
                <div className="bg-search-icon-bg rounded-l px-4 py-2 pr-0 xl:rounded-l-2xl xl:py-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        ></path>
                    </svg>
                </div>
                <input
                    type="text"
                    className="w-full rounded-r px-2 py-2 outline-none xl:rounded-r-2xl xl:py-4"
                    placeholder="Search"
                    value={searchString}
                    onChange={e => {
                        setSearchString(e.target.value);
                    }}
                />
            </div>
            <p className="text-muted my-2 text-sm italic">{infoText}</p>
            <div className="search-results mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {filteredTiles.map(tile => (
                    <Teaser key={tile.name} {...tile} searchString={searchString} />
                ))}
            </div>
        </section>
    );
};
