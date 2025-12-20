import { test, expect } from "@playwright/test";

test("should open a search result from the main page", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('html[data-search-hydrated="true"]');
    await page.getByPlaceholder("Search").fill("is-absolute");
    await page.locator('a[data-name="is-absolute"]').click();

    await expect(page).toHaveURL("/smell/is-absolute");
});

test("should open a search result from the overview page", async ({ page }) => {
    await page.goto("/smells");
    await page.waitForSelector('html[data-search-hydrated="true"]');
    await page.getByPlaceholder("Search").fill("is-absolute");
    await page.locator('a[data-name="is-absolute"]').click();

    await expect(page).toHaveURL("/smell/is-absolute");
});
