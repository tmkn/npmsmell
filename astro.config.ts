import db from "@astrojs/db";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import { remarkDependencyData } from "./src/remarkPluginDependencyData";

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind(), react(), db()],
    markdown: {
        remarkPlugins: [remarkDependencyData],
        shikiConfig: {
            theme: "rose-pine-moon"
        }
    }
});
