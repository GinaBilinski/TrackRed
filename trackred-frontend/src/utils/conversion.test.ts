import { describe, it, expect } from "vitest";
import { umrechnen } from "./conversion";

describe("umrechnen() – Vitamin D Einheiten", () => {
  it("rechnet nmol/l → ng/ml korrekt", () => {
    const result = umrechnen(75, "nmol/l", "ng/ml", {
      "nmol/l": 2.5,
      "ng/ml": 1,
    });
    expect(result).toBe(30);
  });

  it("rechnet ng/ml → nmol/l korrekt", () => {
    const result = umrechnen(30, "ng/ml", "nmol/l", {
      "ng/ml": 1,
      "nmol/l": 2.5,
    });
    expect(result).toBe(75);
  });

  it("rechnet nicht, wenn Einheit gleich bleibt", () => {
    const result = umrechnen(50, "ng/ml", "ng/ml", {
      "ng/ml": 1,
      "nmol/l": 2.5,
    });
    expect(result).toBe(50);
  });
});
