import { defineCollection } from "astro:content";
import { DependencyTypes } from "../types";

const dependencyCollection = defineCollection({
    type: "content", // v2.5.0 and later
    schema: DependencyTypes
});

export const collections = {
    dependencies: dependencyCollection
};
