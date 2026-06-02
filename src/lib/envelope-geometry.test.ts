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
const layoutSource = readFileSync(
  new URL("../app/layout.tsx", import.meta.url),
  "utf8"
);
const globalsSource = readFileSync(
  new URL("../app/globals.css", import.meta.url),
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

test("EnvelopeTopFlap hinges from the envelope top edge without being hidden", () => {
  assert.match(topFlapSource, /transformOrigin:\s*"top center"/);
  assert.match(topFlapSource, /willChange:\s*"transform"/);
  assert.doesNotMatch(topFlapSource, /backfaceVisibility|WebkitBackfaceVisibility|transformStyle/);
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
  assert.match(heroSource, /const shellAnticipationY = isMobile \? -6 : -14/);
  assert.match(heroSource, /const shellOpenY = isMobile \? 178 : -14/);
  assert.match(heroSource, /const cardLift = isMobile \? -175 : -285/);
  assert.match(heroSource, /const photoLift = isMobile \? -92 : -200/);
  assert.match(heroSource, /const topFlapOpenScale = isMobile \? -0\.44 : -0\.54/);
  assert.match(heroSource, /gsap\.set\(topFlapRef\.current,\s*\{\s*scaleY:\s*1,\s*zIndex:\s*40\s*\}/);
  assert.match(heroSource, /scaleY:\s*topFlapOpenScale/);
  assert.doesNotMatch(heroSource, /rotateX:\s*topFlapOpen/);
  assert.match(heroSource, /\.set\(topFlapRef\.current,\s*\{\s*zIndex:\s*12\s*\}\)/);
  assert.match(heroSource, /left-\[-13%\]\s+bottom-\[12%\]/);
  assert.match(heroSource, /right-\[-13%\]\s+bottom-\[7%\]/);
  assert.match(heroSource, /sm:left-\[-23%\]\s+sm:bottom-\[13%\]/);
  assert.match(heroSource, /sm:right-\[-24%\]\s+sm:bottom-\[9%\]/);
});

test("hero uses a soft stage veil to stop background names peeking through the envelope", () => {
  assert.match(heroSource, /envelope-stage-veil/);
  assert.match(heroSource, /className="group relative isolate z-10/);
  assert.match(heroSource, /introRef\.current,\s*\{\s*autoAlpha:\s*0\.12,\s*y:\s*-20/);
});

test("hero couple names use Mea Culpa in the envelope Bordeaux color", () => {
  assert.match(layoutSource, /Mea_Culpa/);
  assert.match(layoutSource, /--font-mea-culpa/);
  assert.match(globalsSource, /--color-envelope-bordeaux:\s*#7f303a/);
  assert.match(globalsSource, /font-family:\s*var\(--font-mea-culpa\)/);
  assert.match(globalsSource, /letter-spacing:\s*0/);
  assert.match(heroSource, /flex w-full flex-col items-center/);
  assert.match(heroSource, /sm:grid sm:grid-cols-\[max-content_max-content\]/);
  assert.match(heroSource, /text-\[clamp\(3\.8rem,18vw,5rem\)\]/);
  assert.match(heroSource, /sm:text-\[clamp\(4\.2rem,9vw,8\.75rem\)\]/);
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
