# AGENTS.md

Guidance for AI coding agents working on this repo. Primary goal: **redesign the site to look great**. Treat this as an open design brief, not a maintenance task — restructure freely.

## The one hard rule

**Whatever you ship must deploy and render correctly on GitHub Pages.** That's it. Repo is served at `biofatikhova.github.io` straight from `main`.

What that allows:
- Any framework (Astro, Next static export, Vite + React/Vue/Svelte/Solid, Eleventy, Hugo, Jekyll, plain HTML, etc.) as long as the final artifact is **static files**.
- A build step is fine if you wire up GitHub Actions to build and publish to Pages (Actions deployment, not legacy branch deploy, is recommended). If you add a build step, document it in README and make sure `main` either contains the built output or the Action is configured before you stop.
- Any CSS approach: vanilla, Tailwind, CSS-in-JS that compiles to static CSS, PostCSS, Sass, etc.
- Any JS, as long as it runs in the browser without a server.

What that rules out:
- Server-rendered runtimes (Next.js SSR, Remix, SvelteKit with adapters, Rails, Django, anything needing Node at request time).
- Server-only APIs, databases, secret env vars at runtime, server middleware.
- `file://`-only assumptions — Pages serves over HTTPS at a subpath-free root.

If you change the stack, **verify a clean build deploys to Pages before declaring done**. Broken Pages deploy = broken site.

## What the site is

- Marketing site for Маргарита Фатихова, biology tutor (БиоФатихова).
- Audience: Russian-speaking parents and students, grades 5–11, ОГЭ/ЕГЭ prep or grade improvement.
- Primary conversion: Telegram booking for a free 20-minute diagnostic. Keep that loud and obvious wherever the design ends up.
- Content lives in: page sections (about, lessons, pricing, testimonials, FAQ, contact) + two JSON files (`lessons.json`, `testimonials.json`).
- Copy is Russian. Don't translate or rewrite copy unless asked.

## Current stack (replaceable)

Plain HTML/CSS/vanilla JS, no build. Files:

```
index.html
css/{main,layout,components,animations}.css
js/{main,bio-icons,simple-lightbox,testimonials}.js
images/{icons,lessons,profile}/
lessons.json
testimonials.json
docs/
README.md
```

Tokens live in `css/main.css` `:root` (forest-green palette, `Roboto`, `--border-radius: 8px`). Treat these as a starting palette — you can replace the whole design system.

Local serve (current stack):
```bash
python3 -m http.server 8000
```

## Design direction (use unless user redirects)

- Feel: professional, calm, biology-themed (botanical/leaf/nature motifs). Audience is parents picking a tutor — trust > flashy.
- Mobile-first. Most traffic is phones.
- Telegram CTA = loudest element on every screen. Sticky mobile CTA is non-negotiable in spirit (form is up to you).
- Readability matters — long Russian testimonial text, parents skimming on phones.
- Anthropic skills like `frontend-design` are encouraged. Lean on them. Don't feel constrained by the current visual language.

## Weak spots in the current design (optional inspiration, not a punch list)

- Background floating emoji icons feel inconsistent (mixed emoji styles, opacity tuning).
- Both pricing cards use the `popular` modifier — no real differentiation.
- Hero has three competing CTAs of similar weight.
- Sections forced transparent with `!important` so background icons show through — they blur into each other.
- No fluid type scale; `h2` jumps at breakpoints.
- All card types share the same left-border + gradient recipe.
- No spacing scale tokens.

Fix any, all, or none — or throw it all out and start over.

## Things worth preserving (soft preferences, override if you have a reason)

- `data-cta="..."` attributes on Telegram/booking links — look like analytics hooks. If you keep tracking, keep these or replace with an equivalent.
- Accessibility primitives currently in place: `aria-label`, `aria-expanded`, `aria-controls`, `role="dialog"` on lightbox, visible focus outlines, `prefers-reduced-motion` handling on background animation. Re-implement these in the new design.
- `lessons.json` and `testimonials.json` schemas — the content owner edits these. If you change schema, update both the data and the rendering, and call it out.
- Free-diagnostic messaging and pricing numbers — content, not design. Don't silently change.

## Verification before declaring done

1. Build (if any) succeeds.
2. Site loads at production URL (or local preview matching production config).
3. Telegram CTA reachable from every viewport (mobile + desktop).
4. Lessons gallery + lightbox work.
5. Testimonials render (collapse/expand still makes sense or has been replaced intentionally).
6. Mobile nav works.
7. No console errors.
8. **GitHub Pages deploy is green.** Check the Actions tab or Pages settings.

## When to ask

- Before deleting `lessons.json` / `testimonials.json` content.
- Before changing pricing or copy.
- Before switching the deploy mechanism (e.g. moving from branch-deploy to Actions) if it would break the current live site mid-change — stage it.

Everything else: ship it.
