---
name: ui-verify
description: MANDATORY before claiming any UI/style/animation change works. Drives headless Chromium via Playwright, captures screenshots at named states (initial paint, post-click, scrolled), and reads the PNGs to verify what actually rendered. curl + tsc are not enough — they only confirm HTTP 200 and that code compiles, not that the page looks right. Use whenever you edited a component, styles, GSAP timeline, animation, layout, or any visual element. Also use when the user reports the UI is "broken" or "crashing".
---

# UI Verify

This skill exists because reporting "done" off curl + tsc alone keeps shipping broken UI. Type-checks and HTTP smoke confirm the code compiles and the page responds — not that the user sees what we think they see.

## When to use

**ALWAYS use, before claiming success, if you changed:**
- A React component's JSX (any visual change)
- CSS (Tailwind classes, globals.css, palette tokens, fonts)
- GSAP animations / timelines / hooks
- Layout (grid, flex, positioning)
- Conditional rendering / visibility / opacity
- Image / asset references
- The i18n dictionary keys used in visible text

**Don't bother for:**
- Pure data file edits with no UI consumer change
- Unit-test-only changes
- Comments / docstrings

## How to run

The dev server must be running on `http://localhost:3002` first. Verify with:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3002/
```
If not 200, start it: `npm run dev > /tmp/wedding-dev.log 2>&1 &` and wait ~4s.

### Default recipe (covers initial paint + envelope click + 3 scroll positions)

```bash
node scripts/ui-verify.mjs
```

Writes screenshots to `tmp/ui-verify/<timestamp>/`. Prints JSON with `outDir`, `screenshots[]`, and `consoleErrors[]` (any browser-side JS errors).

### Custom recipe

For changes outside the default coverage (a specific button, a specific section, a form interaction), write a recipe:

```bash
mkdir -p scripts/recipes
cat > scripts/recipes/my-test.json <<'JSON'
{
  "baseUrl": "http://localhost:3002",
  "viewport": { "width": 1440, "height": 900 },
  "states": [
    { "name": "01-form-empty", "url": "/", "actions": [{ "scrollTo": "form" }, { "wait": 400 }] },
    {
      "name": "02-form-filled",
      "url": "/",
      "actions": [
        { "scrollTo": "form" },
        { "type": { "selector": "#guest-name", "text": "Test Guest" } },
        { "wait": 200 }
      ]
    }
  ]
}
JSON
node scripts/ui-verify.mjs --recipe scripts/recipes/my-test.json
```

### Recipe action vocabulary

| Action | Example | Notes |
|---|---|---|
| `wait` | `{ "wait": 500 }` | ms — use after animations / network |
| `click` | `{ "click": "button[aria-expanded]" }` | CSS selector |
| `scroll` | `{ "scroll": 1200 }` | px down (negative = up) |
| `scrollTo` | `{ "scrollTo": "section >> nth=5" }` | scroll element into view |
| `hover` | `{ "hover": ".envelope" }` | pointer hover |
| `type` | `{ "type": { "selector": "#name", "text": "..." } }` | fill input |

Add new action types in `scripts/ui-verify.mjs` if needed.

## How to interpret results

After running, **READ each PNG with the Read tool** — that's the entire point. You can see them visually as a multimodal model.

Check for:
1. **Does the page render at all?** (vs. blank / white screen / error overlay)
2. **Are key elements present?** (envelope, photo card, RSVP form, etc.)
3. **Are positions correct?** (seal centered on flap, sheets fanning at correct angle, text not overlapping)
4. **Are colors right?** (palette consistent, no missing fonts showing system fallback)
5. **Did the animation play?** Compare initial vs post-click screenshots — if they look identical, GSAP didn't fire.
6. **Console errors** — check `consoleErrors[]` in the manifest. Any pageerror or console.error must be investigated before claiming success.

## Reporting

After running ui-verify and reading the screenshots, report to the user with:
- **PASS** — what you saw matches what you intended
- **ISSUES** — list specific problems you observed in the screenshots (e.g. "envelope not visible, only text renders" / "seal positioned to the right of the envelope instead of centered" / "card text overflows the cream paper border")
- **CONSOLE ERRORS** — any from the manifest

**Never report PASS without having read the screenshots yourself.**

## Subagent option

For complex verification (many states, comparing before/after a fix), dispatch a dedicated subagent with `.claude/skills/ui-verify/agent-prompt.md` so verification work doesn't pollute the implementation agent's context.
