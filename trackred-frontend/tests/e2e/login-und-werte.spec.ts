import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "Login / Registrieren" }).click();
  await page.getByRole("textbox", { name: "E-Mail" }).click();
  await page.getByRole("textbox", { name: "E-Mail" }).fill("ginabil@web.de");
  await page.getByRole("textbox", { name: "Passwort" }).click();
  await page.getByRole("textbox", { name: "Passwort" }).fill("123456");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await page.getByRole("link", { name: "Hinzufügen" }).click();
  await page.locator('input[type="date"]').fill("2025-08-05");
  await page
    .locator("div")
    .filter({ hasText: /^Arzt:$/ })
    .getByRole("textbox")
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^Arzt:$/ })
    .getByRole("textbox")
    .fill("Dr. Simon");
  await page
    .locator("div")
    .filter({ hasText: /^Ort:$/ })
    .getByRole("textbox")
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^Ort:$/ })
    .getByRole("textbox")
    .fill("Hamburg");
  await page.locator("textarea").click();
  await page.locator("textarea").fill("Test");
  await page.locator(".react-select__input-container").first().click();
  await page.getByRole("option", { name: "Calcium" }).click();
  await page.getByPlaceholder("Messwert").click();
  await page.getByPlaceholder("Messwert").fill("2.58");
  await page
    .getByRole("button", { name: "+ weiteren Wert hinzufügen" })
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^Wert wählen$/ })
    .nth(3)
    .click();
  await page.getByRole("option", { name: "Vitamin D" }).click();
  await page
    .locator(
      "div:nth-child(7) > .value-pair > .value-select > .react-select-container > .react-select__control > .react-select__value-container > .react-select__input-container"
    )
    .click();
  await page.getByRole("option", { name: "nmol/l" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Vitamin Doption nmol\/l, selected\.nmol\/l$/ })
    .getByPlaceholder("Messwert")
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^Vitamin Dnmol\/l$/ })
    .getByPlaceholder("Messwert")
    .fill("200");
  await page.getByRole("button", { name: "Speichern" }).click();
  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await page.getByRole("link", { name: "Werte" }).click();
  await page.getByText("50.00 ng/ml").click();
  await page
    .locator("div")
    .filter({ hasText: /^ng\/ml$/ })
    .nth(3)
    .click();
  await page.getByRole("option", { name: "nmol/l" }).click();
});
