# Kaiming Liu — academic website

Source for [kl543.github.io](https://kl543.github.io/), a single-page researcher homepage built with Astro and plain CSS. Home contains the introduction, professional links, three research projects, publications, and background. No primary navbar, browser JavaScript, analytics, backend, or external font requests.

The research introduction leads with probabilistic machine learning, multimodal conditional inference, and robustness. The Physics PhD identity and scientific applications provide the domain context. Public method claims are checked against project evidence.

## Local development

Use Node 24 (or Node ≥22.12):

```sh
npm ci
npm run dev
```

`npm run build` builds and checks the static site. `npm run preview` serves the production output. Dependencies and generated output can be removed after use: `node_modules/`, `dist/`, and `.astro/`.

## Content and CV

- `src/data/profile.json`: canonical public bio, education, dates, links, CV experience, and skills.
- `src/data/research.json`: the three projects, their stable anchor IDs, descriptors, and concise explanations.
- `src/data/publications.json`: verified papers; empty lists hide the section.
- `src/data/talks.json`: future public talks; an empty list stays hidden.
- `src/pages/index.astro`: the homepage structure.
- `src/pages/research.astro`: a static compatibility redirect to `/#research`, with the homepage canonical URL and `noindex`.
- `src/components/ProfileMetadata.astro`: inert homepage JSON-LD for ProfilePage, Person, and WebSite, using verified profile data.
- `src/pages/sitemap.xml.ts`: a build-time XML sitemap containing Home and any published writing, excluding redirects, drafts, downloads, and 404.
- `src/styles/global.css`: restrained styling and responsive layout.
- `public/images/kaiming-liu.jpg`: compressed portrait; the original image is kept outside this repository.
- `public/fonts/`: one small self-hosted Source Serif 4 subset, its OFL license, and provenance. Only weights 400 and 600 are used.
- `src/content/writing/`: future Markdown notes; drafts and empty sections stay hidden.
- `cv/Kaiming_Liu_CV.tex` and `cv/Kaiming_Liu_CV.pdf`: standalone Overleaf-compatible source and current PDF.

After changing CV facts, run `npm run cv:build` with [Tectonic](https://tectonic-typesetting.github.io/). This regenerates the LaTeX from the canonical data and compiles the PDF. `npm run cv:source` regenerates only the source for Overleaf. The build copies current CV files to public URLs; generated copies are ignored by Git.

## Deployment and recovery

Push to `main`. `.github/workflows/deploy.yml` installs locked dependencies, builds, verifies, and deploys to GitHub Pages. Repository Pages settings must use **GitHub Actions**. Pull requests build without deploying.

The original website is preserved on both the branch and annotated tag `archive/pre-rebuild-20261001` at `f705797`. View it on GitHub or recover it in a separate worktree. No history was rewritten.

The pre-expansion version is preserved at `checkpoint/v3-before-multipage-cv-redesign-20261001` (`9b19150`). Earlier checkpoints remain unchanged.

The deployed version before the single-page refactor is preserved at `checkpoint/v5-before-single-page-final-20261001` (`2dc64b1`). The two-page CV was retained without changes in this refactor.

The deployed version before ML content positioning is preserved at `checkpoint/v6-before-ai-positioning-pass-20261002` (`42de57a`). This content pass retains the website CSS and CV visual design.

See [SITE_MAINTENANCE.md](SITE_MAINTENANCE.md) for content updates, publication, writing and talk workflows, CV maintenance, and privacy rules.

The crawlable `robots.txt` advertises [sitemap.xml](https://kl543.github.io/sitemap.xml). See [SEARCH_CONSOLE_SETUP.md](SEARCH_CONSOLE_SETUP.md) for the owner's remaining manual verification and indexing steps.
