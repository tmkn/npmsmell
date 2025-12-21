import { test, expect, devices } from "@playwright/test";

test("should redirect /smell to /smells", async ({ page }) => {
    await page.goto("/smell");
    await expect(page).toHaveURL(/\/smells$/);
});

test("only 2 best of's are visible on mobile", async ({ browser }) => {
    const context = await browser.newContext({
        ...devices["Pixel 7"]
    });
    const page = await context.newPage();

    await page.goto("/");

    const links = page.locator(".hide-second-to-last-best-of-on-mobile > a[data-name]");
    const visibleCount = await links.filter({ has: page.locator(":visible") }).count();

    expect(visibleCount).toBe(2);
});
