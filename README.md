# Kaiming Liu — academic website

Source for [kl543.github.io](https://kl543.github.io/), a small, static academic website built with Astro and plain CSS. Home introduces the researcher and selected work; [Research](https://kl543.github.io/research/) explains the projects and their validation. No browser JavaScript, analytics, backend, or external font requests.

## Local development

Use Node 24 (or Node ≥22.12):

```sh
npm ci
npm run dev
```

`npm run build` builds and checks the static site. `npm run preview` serves the production output. Dependencies and generated output can be removed after use: `node_modules/`, `dist/`, and `.astro/`.

## Content and CV

- `src/data/profile.json`: canonical public bio, education, dates, links, CV experience, and skills.
- `src/data/research.json`: public project explanations, homepage summaries, and workflow labels.
- `src/data/publications.json`: verified papers; empty lists hide the section.
- `src/data/talks.json`: future public talks; an empty list stays hidden.
- `src/pages/index.astro` and `src/pages/research.astro`: page structure.
- `src/components/Workflow.astro`: original, accessible research schematics using HTML and inline SVG arrows.
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

See [SITE_MAINTENANCE.md](SITE_MAINTENANCE.md) for content updates, publication, writing and talk workflows, CV maintenance, and privacy rules.
