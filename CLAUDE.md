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

## 3. Test UI changes in the browser before saying "done"
This is a Next.js + GSAP app; dev server runs on http://localhost:3002.
- After a UI/style/animation change, actually verify it renders:
  - `curl` the affected route for a smoke check, OR
  - Drive it in a real browser and inspect the result.
- Type-checks (`tsc`) and tests confirm code compiles — not that the page
  looks right. They are necessary but not sufficient.
- If you cannot test in the browser, say so explicitly instead of claiming
  the change works.

## 4. Reply in English
- All explanations, summaries, and questions to the user: English.
- Code, commands, file paths, and identifiers are in English by default.
