import type { Loader } from "astro/loaders";
import { z } from "astro/zod";

import { trendlineStore } from "./metadatastore";
import { createMetadataLoader } from "./metadataLoader";

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const TrendlineSchema = z.record(dateKey, z.number().int().nonnegative());

export type TrendlineData = z.infer<typeof TrendlineSchema>;

export function downloadTrendDataLoader(): Loader {
    return createMetadataLoader({
        name: "trends-loader",
        store: trendlineStore,
        updateEnvKey: "UPDATE_TRENDS"
    });
}
