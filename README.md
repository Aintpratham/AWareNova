# Nova Phase5 — Product Website (Awarenova)

The marketing and conversion site for **Nova Phase5** (Awarenova, `awarenova.ca`).
Static, dependency-free, mobile-first, and built to launch fast with placeholders
you can swap in over time without a redesign.

Built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

> Note: ~98–99% of visitors are on phones, so the CSS is written mobile-first.
> Base rules target phones; `min-width` breakpoints scale layout and type up.

---

## Project structure

```
NovaPhase5-Website/
├── index.html            Home — conversion page (hero + 6 sections + FAQ)
├── css/
│   ├── global.css        Tokens, type, nav, buttons, footer (loaded everywhere)
│   ├── home.css          Hero + problem + help + choose + income + proof preview
│   ├── pricing.css       Plan cards (Base / Standard / Premium)
│   ├── proof.css         Media gallery (blurred previews)
│   ├── setup.css         Four-step install guide
│   ├── faq.css           Reusable accordion (used on the home FAQ)
│   └── legal.css         Terms, Privacy, Contact
├── js/
│   ├── main.js           Footer year, init, console signature
│   ├── navigation.js     Mobile hamburger menu
│   └── animations.js     Scroll-reveal (IntersectionObserver)
├── pages/
│   ├── proof.html
│   ├── pricing.html
│   ├── setup.html
│   ├── terms.html
│   ├── privacy.html
│   └── contact.html
├── assets/               (create as needed)
│   ├── images/           Screenshots, logos, blurred proof thumbnails
│   ├── videos/           Success clips
│   └── icons/            Icons / favicons
└── README.md
```

---

## Running it

Fully static — open `index.html`, or run a tiny local server for correct
relative paths:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Deploy by uploading the folder to any static host (Netlify, Vercel, Cloudflare
Pages, GitHub Pages, or S3/Nginx).

---

## Design system

Defined as CSS variables at the top of `css/global.css`.

- **Backgrounds:** `#050505`, `#080808`, `#0D0D0D`, `#121212`
- **Text:** `#FFFFFF`, `#EAEAEA`, `#CFCFCF`, muted `#8A8A8A`
- **Accent (copper):** `#C58B5C`, `#D09A6A`, `#B97A4A`
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (labels/data)
- **Buttons:** rounded, soft shadow on primary, 52px min tap height

Accent is used only for important headings, buttons, highlights, active nav,
labels, and calls to action.

---

## Copy rules (important)

The site describes **what** Nova does, never **how**. Do not add implementation
details anywhere in user-facing copy. Keep writing confident, direct, and
concise — no buzzwords, no artificial urgency, no emojis.

---

## Where to add real content / integrations later

Everything below is marked with `TODO` or `REPLACE` comments in the code.

| Task | File | Look for |
| --- | --- | --- |
| Stripe payment links | `pages/pricing.html` | `TODO (Stripe Checkout)` |
| Enable checkout buttons | `pages/pricing.html` | remove `is-disabled` / `aria-disabled` |
| Order success + license delivery | `pages/pricing.html` | `PAYMENT FLOW (future)` |
| Proof screenshots / videos | `pages/proof.html` | `.media-blur` slots |
| Blurred preview thumbs (home) | `index.html` | `.preview-blur` slots |
| Download link | `pages/setup.html` | `TODO (License Downloads)` |
| License lookup / portal | `pages/setup.html` | `TODO (Customer Portal)` |
| Terms text | `pages/terms.html` | five `legal-section` blocks |
| Privacy policy | `pages/privacy.html` | commented scaffold |
| Contact form backend | `pages/contact.html` | `CONTACT FORM (future)` |
| Account / login nav | any page | `TODO (Account Login)` |
| OG share image + URL | `index.html` | commented `og:` tags |

Support address used site-wide: **support@awarenova.ca**

### Editing the nav or footer

Nav and footer markup is duplicated in each HTML file so the site works with
zero JS and zero build step. The nav is intentionally minimal — **Home**,
**Proof**, **Get Started** — with everything else in the footer. To change a
link, update it in `index.html` **and** in each file under `pages/`.

---

A Pratham Shah production. All rights reserved.
