import { test, expect } from "@playwright/test";

test("optional style choices reveal their matching design details", async ({
  page,
}) => {
  await page.goto("/explorations/postmodernist-draft.html");

  const result = page.locator("#preference-result");
  const relaxedPanel = page.locator('[data-preference-panel="relaxed"]');
  const detailPanel = page.locator('[data-preference-panel="detail"]');
  const stylingTip = page.getByRole("complementary", {
    name: "Free styling idea",
  });

  await expect(stylingTip).toContainText("echo one shade in an accessory");
  await expect(
    page.getByRole("group", { name: "What would you like to see?" }),
  ).toBeVisible();
  await expect(result).toBeHidden();
  await expect(page.getByLabel("Keep it relaxed")).toBeVisible();
  await expect(page.getByLabel("Show me the graphic detail")).toBeVisible();

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
  const zoomMark = detailPanel.locator(".detail-zoom-mark");
  await expect(zoomMark).toBeVisible();
  await expect(zoomMark).toHaveJSProperty("complete", true);
  expect(
    await zoomMark.evaluate((image) => image.naturalWidth),
  ).toBeGreaterThan(0);
});
