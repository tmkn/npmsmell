import { z } from "zod";

export const baseParams = z.object({
    name: z.string(),
    description: z.string()
});

export const uselessDependency = baseParams.extend({
    type: z.literal("trivial")
});

export const obsoleteJSDependency = baseParams.extend({
    type: z.literal("obsolete-js"),
    implementation: z.string()
});

export const obsoleteNodeDependency = baseParams.extend({
    type: z.literal("obsolete-node"),
    date: z.date(),
    version: z.string()
});

export const DependencyTypes = z.union([
    uselessDependency,
    obsoleteJSDependency,
    obsoleteNodeDependency
]);

type _DependencyTypes = z.infer<typeof DependencyTypes>;
export type DependencyType = _DependencyTypes["type"];
