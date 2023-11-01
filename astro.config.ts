import { defineConfig } from "astro/config";

import { remarkDependencyData } from "./src/remarkPluginDependencyData";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind()],
    markdown: {
        remarkPlugins: [remarkDependencyData],
        shikiConfig: {
            theme: "rose-pine-moon"
        }
    }
});
