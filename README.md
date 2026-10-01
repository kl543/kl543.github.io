# Kaiming Liu — academic website

Source for [kl543.github.io](https://kl543.github.io/), a small, static academic homepage built with Astro and plain CSS. No browser JavaScript, analytics, backend, or external fonts.

## Local development

Use Node 24 (or Node ≥22.12):

```sh
npm ci
npm run dev
```

`npm run build` builds and checks the static site. `npm run preview` serves the production output. Dependencies and generated output can be removed after use: `node_modules/`, `dist/`, and `.astro/`.

## Content and CV

- `src/data/profile.json`: canonical public bio, research, education, dates, links, experience, and skills.
- `src/data/publications.json`: verified papers; empty lists hide the section.
- `src/pages/index.astro`: homepage structure.
- `src/styles/global.css`: restrained styling and responsive layout.
- `public/images/kaiming-liu.jpg`: compressed portrait; the original image is kept outside this repository.
- `src/content/writing/`: future Markdown notes; drafts and empty sections stay hidden.
- `cv/Kaiming_Liu_CV.tex` and `cv/Kaiming_Liu_CV.pdf`: standalone Overleaf-compatible source and current PDF.

After changing CV facts, run `npm run cv:build` with [Tectonic](https://tectonic-typesetting.github.io/). This regenerates the LaTeX from the canonical data and compiles the PDF. `npm run cv:source` regenerates only the source for Overleaf. The build copies current CV files to public URLs; generated copies are ignored by Git.

## Deployment and recovery

Push to `main`. `.github/workflows/deploy.yml` installs locked dependencies, builds, verifies, and deploys to GitHub Pages. Repository Pages settings must use **GitHub Actions**. Pull requests build without deploying.

The original website is preserved on both the branch and annotated tag `archive/pre-rebuild-20261001` at `f705797`. View it on GitHub or recover it in a separate worktree. No history was rewritten.

See [SITE_MAINTENANCE.md](SITE_MAINTENANCE.md) for content updates, publication and writing workflows, CV maintenance, and privacy rules.
