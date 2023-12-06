import { component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";

import { Badge } from "./Badge";
import type { FrontmatterData } from "./Search";

import dotsSvg from "./dots.svg?raw";
const dots = `url('data:image/svg+xml;base64, ${btoa(dotsSvg)}');`;

export interface TeaserProps extends FrontmatterData {
    downloads: number;
    dependencies: number;
    distinctDependencies: number;
    pathPrefix: string;
}

export const Teaser = component$<TeaserProps>(
    ({ pathPrefix, name, type, description, downloads, dependencies, distinctDependencies }) => {
        useStylesScoped$(`
        .dots {
            background-image: ${dots};
            background-repeat: repeat;
        }
    `);

        const dependenciesString = useSignal(() => {
            if (dependencies === distinctDependencies) {
                return `${dependencies}`;
            }

            return `${dependencies} (${distinctDependencies} distinct)`;
        });

        return (
            <a
                href={`${pathPrefix}${name}`}
                class={[
                    "dots bg-white relative block overflow-hidden rounded border border-indigo-200 p-4 sm:p-6 lg:p-8 hover:border-indigo-600"
                ]}
                data-name={name}
            >
                <div class="sm:flex sm:justify-between sm:gap-4">
                    <div>
                        <h3 class="flex gap-x-2 text-lg font-bold text-gray-900 sm:text-xl">
                            <span>{name}</span>
                            <Badge type={type} />
                        </h3>
                    </div>
                </div>

                <div class="mt-4">
                    <p class="text-sm text-gray-500">{description}</p>
                </div>

                <dl class="mt-6 flex gap-4 sm:gap-6">
                    <div class="flex flex-col-reverse">
                        <dt class="text-sm font-medium text-gray-600">
                            {downloads.toLocaleString()}
                        </dt>
                        <dd class="text-xs text-gray-500">Weekly Downloads</dd>
                    </div>

                    <div class="flex flex-col-reverse">
                        <dt class="text-sm font-medium text-gray-600">{dependenciesString}</dt>
                        <dd class="text-xs text-gray-500">Dependencies</dd>
                    </div>
                </dl>
            </a>
        );
    }
);
