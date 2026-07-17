# Hongbo Huang — Personal Website

personal-website-hhb.vercel.app
A single, static personal site built with plain HTML, CSS, and JavaScript.
No build step, no framework, no dependencies. Theme: dark + cubism.

## Structure

```
personal-website/
├─ index.html      # all page content (hero, about, experience, projects, contact)
├─ styles.css      # dark Art Nouveau (Mucha) theme, mobile-first responsive
├─ script.js       # mobile nav, scroll reveals, footer year
├─ vercel.json     # static config (clean URLs)
├─ .vercelignore   # keeps PDFs / local helper files out of the deploy
└─ .gitignore
```

## Preview locally

From this folder, run any static server, e.g.:

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `vercel` from the CLI).
2. In Vercel, import the repo.
3. Framework preset: **Other**. Build command: none. Output directory: `./` (root).
4. Deploy.

Vercel serves the static files as-is. The `.vercelignore` file ensures your
resume PDF and any local helper files are never uploaded.

## Adding a project

Open `index.html`, find the **Projects** section, and copy the commented
`PROJECT CARD TEMPLATE` block. Fill in the title, description, tags, and link.

## Content note

All content is drawn only from the provided resume. There is no work-history
section because the resume did not list any employment — the Experience section
reflects education and awards. Update the HTML directly as your background grows.
