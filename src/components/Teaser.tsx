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

const HighlightedText: FC<{ text: string; highlight?: string }> = ({ text, highlight }) => {
    const parts = useMemo(() => {
        if (!highlight) return [text];
        const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return text.split(new RegExp(`(${escaped})`, "gi"));
    }, [text, highlight]);

    if (!highlight) return <>{text}</>;

    return (
        <>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <span key={i} className="bg-highlight">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
};

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
                        <span>
                            <HighlightedText text={name} highlight={searchString} />
                        </span>
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
