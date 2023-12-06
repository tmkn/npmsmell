import { useMemo, type FC } from "react";

import { Badge } from "./Badge.tsx";
import type { FrontmatterData } from "./Search";

import dotsSvg from "./dots.svg?raw";
const dots = `url('data:image/svg+xml;base64, ${btoa(dotsSvg)}');`;

export interface TeaserProps extends FrontmatterData {
    downloads: number;
    dependencies: number;
    distinctDependencies: number;
    pathPrefix: string;
}

export const Teaser: FC<TeaserProps> = ({
    pathPrefix,
    name,
    type,
    description,
    downloads,
    dependencies,
    distinctDependencies
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
                "dots bg-white relative block overflow-hidden rounded border border-indigo-200 p-4 sm:p-6 lg:p-8 hover:border-indigo-600"
            }
            data-name={name}
        >
            <div className="sm:flex sm:justify-between sm:gap-4">
                <div>
                    <h3 className="flex gap-x-2 text-lg font-bold text-gray-900 sm:text-xl">
                        <span>{name}</span>
                        <Badge type={type} />
                    </h3>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-sm text-gray-500">{description}</p>
            </div>

            <dl className="mt-6 flex gap-4 sm:gap-6">
                <div className="flex flex-col-reverse">
                    <dt className="text-sm font-medium text-gray-600">
                        {downloads.toLocaleString("en-US")}
                    </dt>
                    <dd className="text-xs text-gray-500">Weekly Downloads</dd>
                </div>

                <div className="flex flex-col-reverse">
                    <dt className="text-sm font-medium text-gray-600">{dependenciesString}</dt>
                    <dd className="text-xs text-gray-500">Dependencies</dd>
                </div>
            </dl>
        </a>
    );
};
