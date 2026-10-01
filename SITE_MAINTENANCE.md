# Site maintenance

## Design principle

[Jason Wei](https://www.jasonwei.net/) informed the visual restraint: text first, generous space, modest portrait, inline links, and almost no interface decoration. [Jaehoon Hahm’s homepage and CV](https://jaehoon-hahm.github.io/) informed the academic organization: identity and interests first, dated education and research, genuine publications, and concise teaching and skills. No reference prose, source code, or assets were copied.

Keep the page readable and quiet. Do not add cards, decorative effects, badges, empty sections, or a portfolio-style hero.

## Where to edit

| Content | File |
| --- | --- |
| Bio, research, background, contact links | `src/data/profile.json` |
| Education, research roles, teaching, honors, skills, CV update date | `src/data/profile.json` |
| Verified publications and preprints | `src/data/publications.json` |
| Homepage ordering | `src/pages/index.astro` |
| Typography, spacing, mobile layout | `src/styles/global.css` |
| Portrait | `public/images/kaiming-liu.jpg` |
| Future writing | `src/content/writing/*.md` |
| CV typography and generated content | `scripts/generate-cv.mjs` |
| Standalone CV deliverables | `cv/Kaiming_Liu_CV.tex`, `cv/Kaiming_Liu_CV.pdf` |

The JSON files are the public source of truth, shared by the website and CV generator. Do not silently change dates or earned-degree status. The detailed local evidence audit stays outside the public repository. Education and group dates were reconciled against the latest personal CV, `Jump_CV_Kaiming.pdf` (February 2026), with earlier personal CVs for teaching, undergraduate research, and education. Current inverse-problem descriptions come from the owner’s October 2026 instructions. The PNAS paper’s identity was confirmed by the owner; journal status was checked against PNAS, arXiv, publisher metadata, and UIUC.

## Build and deploy

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Run `npm run cv:build` before the site build whenever shared CV facts change. Review the PDF and the website at 1440, 1280, and 390 px. Commit source, lockfile, LaTeX, and PDF, then push to `main`. GitHub Actions deploys automatically. Check the workflow and the live homepage and CV after deployment. `site` is the user-site origin `https://kl543.github.io`; do not add a repository base path.

The old `/contact.html`, `/interests.html`, `/projects.html`, and `/coursework.html` addresses redirect to relevant homepage sections. The original CV address `/assets/cv/Kaiming_Liu_CV.pdf` serves the current PDF. Keep these compatibility routes while external bookmarks may exist.

On the owner’s Mac, the default `~/.config` directory is owned by root. GitHub CLI authorization is therefore saved in the writable `~/Library/Application Support/gh` directory, with credentials in the macOS keychain. This repository’s local Git credential helper already uses that directory. For manual `gh` commands on this Mac, prefix them with `GH_CONFIG_DIR="$HOME/Library/Application Support/gh"`; this machine-specific detail is not required for GitHub Actions or another checkout.

## Add a publication

Add one object to `src/data/publications.json`, using the verified author order, current title, year, status, and public URL:

```json
{
  "id": "unique-short-id",
  "title": "Verified paper title",
  "authors": ["First Author", "Kaiming Liu"],
  "venue": "Journal or conference name",
  "citation": "volume, pages or article number",
  "year": 2027,
  "status": "published",
  "url": "https://doi.org/verified-doi",
  "preprint": "https://arxiv.org/abs/verified-id"
}
```

Use `"status": "preprint"` and `"venue": "arXiv"` for a public preprint. Omit `preprint` if unavailable. A manuscript in preparation is not a publication. The homepage shows entries by descending year; the CV separates published papers from preprints. Run `npm run cv:build`, review the outputs, and commit both. No template changes are needed for the next paper; an empty list hides Publications.

## Add writing later

Create `src/content/writing/descriptive-slug.md`:

```markdown
---
title: A real technical note
description: A concise description of the note.
date: 2027-01-15
draft: true
---

Write the actual note here.
```

Review the content, then change `draft` to `false`. The homepage automatically gains a Writing section and navigation link, and the note appears at `/writing/descriptive-slug/`. No empty writing index is published. For math rendering, add a focused Markdown integration only when an actual note needs it.

## Update the CV

Edit the canonical JSON and `updated` date, then run:

```sh
npm run cv:build
```

Tectonic uses a temporary output directory and retains only the PDF. The standalone `.tex` also compiles in Overleaf with pdfLaTeX. For Overleaf, run `npm run cv:source`, upload the generated `.tex`, compile, and replace `cv/Kaiming_Liu_CV.pdf` with the downloaded PDF. Commit both files. The site build checks that the LaTeX source matches the JSON and copies the PDF to its public URL. Always visually inspect the PDF and check selectable text after recompiling; the build does not independently prove that an externally compiled PDF matches the source.

## Privacy and content rules

- Publish conservative descriptions of ongoing work; no private benchmarks, internal version numbers, checkpoints, paths, job logs, or collaborator discussions.
- Keep professional email and links. Exclude phone, home address, identity documents, private email, and family information.
- Verify degree status, dates, authorship, and publication status. Omit unresolved facts; never invent results, awards, internships, or metrics.
- Do not publish planned coursework, stale recruiting goals, or unrelated template accomplishments.
- No empty Publications, Writing, Talks, News, or similar sections. No analytics unless the owner later requests them.
- Keep raw photos, reference downloads, private CV evidence, and scientific files outside the repository.

## Cleanup and recovery

After stopping local servers, `node_modules/`, `dist/`, `.astro/`, and generated `public/cv/` and `public/assets/cv/` copies are safe to remove. `npm ci` and the next build recreate them. Keep `cv/` and the source portrait. Do not remove Git history.

Recover the old site without changing the main working copy:

```sh
git worktree add ../kl543-old-site refs/tags/archive/pre-rebuild-20261001
```

To roll back a published change, use a normal revert or a new restoration commit and push; do not force-push.
