# Legawork Law Office website

The bilingual (English / Bulgarian) one-page website for Legawork Law Office, Sofia.

It is a plain static site: one `index.html` with its styles and scripts inline, plus images and logos in `assets/`. There is no build step. Open `index.html` in a browser, or upload the folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Structure

```
index.html                         the whole page (markup, CSS, JS)
assets/img/gergana-staneva.jpg     founder portrait
assets/img/mariyana-yankova.jpg    partner portrait (300×400, a larger original would look sharper)
assets/logo/mark.svg               logo symbol, used as the favicon
assets/logo/lega-work-dark-bg.svg  full logo for dark backgrounds
assets/logo/lega-work-light-bg.svg full logo for light backgrounds
```

## Content and language

Every piece of text exists twice, as `<span class="en">` and `<span class="bg">`. The EN/BG switch in the header shows one set and remembers the choice in the visitor's browser. To edit copy, change both spans.

The Bulgarian text comes from the firm's own documents. The English is a translation and should be reviewed by the firm before launch.

## Animations

- Intro screen with the logo, then the hero builds itself.
- The hero logo moves as a balance scale: the two slanted bars are the beams, the coloured shapes ride on their ends. Tuning lives in the script block commented "Logo as a balance".
- Practice areas are stacking cards that shrink and dim as the next card slides over.
- Brand shapes in each section float, rotate and pop in on scroll (`<i class="shape ...">` elements, tuned with `data-speed` and `data-rot`).
- Everything respects the visitor's "reduce motion" setting.

## Before going live

- **Contact form:** it validates input but does not send anything yet. Connect it to a form service (for example Formspree or Netlify Forms) or a small mail endpoint.
- **E-mail:** the site shows `staneva8@gmail.com`; consider an address on the firm's own domain.
- **Legal details:** add any bar registration or company details the firm wants in the footer, and a privacy notice for the GDPR consent on the form.
- **Fonts** load from Google Fonts. Self-host them if you prefer not to contact Google from the site.
