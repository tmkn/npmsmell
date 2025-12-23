import { defineConfig } from "astro/config";
import { remarkPlaceholderPlugin } from "./src/remarkPlaceholderPlugin";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    integrations: [react()],

    markdown: {
        remarkPlugins: [remarkPlaceholderPlugin],
        shikiConfig: {
            themes: {
                light: "light-plus",
                dark: "dark-plus"
            }
        }
    },

    vite: {
        plugins: [tailwindcss()],
        server: {
            watch: {
                ignored: ["**/playwright-report/**", "**/test-results/**"]
            }
        }
    },

    redirects: {
        "/smell": {
            status: 302,
            destination: "/smells"
        }
    }
});
