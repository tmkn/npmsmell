import { useMemo, type FC } from "react";

import { Badge } from "./Badge.tsx";
import type { FrontmatterData } from "./SearchWidget.tsx";

import dotsSvg from "./dots.svg?raw";
const dots = `url('data:image/svg+xml;base64, ${btoa(dotsSvg)}')`;

export interface TeaserProps extends FrontmatterData {
    downloads: number;
    dependencies: number;
    distinctDependencies: number;
    pathPrefix: string;
    searchString?: string;
}

export const Teaser: FC<TeaserProps> = ({
    pathPrefix,
    name,
    type,
    description,
    downloads,
    dependencies,
    distinctDependencies,
    searchString
}) => {
    const dependenciesString = useMemo<string>(() => {
        if (dependencies === distinctDependencies) {
            return `${dependencies}`;
        }

        return `${dependencies} (${distinctDependencies} distinct)`;
    }, [dependencies, distinctDependencies]);

    const highlightedName = useMemo(() => {
        if (!searchString) return name;

        const parts = name.split(searchString);
        return parts.map((part, i) =>
            i === parts.length - 1 ? (
                part
            ) : (
                <span key={i}>
                    {part}
                    <span className="decoration-highlight underline decoration-[3px] underline-offset-4">
                        {searchString}
                    </span>
                </span>
            )
        );
    }, [name, searchString]);

    return (
        <a
            href={`${pathPrefix}${name}`}
            style={{ backgroundImage: dots, backgroundRepeat: "repeat" }}
            className={
                "dots bg-surface hover:border-card-border border-card-border-subtle relative block overflow-hidden rounded border p-4 sm:p-6 lg:p-8 dark:bg-blend-overlay"
            }
            data-name={name}
        >
            <div className="sm:flex sm:justify-between sm:gap-4">
                <div>
                    <h3 className="text-content flex gap-x-2 text-lg font-bold sm:text-xl">
                        <span>{highlightedName}</span>
                        <Badge type={type} />
                    </h3>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-muted-subtle text-sm">{description}</p>
            </div>

            <dl className="mt-6 flex gap-4 sm:gap-6">
                <div className="flex flex-col-reverse">
                    <dt className="text-muted text-sm font-medium">
                        {downloads.toLocaleString("en-US")}
                    </dt>
                    <dd className="text-muted-subtle text-xs">Weekly Downloads</dd>
                </div>

                <div className="flex flex-col-reverse">
                    <dt className="text-muted text-sm font-medium">{dependenciesString}</dt>
                    <dd className="text-muted-subtle text-xs">Dependencies</dd>
                </div>
            </dl>
        </a>
    );
};
