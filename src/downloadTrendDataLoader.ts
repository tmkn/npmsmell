import type { Loader, LoaderContext } from "astro/loaders";
import { z } from "astro/zod";
import fs from "node:fs";

import { getTrendlineData, hasCachedTrendline } from "./npm";
import { getProgressMessage } from "./util";

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date format, expected YYYY-MM-DD"
});

export const TrendlineSchema = z.record(dateKey, z.number().int().nonnegative());

export type TrendlineData = z.infer<typeof TrendlineSchema>;

export function downloadTrendDataLoader(): Loader {
    return {
        name: "trends-loader",

        load: async (context: LoaderContext): Promise<void> => {
            const files = fs.readdirSync("src/content/dependencies");
            const packages = files
                .filter(name => name.endsWith(".md"))
                .map(name => name.replace(/\.md$/, ""));
            const totalPackages = packages.length;

            for (const [i, pkgName] of packages.entries()) {
                context.logger.info(
                    getProgressMessage(pkgName, i, totalPackages, hasCachedTrendline)
                );

                const data = await getTrendlineData(pkgName);

                const npmData = await context.parseData({
                    id: pkgName,
                    data
                });

                context.store.set({
                    id: pkgName,
                    data: npmData
                });
            }
        }
    };
}
