# Wedding Invitation Animation Design

## Goal

Build a Canva-inspired interactive wedding invitation opener in the current Next.js app.

## Experience

The first viewport shows a muted green textured background, names, and a closed parchment envelope. Clicking the envelope runs a GSAP timeline: the envelope flap opens, the seal softens away, floral layers appear, and a photo card rises from the envelope. After the opener finishes, the rest of the invitation becomes available below.

The invitation continues as full-height scroll sections: music/date scene, save-the-date/calendar scene, RSVP callout with embedded form placeholder, countdown, and thank-you closing.

## Implementation

Use React state for the opened/closed stage, GSAP for the click animation, and CSS/Tailwind for layout, texture, envelope geometry, and responsive polish. Keep the visual assets code-native for now so the project works immediately; later, replace placeholder card/photo layers with real assets in `public/`.

## Constraints

- Keep the page usable without external Canva code.
- Keep text placeholders editable in a single data object.
- Maintain the existing Next.js app router scaffold.
- Verify with lint, production build, and browser preview at `localhost:3001`.
