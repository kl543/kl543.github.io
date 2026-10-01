# Site maintenance

## Design principle

The reference survey included [Jason Wei](https://www.jasonwei.net/), [Tri Dao](https://tridao.me/), [Noam Brown](https://noambrown.com/), [Andrej Karpathy](https://karpathy.ai/), [Yilun Du](https://yilundu.github.io/), and [Shunyu Yao](https://alfredyao.github.io/). It informed a shared set of principles: identify the researcher immediately, explain a coherent research problem, keep links conventional, and let text carry the page. The final layout uses a centered 680 px reading column, Georgia at 18 px / 1.5, a 30 px name, 21 px headings, and one blue-gray accent. A 128 px portrait sits to the right of the intro only. Later sections occupy the full centered column. Mobile uses 17 px text and an 88 px portrait alongside the identity sentence. Detailed education and honors belong in the CV; the homepage retains a short XJTU background note. No external fonts or browser JavaScript are needed.

The CV survey included [Jaehoon Hahm](https://jaehoon-hahm.github.io/Jaehoon_Hahm_CV.pdf), [Yilun Du](https://yilundu.github.io/cv.pdf), [Shunyu Yao](https://alfredyao.github.io/Shunyu_Yao_CV.pdf), and [Tri Dao](https://tridao.me/assets/pdf/cv.pdf). The resulting document uses Latin Modern at 11 pt, one blue-gray accent, an 80 pt section-label column, black bold institutions and project names, and right-aligned italic dates. A short Research Profile replaces the keyword list. Education groups both XJTU stages under one institution; BPIE is explicitly non-degree. Current Research presents three named projects, each with compact method and validation bullets. Page one holds the profile, education, and current research; page two holds publications, prior research, teaching, honors, and skills. This page break follows the content hierarchy; recheck it as the CV grows. Avoid shrinking type or adding filler to preserve two pages. No reference prose, source code, or assets were copied.

Keep the page readable and quiet. Do not add cards, decorative effects, badges, empty sections, or a portfolio-style hero.

## Where to edit

| Content | File |
| --- | --- |
| Bio, research, background, contact links | `src/data/profile.json` |
| Education, research roles, teaching, honors, skills, CV update date | `src/data/profile.json` |
| Verified publications and preprints | `src/data/publications.json` |
| Future public talks | `src/data/talks.json` |
| Homepage ordering | `src/pages/index.astro` |
| Typography, spacing, mobile layout | `src/styles/global.css` |
| Portrait | `public/images/kaiming-liu.jpg` |
| Future writing | `src/content/writing/*.md` |
| CV typography and generated content | `scripts/generate-cv.mjs` |
| Standalone CV deliverables | `cv/Kaiming_Liu_CV.tex`, `cv/Kaiming_Liu_CV.pdf` |

The JSON files are the public source of truth. Profile and publication data are shared by the website and CV generator. Do not silently change dates or earned-degree status. The detailed local evidence audit stays outside the public repository. Education and group dates were reconciled against the owner's February 2026 CV, with earlier personal CVs for teaching and undergraduate research. Current project descriptions were checked against final research summaries, selected reports, and documented implementations. The PNAS paper’s identity was confirmed by the owner; journal status was checked against PNAS, arXiv, publisher metadata, and UIUC.

For CEF, the verified public description names a residual MLP, conditional Gaussian mixture models (cGMMs), multiple parameter candidates, and susceptibility forward checks. For magnetic scattering, it names MLP/ResNet conditional mixtures, powder-averaged neutron maps, exact Sunny forward checks, classical fits as references, and noise/scale/offset studies. For NNBF/VMC, it names JAX, lattice Hubbard models, parallel GPU computation, profiling, and numerical correctness checks. Do not reinterpret mixture weights as calibrated posterior coverage, reconstruction as unique parameter recovery, or exploratory timings as established speedups. The owner confirmed PHYS 212 teaching in Spring and Fall 2026 on October 1, 2026; the verified PHYS 102 appointment in Aug–Dec 2023 remains in the CV.

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

Review the content, then change `draft` to `false`. The homepage automatically gains a Writing section and inline link, and the note appears at `/writing/descriptive-slug/`. No empty writing index is published. For math rendering, add a focused Markdown integration only when an actual note needs it.

## Add talks later

Add only a verified public talk to `src/data/talks.json`. Each object has `title`, `event`, and an ISO `date` (`YYYY-MM-DD`); `url`, `slides`, and `video` are optional public links. Dates determine descending order. The homepage gains a Talks section and inline link automatically, using the same quiet year/title layout as publications. Leave the list empty until there is real content. Talks do not enter the CV automatically; revise its content deliberately when needed.

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

The first Astro rebuild is also preserved at `checkpoint/v1-before-jason-jaehoon-polish-20261001` (commit `4ed546b`). The older archive branch and tag remain unchanged.

The deployed second version is preserved at `checkpoint/v2-before-final-research-profile-polish-20261001` (commit `8507c00`), created before the final researcher-profile refinement.
