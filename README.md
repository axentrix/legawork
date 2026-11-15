# Legawork Law Office website

The bilingual (English / Bulgarian) one-page website for Legawork Law Office, Sofia.

It is a plain static site with no build step. It is published with GitHub Pages at https://lega.work (see `CNAME`).

## Structure

```
index.html                    homepage: hero, about, mission, services, team summaries, contact
gergana-staneva.html          full profile of Gergana Staneva
mariyana-yankova.html         full profile of Mariyana Yankova
articles.html                 Articles & Analysis (empty state until the first article)
assets/css/site.css           all styles, shared by every page
assets/js/site.js             all behaviour: language switch, menu, animations, form
assets/img/                   portraits
assets/logo/                  logo files; mark.svg is the favicon
```

Every page repeats the same header, hamburger menu, footer and logo symbols. When you change one of these, change it on all four pages.

## Adding an article

`articles.html` contains a commented template. Copy it into the `posts` list once per article, and create the article page itself (for example `articles/my-article.html`, starting from a profile page). Remove the `empty` block once the first article is live.

## Content and language

Every piece of text exists twice, as `<span class="en">` and `<span class="bg">`. The EN/BG switch in the header shows one set and remembers the choice in the visitor's browser. To edit copy, change both spans.

The Bulgarian text comes from the firm's own documents. The English is a translation and should be reviewed by the firm before launch.

## Animations

- Intro screen with the logo, then the hero builds itself.
- The hero logo moves as a balance scale: the two slanted bars are the beams, the coloured shapes ride on their ends. Tuning lives in the script block commented "Logo as a balance".
- The hamburger menu opens as a circle growing out of the button, with the links rising in.
- Practice areas are stacking cards that shrink and dim as the next card slides over.
- Brand shapes in each section float, rotate and pop in on scroll (`<i class="shape ...">` elements, tuned with `data-speed` and `data-rot`).
- Everything respects the visitor's "reduce motion" setting.

## Before going live

- **Contact form:** it validates input but does not send anything yet. Connect it to a form service (for example Formspree or Netlify Forms) or a small mail endpoint.
- **E-mail:** the site shows `staneva8@gmail.com`; consider an address on the firm's own domain.
- **Legal details:** add any bar registration or company details the firm wants in the footer, and a privacy notice for the GDPR consent on the form.
- **Fonts** load from Google Fonts. Self-host them if you prefer not to contact Google from the site.
