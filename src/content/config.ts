import { defineCollection } from "astro:content";

import { DependencyTypes } from "../types";
import { npmDataLoader } from "../npmDataLoader";
import { PackageMetaDataSchema } from "../npm";

const dependencies = defineCollection({
    type: "content", // v2.5.0 and later
    schema: DependencyTypes
});

const npmData = defineCollection({
    loader: npmDataLoader(),
    schema: PackageMetaDataSchema
});

export const collections = {
    dependencies,
    npmData
};
