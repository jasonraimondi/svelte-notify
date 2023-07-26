import { expect, test } from "@playwright/test";

test("Notifications.svelte", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("notify-error").click();
  await expect(page.getByTestId("jmondi-notifications")).toHaveText("message I am a long message");
  await page.getByTestId("jmondi-notifications").click();
});
