import { test, expect } from "@playwright/test";

test("should redirect /smell to /smells", async ({ page }) => {
    await page.goto("/smell");
    await expect(page).toHaveURL(/\/smells$/);
});
