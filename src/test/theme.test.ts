import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync("public/theme-init.js", "utf8");
const initialize = (stored: string | null, blocked = false) => {
  const document = { documentElement: { dataset: {} as Record<string, string> } };
  runInNewContext(source, { document, localStorage: { getItem: () => {
    if (blocked) throw new Error("Storage blocked");
    return stored;
  } } });
  return document.documentElement.dataset.theme;
};
describe("theme on first paint", () => {
  it("starts with Default for new visitors", () => expect(initialize(null)).toBe("default"));
  it("applies the remembered Cozy choice before rendering", () => expect(initialize("cozy")).toBe("cozy"));
  it("preserves an explicitly saved Default choice", () => expect(initialize("default")).toBe("default"));
  it("falls back safely when storage is blocked", () => expect(initialize(null, true)).toBe("default"));
  it("rejects unknown modes", () => expect(initialize("dark")).toBe("default"));
});