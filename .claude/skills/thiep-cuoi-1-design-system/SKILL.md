---
name: thiep-cuoi-1-design-system
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Thiệp cưới 1

## Mission
Deliver implementation-ready design-system guidance for Thiệp cưới 1 that can be applied consistently across documentation site interfaces.

## Brand
- Product/brand: Thiệp cưới 1
- URL: https://cinelove.me/template/thiep-cuoi-1
- Audience: developers and technical teams
- Product surface: documentation site

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=-apple-system`, `font.family.stack=-apple-system, blinkmacsystemfont, Helvetica Neue, helvetica, segoe ui, arial, roboto, PingFang SC, miui, Hiragino Sans GB, Microsoft Yahei, sans-serif`, `font.size.base=13px`, `font.weight.base=400`, `font.lineHeight.base=20px`
- Typography scale: `font.size.xs=11px`, `font.size.sm=12px`, `font.size.md=13px`, `font.size.lg=16px`
- Color palette: `color.text.primary=#333333`, `color.text.secondary=#666666`, `color.text.tertiary=#414141`, `color.surface.base=#000000`, `color.surface.muted=#ffffff`, `color.border.default=#e5e7eb`
- Spacing scale: `space.1=2px`, `space.2=4px`, `space.3=15px`
- Radius/shadow/motion tokens: `radius.xs=4px`, `radius.sm=6px`, `radius.md=50px`, `radius.lg=9999px` | `shadow.1=rgba(0, 0, 0, 0.02) 0px 2px 0px 0px`, `shadow.2=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(175, 182, 201, 0.2) 0px 2px 4px -1px`, `shadow.3=rgba(0, 0, 0, 0.2) 0px 2px 10px 0px` | `motion.duration.instant=200ms`, `motion.duration.fast=300ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
