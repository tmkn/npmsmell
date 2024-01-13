import { defineConfig } from "astro/config";
import { remarkDependencyData } from "./src/remarkPluginDependencyData";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind(), preact({ compat: true })],
    markdown: {
        remarkPlugins: [remarkDependencyData],
        shikiConfig: {
            theme: "rose-pine-moon"
        }
    }
});
