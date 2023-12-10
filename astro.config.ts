import { defineConfig } from "astro/config";
import { remarkDependencyData } from "./src/remarkPluginDependencyData";
import tailwind from "@astrojs/tailwind";

import qwikdev from "@qwikdev/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), qwikdev()],
  markdown: {
    remarkPlugins: [remarkDependencyData],
    shikiConfig: {
      theme: "rose-pine-moon"
    }
  }
});