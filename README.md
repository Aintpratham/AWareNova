# Nova Phase5 — Product Website

The marketing and conversion site for **Nova Phase5**. Static, dependency-free,
and built to launch fast with placeholders you can swap in over time without a
redesign.

Built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

---

## Project structure

```
Project-Nova/
├── index.html            Home (hero + Why Nova)
├── css/
│   ├── global.css        Tokens, type, nav, buttons, footer (loaded everywhere)
│   ├── home.css          Hero + feature grid
│   ├── pricing.css       Plan cards
│   ├── proof.css         Placeholder galleries
│   ├── setup.css         Setup / coming-soon
│   ├── faq.css           Reusable accordion (reserved for a future FAQ)
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
├── assets/
│   ├── images/           Screenshots, logos
│   ├── videos/           Success clips
│   └── icons/            Icons / favicons
└── README.md
```

---

## Running it

It is fully static, so just open `index.html` in a browser. For correct
relative paths while developing, a tiny local server is recommended:

```bash
# from inside Project-Nova/
python3 -m http.server 8000
# then visit http://localhost:8000
```

To deploy, upload the whole folder to any static host (Netlify, Vercel,
Cloudflare Pages, GitHub Pages, or plain S3/Nginx).

---

## Design system

Defined as CSS variables at the top of `css/global.css`.

- **Backgrounds:** `#050505`, `#080808`, `#0D0D0D`
- **Text:** `#FFFFFF`, `#EAEAEA`, `#CFCFCF`
- **Accent (copper):** `#C58B5C`, `#D09A6A`, `#B97A4A`
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (labels/stats)

Accent is used only for important headings, buttons, highlights, active nav,
stats, and calls to action.

---

## Where to add real content later

Everything below is marked with clear comments in the code.

| Task | File | Look for |
| --- | --- | --- |
| Stripe payment links | `pages/pricing.html` | `REPLACE WITH STRIPE PAYMENT LINK` |
| Real prices | `pages/pricing.html` | `REPLACE WITH REAL PRICING` |
| License generation flow | `pages/pricing.html` | `PAYMENT FLOW (future)` comment |
| Proof screenshots | `pages/proof.html` | `Add Screenshot Here` |
| Proof videos | `pages/proof.html` | `Add Video Here` |
| Customer results | `pages/proof.html` | `Add Success Proof Here` |
| Setup steps | `pages/setup.html` | commented `Step 1` block |
| Terms text | `pages/terms.html` | five `legal-section` blocks |
| Privacy policy | `pages/privacy.html` | commented scaffold |
| Contact emails | `pages/contact.html` | `REPLACE EMAIL` |
| Future FAQ | `css/faq.css` | usage notes at top of file |

### Editing the nav or footer

The navigation and footer markup is duplicated in each HTML file so the site
works with zero JS and zero build step. To change a link, update it in
`index.html` **and** in each file under `pages/`.

### Adding a new page

1. Copy an existing page in `pages/` as a starting point.
2. Keep the `../css/global.css` link and add a page-specific stylesheet if needed.
3. Add the page to the nav and footer link lists.
4. Set its nav link to `class="active"` and `aria-current="page"`.

---

A Pratham Shah production. All rights reserved.
