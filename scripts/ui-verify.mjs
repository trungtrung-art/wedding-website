#!/usr/bin/env node
/**
 * ui-verify.mjs — drives Chromium, captures screenshots, returns paths.
 *
 * Usage:
 *   node scripts/ui-verify.mjs                                 # default recipe (hero closed + opened)
 *   node scripts/ui-verify.mjs --recipe scripts/recipes/X.json # custom recipe
 *   node scripts/ui-verify.mjs --url http://localhost:3002 --out tmp/foo
 *
 * Recipe JSON shape:
 * {
 *   "baseUrl": "http://localhost:3002",            // optional, overridable by --url
 *   "viewport":  { "width": 1440, "height": 900 }, // optional, default 1440x900
 *   "deviceScaleFactor": 1,                        // optional, default 1
 *   "states": [
 *     {
 *       "name": "hero-closed",                     // required, used for filename
 *       "url": "/",                                // path appended to baseUrl
 *       "actions": [                               // optional sequence
 *         { "wait": 500 },                         // ms
 *         { "click": "selector" },                 // CSS selector to click
 *         { "scroll": 600 },                       // px to scroll (positive = down)
 *         { "scrollTo": "selector" },              // scroll element into view
 *         { "hover": "selector" },                 // hover over element
 *         { "type": { "selector": "...", "text": "..." } }
 *       ],
 *       "fullPage": false                          // optional, default false (viewport only)
 *     }
 *   ]
 * }
 */

import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";

// ----- CLI args -----
const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => {
    if (arg.startsWith("--")) pairs.push([arg.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]);
    return pairs;
  }, [])
);

// ----- Default recipe (no --recipe flag) -----
const DEFAULT_RECIPE = {
  baseUrl: "http://localhost:3002",
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  states: [
    { name: "01-initial-paint", url: "/", actions: [{ wait: 800 }] },
    {
      name: "02-hero-after-envelope-click",
      url: "/",
      actions: [
        { wait: 400 },
        { click: "button[aria-expanded]" },
        { wait: 3500 },
      ],
    },
    { name: "03-scrolled-1000px", url: "/", actions: [{ wait: 400 }, { scroll: 1000 }, { wait: 400 }] },
    { name: "04-scrolled-3000px", url: "/", actions: [{ wait: 400 }, { scroll: 3000 }, { wait: 400 }] },
    { name: "05-scrolled-6000px", url: "/", actions: [{ wait: 400 }, { scroll: 6000 }, { wait: 400 }] },
  ],
};

const recipe = args.recipe
  ? JSON.parse(readFileSync(resolve(args.recipe), "utf8"))
  : DEFAULT_RECIPE;

const baseUrl = args.url || recipe.baseUrl || "http://localhost:3002";
const outDir = args.out
  ? resolve(args.out)
  : resolve(`tmp/ui-verify/${new Date().toISOString().replace(/[:.]/g, "-")}`);

await mkdir(outDir, { recursive: true });

// ----- Drive Chromium -----
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: recipe.viewport || { width: 1440, height: 900 },
  deviceScaleFactor: recipe.deviceScaleFactor || 1,
  reducedMotion: "no-preference",
});
const page = await context.newPage();

const manifest = { baseUrl, outDir, viewport: recipe.viewport, states: [] };
const consoleErrors = [];
page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(`console.error: ${msg.text()}`);
});

for (const state of recipe.states) {
  const url = baseUrl + (state.url || "/");
  await page.goto(url, { waitUntil: "networkidle" });

  for (const action of state.actions || []) {
    if (action.wait) await page.waitForTimeout(action.wait);
    else if (action.click) await page.click(action.click);
    else if (action.scroll) await page.mouse.wheel(0, action.scroll);
    else if (action.scrollTo) await page.locator(action.scrollTo).first().scrollIntoViewIfNeeded();
    else if (action.hover) await page.hover(action.hover);
    else if (action.type) await page.fill(action.type.selector, action.type.text);
    else console.warn(`Unknown action:`, action);
  }

  const path = join(outDir, `${state.name}.png`);
  await page.screenshot({ path, fullPage: state.fullPage || false });

  manifest.states.push({
    name: state.name,
    url,
    path,
    actions: state.actions || [],
    pageTitle: await page.title(),
    pageUrl: page.url(),
  });

  console.log(`✓ ${state.name} → ${path}`);
}

manifest.consoleErrors = consoleErrors;

await writeFile(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));

await browser.close();

console.log("");
console.log(JSON.stringify({ outDir, screenshots: manifest.states.map((s) => s.path), consoleErrors }, null, 2));
