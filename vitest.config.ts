import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./tests/setup.ts",
        exclude: [...configDefaults.exclude, "e2e"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"]
    }
});
