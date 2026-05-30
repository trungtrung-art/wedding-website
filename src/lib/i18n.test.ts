import test from "node:test";
import assert from "node:assert/strict";
import { dict } from "../data/i18n.ts";

test("dict.vi and dict.en have identical key sets", () => {
  const viKeys = new Set(Object.keys(dict.vi));
  const enKeys = new Set(Object.keys(dict.en));

  const onlyInVi = [...viKeys].filter((k) => !enKeys.has(k));
  const onlyInEn = [...enKeys].filter((k) => !viKeys.has(k));

  assert.deepEqual(onlyInVi, [], `keys only in vi: ${onlyInVi.join(", ")}`);
  assert.deepEqual(onlyInEn, [], `keys only in en: ${onlyInEn.join(", ")}`);
});

test("no dict value is empty", () => {
  for (const locale of ["vi", "en"] as const) {
    for (const [key, value] of Object.entries(dict[locale])) {
      assert.notEqual(value.trim(), "", `${locale}.${key} is empty`);
    }
  }
});
