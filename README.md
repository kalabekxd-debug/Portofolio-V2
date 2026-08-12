# JO ZGRF — Portfolio Website

A one-page, motion-driven portfolio built from the JO ZGRF brand guideline
(colors, type, logomark, keywords) and your own photography.

## Structure
```
jozgrf-portfolio/
├── index.html          → all page markup/content
├── css/style.css        → design tokens + every style/animation
├── js/main.js           → cursor, preloader, scroll reveals, magnetic/tilt UI
└── assets/images/       → your optimized photos
```

## How to view it
Just open `index.html` in a browser — no build step, no install.
For the smoothest experience (fonts + animation library load correctly
either way, but some browsers restrict things opened via `file://`),
you can also serve it locally:

```bash
cd jozgrf-portfolio
python3 -m http.server 8000
# then open http://localhost:8000
```

## How to publish it for free
Drag the whole `jozgrf-portfolio` folder into **Netlify Drop**
(https://app.netlify.com/drop), or push it to a GitHub repo and enable
**GitHub Pages** — either gives you a live link in under a minute.

## What's inside the design
- **Palette** — pulled directly from your brand board: Ink Black `#0F0F10`,
  Slate `#1C1E24`, Steel Blue `#36507A`, Dusty Blue `#9DB3C8`, Warm Beige
  `#D9D3C7`, Off White `#F4F4F4`.
- **Type** — Bricolage Grotesque (display), Space Grotesk (labels/nav —
  kept from your brand board), Switzer (body, a free alternative to
  PP Neue Montreal so nothing needs a paid license). All loaded via CDN,
  none of them are Montserrat/Poppins/Inter-tier overused.
- **Logomark** — the JO monogram redrawn in SVG (a bold "J" hook + a
  broken-ring "O" that reads like a lens/aperture), reused across the
  nav, preloader, footer and the "Visual Identity" work card.
- **Motion** — custom cursor with magnetic hover states, a GSAP-driven
  intro sequence, scroll-triggered reveals, parallax on the hero image,
  tilt on the work cards, and two opposite-direction marquees. Everything
  respects `prefers-reduced-motion` and gracefully degrades (content stays
  fully visible/usable) if the animation library can't load.
- **Sections** — Hero → About → Selected Work (your camera self-portrait,
  the two digital-collage pieces, and the brand identity itself as a
  featured project) → What I Do → Contact, mirroring the "Portfolio
  Direction" page flow from your brand board.

## Editing content
Everything is plain HTML/CSS — search `index.html` for the text you want
to change (bio copy, service descriptions, email, Instagram handle) and
edit directly. Section comments (`<!-- ================= ABOUT ================= -->`)
mark where each part starts.

## Swapping fonts (if you'd rather use the exact brand fonts)
The `<head>` of `index.html` loads Bricolage Grotesque + Space Grotesk from
Google Fonts and Switzer from Fontshare. If you own a license for
Montserrat/PP Neue Montreal and prefer those instead, replace the two
`<link>` font tags and the `--font-display` / `--font-body` variables at
the top of `css/style.css`.
