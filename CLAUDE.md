# Working with this project (next-gsap-wedding)

Follow these rules on every request from the user. They are not optional.

## 1. Show the plan before editing files
- Before any Edit/Write, list exactly which files you will change and what
  the change is, then wait for the user to say OK.
- Read-only work (Read, grep, ls, git status) does not need confirmation.

## 2. Ask before risky or hard-to-reverse actions
Always confirm with the user before running any of these:
- `git push`, force-push, `git reset --hard`, deleting branches
- `npm install` / `npm uninstall` / changing `package.json` dependencies
- Deleting files or folders
- Killing processes, modifying CI, changing config outside the task scope
- Anything that affects state outside this working directory

## 3. Verify UI changes via the `ui-verify` skill before saying "done" — MANDATORY
This is a Next.js + GSAP app; dev server runs on http://localhost:3002.

After ANY change to a React component, CSS, GSAP animation, layout, or
visible asset, you MUST:

1. Invoke the `ui-verify` skill (see `.claude/skills/ui-verify/SKILL.md`).
2. Run the screenshot recipe (`node scripts/ui-verify.mjs`, optionally with
   a custom recipe for non-default flows).
3. READ every PNG it produces — you are a multimodal model, use it.
4. Check the manifest's `consoleErrors[]` — any browser-side JS error is a
   failure.
5. Only THEN report PASS or list specific ISSUES with concrete observations.

For complex verification, dispatch a dedicated subagent with the prompt at
`.claude/skills/ui-verify/agent-prompt.md` so verification work doesn't
pollute the implementer's context.

**`curl` and `tsc` alone are NOT sufficient.** They confirm the page
responds and the code compiles — not that it looks right. Claiming "done"
off those alone is the failure mode this rule exists to prevent.

If `ui-verify` cannot run (no dev server, no Chromium, no Playwright), say
so explicitly and stop. Do not claim success.

## 4. Reply in English
- All explanations, summaries, and questions to the user: English.
- Code, commands, file paths, and identifiers are in English by default.
