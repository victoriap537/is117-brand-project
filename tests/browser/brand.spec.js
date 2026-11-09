import { test, expect } from "@playwright/test";

test("storefront style choices reveal matching information without adding to the bag", async ({
  page,
}) => {
  await page.goto("/");

  const result = page.locator("#preference-result");
  const relaxedPanel = page.locator('[data-preference-panel="relaxed"]');
  const detailPanel = page.locator('[data-preference-panel="detail"]');

  await expect(result).toBeHidden();
  await expect(page.locator("#bag-count")).toHaveText("0");
  await expect(
    page.getByRole("complementary", { name: "Free styling idea / no sign-up" }),
  ).toContainText("echo one shade in an accessory");

  await page.getByLabel("Keep it relaxed").check();
  await expect(relaxedPanel).toBeVisible();
  await expect(relaxedPanel).toContainText(
    "small navy-and-yellow concept mark",
  );
  await expect(detailPanel).toBeHidden();

  await page.getByLabel("Show me the graphic detail").check();
  await expect(detailPanel).toBeVisible();
  await expect(detailPanel).toContainText("Symbol / close-up");
  await expect(relaxedPanel).toBeHidden();
  await expect(page.locator("#bag-count")).toHaveText("0");
});

test("live guide shares the storefront's mark, artwork, and color tokens", async ({
  page,
}) => {
  await page.goto("/");
  const storefrontTokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.body);
    return {
      accent: styles.getPropertyValue("--color-accent").trim(),
      blue: styles.getPropertyValue("--color-blue").trim(),
      paper: styles.getPropertyValue("--color-paper").trim(),
    };
  });

  await page.goto("/styleguide.html");
  const guideTokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.body);
    return {
      accent: styles.getPropertyValue("--color-accent").trim(),
      blue: styles.getPropertyValue("--color-blue").trim(),
      paper: styles.getPropertyValue("--color-paper").trim(),
    };
  });

  expect(guideTokens).toEqual(storefrontTokens);
  await expect(page.locator(".brand-symbol")).toHaveAttribute(
    "src",
    "assets/pixis-symbol.svg",
  );
  await expect(page.locator('[data-color-token="--color-accent"]')).toHaveText(
    "#f1ca4b",
  );
  for (const asset of [
    "assets/white-shirt.svg",
    "assets/shirt-pocket.svg",
    "assets/shirt-mark.svg",
  ]) {
    const image = page.locator(`.guide-art-sample img[src="${asset}"]`);
    await expect(image).toBeVisible();
    expect(
      await image.evaluate((element) => element.naturalWidth),
    ).toBeGreaterThan(0);
  }
});
