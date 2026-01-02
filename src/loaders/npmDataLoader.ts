import type { Loader } from "astro/loaders";

import { packageMetadataStore } from "./metadatastore";
import { createMetadataLoader } from "./metadataLoader";

export function npmDataLoader(): Loader {
    return createMetadataLoader({
        name: "npm-data-loader",
        store: packageMetadataStore,
        updateEnvKey: "UPDATE_NPM_DATA"
    });
}
