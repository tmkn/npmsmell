import { defineCollection } from "astro:content";

import { DependencyTypes } from "../types";
import { npmDataLoader } from "../loaders/npmDataLoader";
import { PackageMetaDataSchema } from "../npm";
import { downloadTrendDataLoader, TrendlineSchema } from "../loaders/downloadTrendDataLoader";

const dependencies = defineCollection({
    type: "content", // v2.5.0 and later
    schema: DependencyTypes
});

const npmData = defineCollection({
    loader: npmDataLoader(),
    schema: PackageMetaDataSchema
});

const trends = defineCollection({
    loader: downloadTrendDataLoader(),
    schema: TrendlineSchema
});

export const collections = {
    dependencies,
    npmData,
    trends
};
