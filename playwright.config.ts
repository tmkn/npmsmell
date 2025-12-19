import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    reporter: process.env.CI ? "list" : "html",
    retries: process.env.CI ? 2 : 0,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    // workers: process.env.CI ? 1 : undefined, // TODO: see why undefined is not accepted anymore
    webServer: {
        // command: "npm run build && npm run preview",
        command: "npm run dev",
        port: 4321,
        reuseExistingServer: !process.env.CI
    },
    use: {
        baseURL: "http://localhost:4321",
        trace: "on-first-retry",
        video: "retain-on-failure"
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] }
        }

        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ]
});
