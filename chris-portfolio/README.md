# Chris Gnanadurai — Portfolio

A portfolio site in plain HTML, CSS, and JavaScript — no build step, no npm, no server required.

## Opening it

Double-click `index.html`. That's it — it opens directly in your browser and works completely offline (aside from loading Google Fonts, which needs internet the first time).

## Folder structure

```
chris-portfolio/
  index.html              home page — hero, work grid, about, experience, contact
  work/
    carrierlink.html                     each case study is its own page
    fast-track.html
    workspace.html
    making-the-invisible-visible.html
    fin-ai.html
  assets/
    css/
      style.css           all styles
    js/
      main.js              mobile menu, sticky header, work-grid tag filter
    images/
      case-studies/        images for each case study, one folder per project
      profile/              headshot lives here
    icons/                 (empty — icons are inline SVG in the HTML; kept for any future icon files)
```

`index.html` is a single scrolling page for Home, Work (grid), About, Experience, and Contact, with anchors the navigation jumps to (`#work`, `#about`, `#experience`, `#contact`). Each case study, though, opens as its own separate page under `work/` — clicking a card takes you there, and a "Back to Projects" link at the top returns you to the work grid on the home page.

## Editing content

**Home page sections** (hero, about, experience, contact): open `index.html` in any text editor and search for the section you want (each is clearly commented, e.g. `<!-- ============ ABOUT ============ -->`).

**A case study:** open its file directly under `work/` (e.g. `work/carrierlink.html`) and edit the text/images there.

**Adding your headshot:** already done — it lives at `assets/images/profile/headshot.png` and is referenced in the hero section of `index.html`.

**Adding a new case study:**
1. Copy an existing file in `work/` as a starting template (e.g. `cp work/fin-ai.html work/my-new-project.html`).
2. Edit its content, title, and images (images go in `assets/images/case-studies/my-new-project/`).
3. Add a matching card to the bento grid in `index.html`'s `#work` section, with `href="work/my-new-project.html"`.

**The 4 "Coming soon" cards** (FIN Sim, AI Agent Alan, the AI disruption workshop, Customer Facing Workshops) are placeholders in the grid with no linked page yet — same process as above to bring them online.

There's no templating or build step anywhere — edit the HTML directly, save, and refresh the browser to see the change.

## Updating your live site (cPanel / FTP)

Whenever you make changes:

1. Edit the relevant `.html` file (in the root or under `work/`) and check it locally by opening it in your browser.
2. Upload the changed files to your host via FTP or cPanel File Manager, preserving the same folder structure (`index.html` and `work/` and `assets/` all at the root of `public_html`).

No build step, no `npm run build` — just edit and upload.

## Notes

- A separate Next.js version of this site was built earlier in development and is preserved in `../chris-portfolio-nextjs-backup/` (one level up from this folder) in case it's ever useful again. It isn't part of the live site.
- Fonts (Space Grotesk, Inter) load from Google Fonts via a `<link>` tag in the `<head>` of every page — this needs an internet connection the first time a visitor loads the page, same as virtually all hand-coded sites.
