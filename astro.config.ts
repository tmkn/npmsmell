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
            themes: {
                light: "light-plus",
                dark: "dark-plus"
            }
        }
    },

    vite: {
        plugins: [tailwindcss()]
    },

    redirects: {
        "/smell": {
            status: 302,
            destination: "/smells"
        }
    }
});
