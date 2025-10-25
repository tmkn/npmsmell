import { defineConfig } from "astro/config";
import { remarkDependencyData } from "./src/remarkPluginDependencyData";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    integrations: [react()],

    markdown: {
        remarkPlugins: [remarkDependencyData],
        shikiConfig: {
            theme: "rose-pine-moon"
        }
    },

    vite: {
        plugins: [tailwindcss()]
    }
});
