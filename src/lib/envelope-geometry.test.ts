import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const bodySource = readFileSync(
  new URL("../components/envelope/EnvelopeBody.tsx", import.meta.url),
  "utf8"
);
const topFlapSource = readFileSync(
  new URL("../components/envelope/EnvelopeTopFlap.tsx", import.meta.url),
  "utf8"
);

function toPercent(point: string) {
  const [x, y] = point.split(",").map(Number);

  return `${(x / 400) * 100}% ${(y / 300) * 100}%`;
}

test("EnvelopeTopFlap lower corners match EnvelopeBody seam points", () => {
  const bottomFlapPoints = bodySource.match(
    /ref=\{bottomFlapRef\}[\s\S]*?points="([^"]+)"/
  )?.[1];
  const topFlapPoints = topFlapSource.match(
    /clipPath:\s*"polygon\(([^"]+)\)"/
  )?.[1];

  assert.ok(bottomFlapPoints, "bottom flap points were not found");
  assert.ok(topFlapPoints, "top flap clip-path was not found");

  const [leftSeam, rightSeam] = bottomFlapPoints.split(" ").slice(0, 2);

  assert.deepEqual(
    topFlapPoints.split(", "),
    ["0% 0%", "100% 0%", toPercent(rightSeam), toPercent(leftSeam)]
  );
});

test("envelope paper surfaces include pressed fiber texture", () => {
  assert.match(bodySource, /id="env-paper-surface"/);
  assert.match(bodySource, /<feTurbulence[\s\S]*type="fractalNoise"/);
  assert.match(bodySource, /<feDisplacementMap[\s\S]*scale=/);
  assert.match(topFlapSource, /repeating-linear-gradient/);
  assert.match(topFlapSource, /radial-gradient/);
});
