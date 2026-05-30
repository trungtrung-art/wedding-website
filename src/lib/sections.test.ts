import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { sectionOrder } from "../data/sections.ts";

const here = dirname(fileURLToPath(import.meta.url));
const sectionsDir = join(here, "..", "components", "sections");

test("every sectionOrder key has a component file in src/components/sections/", () => {
  const missing = sectionOrder.filter(
    (k) => !existsSync(join(sectionsDir, `${k}.tsx`))
  );
  assert.deepEqual(missing, [], `missing files: ${missing.join(", ")}`);
});
