import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const bodySource = readFileSync(
  new URL("../components/envelope/EnvelopeBody.tsx", import.meta.url),
  "utf8"
);
const topFlapSource = readFileSync(
  new URL("../components/envelope/EnvelopeTopFlap.tsx", import.meta.url),
  "utf8"
);
const heroSource = readFileSync(
  new URL("../components/sections/hero.tsx", import.meta.url),
  "utf8"
);
const sealSource = readFileSync(
  new URL("../components/envelope/EnvelopeSeal.tsx", import.meta.url),
  "utf8"
);

test("EnvelopeTopFlap is a centered triangle", () => {
  const topFlapPoints = topFlapSource.match(
    /clipPath:\s*"polygon\(([^"]+)\)"/
  )?.[1];

  assert.ok(topFlapPoints, "top flap clip-path was not found");

  assert.deepEqual(
    topFlapPoints.split(", "),
    ["0% 0%", "100% 0%", "50% 56%"]
  );
});

test("envelope uses the Bordeaux artwork without tinting its true color", () => {
  assert.match(bodySource, /const rimShadowId = `\$\{idPrefix\}-rim-shadow`/);
  assert.match(bodySource, /d="M0 0 L130 150 L270 150 L400 0"/);
  assert.match(bodySource, /kaleidoscope-bordeaux\.jpg/);
  assert.match(topFlapSource, /kaleidoscope-bordeaux\.jpg/);
  assert.doesNotMatch(bodySource, /paper-surface|feColorMatrix|feBlend|feDisplacementMap/);
  assert.doesNotMatch(topFlapSource, /backgroundBlendMode|linear-gradient|radial-gradient|repeating-linear-gradient/);
});

test("envelope body can split into independent back and front z-index layers", () => {
  assert.match(bodySource, /variant\?:\s*"back"\s*\|\s*"front"\s*\|\s*"full"/);
  assert.match(heroSource, /<EnvelopeBody[\s\S]*variant="back"/);
  assert.match(heroSource, /<EnvelopeBody[\s\S]*variant="front"/);
  assert.match(heroSource, /z-10[\s\S]*<EnvelopeBody[\s\S]*variant="back"/);
  assert.match(heroSource, /z-30[\s\S]*<EnvelopeBody[\s\S]*variant="front"/);
});

test("botanical cutouts sit fully above the envelope face", () => {
  assert.match(heroSource, /leftSprigRef[\s\S]*z-\[35\]/);
  assert.match(heroSource, /rightSprigRef[\s\S]*z-\[35\]/);
  assert.match(heroSource, /Botanical cutouts are fully on top of the envelope face/);
  assert.doesNotMatch(heroSource, /botanical-inside-|botanical-outside-/);
});

test("botanical cutouts and save-the-date card are lifted above the envelope rim", () => {
  assert.match(heroSource, /cardRef\.current,\s*\{\s*autoAlpha:\s*1,\s*y:\s*-285/);
  assert.match(heroSource, /left-\[-24%\]\s+bottom-\[14%\]/);
  assert.match(heroSource, /right-\[-25%\]\s+bottom-\[9%\]/);
});

test("hero uses a soft stage veil to stop background names peeking through the envelope", () => {
  assert.match(heroSource, /envelope-stage-veil/);
  assert.match(heroSource, /className="group relative isolate z-10/);
  assert.match(heroSource, /introRef\.current,\s*\{\s*autoAlpha:\s*0\.12,\s*y:\s*-20/);
});

test("wax seal uses the downloaded PNGTree raster asset", () => {
  const sealAsset = new URL(
    "../../public/wedding-assets/golden-heart-wax-seal.png",
    import.meta.url
  );

  assert.ok(existsSync(sealAsset), "downloaded wax seal image is missing");
  assert.match(sealSource, /golden-heart-wax-seal\.png/);
  assert.doesNotMatch(sealSource, /seal-tt\.svg/);
});
