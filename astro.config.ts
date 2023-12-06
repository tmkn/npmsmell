import { defineConfig } from "astro/config";
import { remarkDependencyData } from "./src/remarkPluginDependencyData";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind(), react()],
    markdown: {
        remarkPlugins: [remarkDependencyData],
        shikiConfig: {
            theme: "rose-pine-moon"
        }
    }
});
