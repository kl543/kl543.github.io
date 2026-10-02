# Site maintenance

## Design principle

The current reference survey included [Jason Wei](https://www.jasonwei.net/), [Tri Dao](https://tridao.me/), [Noam Brown](https://noambrown.com/), [Andrej Karpathy](https://karpathy.ai/), [Yilun Du](https://yilundu.github.io/), and [Jaehoon Hahm](https://jaehoon-hahm.github.io/). It informed conventional navigation, immediate researcher identification, problem-first explanations, and restrained typography. Home is the short introduction and research entry point; `/research/` provides substantive project explanations. Publications remain on Home until there is enough material to justify a separate page. Writing and Talks stay hidden until populated. No reference prose, source code, or assets were copied.

Source Serif 4, Georgia, and system sans were compared in actual desktop and mobile renders. Source Serif 4 was chosen for its open letterforms, readable long paragraphs, and distinction from the sans navigation and metadata. The website uses a centered 720 px column, 18 px / 1.55 body, 32 px name, 23 px section headings, one dark navy accent (`#244865`), and thin gray rules. The portrait is 132 px on desktop and 88 px on mobile. Mobile body text is 17 px; the smallest width uses a 76 px portrait. Numbered selected projects link to their corresponding Research sections. The research workflows use semantic ordered lists with decorative inline SVG arrows, and change from four columns to a vertical sequence on phones.

The self-hosted Latin font is approximately 33 KB, restricted to weights 400–600; only 400 and 600 are used. Its internal name and CSS family are `Academic Serif` because Adobe reserves the name Source for modified fonts. See `public/fonts/README.txt` and `OFL.txt` for provenance and licensing. Georgia is the fallback, with system sans for navigation and metadata. No external font service or browser JavaScript is needed.

The CV survey included the current linked PDFs of [Jaehoon Hahm](https://jaehoon-hahm.github.io/Jaehoon_Hahm_CV.pdf), [Yilun Du](https://yilundu.github.io/cv.pdf), [Shunyu Yao](https://alfredyao.github.io/Shunyu_Yao_CV.pdf), and [Tri Dao](https://tridao.me/assets/pdf/cv.pdf). Three actual two-page candidates were compiled and visually compared: Libertinus Serif with sans labels, TeX Gyre Pagella with Heros, and NewTX Text with sans labels. Pagella/Heros was selected for clear body text, legible italics, stronger project headings, and compact two-line bullets. All use readily available Overleaf packages.

The final CV uses 11 pt Pagella, Heros section labels and metadata, muted forest labels (`#35584F`), dark navy institutions and links (`#244865`), near-black body, and gray dates. The 80 pt label column and 14 pt gutter align throughout. Body leading is increased by 4%; bullet spacing is 3 pt, project spacing 8 pt, gaps between entries 10 pt, and gaps between sections 18 pt. A 28 pt name and a thin gray header rule separate contacts from the document. Dates are right-aligned sans rather than competing with italic roles. Teaching shares one UIUC heading. Page one holds Research Profile, grouped education, and current research; page two holds publications, prior research, teaching, honors, and skills. Recheck balance as content grows; do not shrink the font or add filler to preserve two pages.

The Research page uses a smaller 23 px name link so its own heading leads the hierarchy. Keep the page readable and quiet. Do not add cards, decorative effects, badges, empty sections, or a portfolio-style hero.

## Where to edit

| Content | File |
| --- | --- |
| Bio, background, contact links | `src/data/profile.json` |
| Home research summaries, Research prose and workflow labels | `src/data/research.json` |
| Education, research roles, teaching, honors, skills, CV update date | `src/data/profile.json` |
| Verified publications and preprints | `src/data/publications.json` |
| Future public talks | `src/data/talks.json` |
| Homepage ordering | `src/pages/index.astro` |
| Research page structure | `src/pages/research.astro` |
| Accessible workflow diagrams | `src/components/Workflow.astro` |
| Typography, spacing, mobile layout | `src/styles/global.css` |
| Portrait | `public/images/kaiming-liu.jpg` |
| Self-hosted font, license and provenance | `public/fonts/` |
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

Run `npm run cv:build` before the site build whenever shared CV facts change. Review both PDF pages and Home and Research at 1440, 1280, 768, 390, and 320 px, including diagram flow, overflow, keyboard navigation, and contrast. The build checks all generated pages for headings, canonical URLs, navigation, JavaScript, local links/fragments, workflow labels, the font license, and identical CV copies. Commit source, lockfile, LaTeX, and PDF, then push to `main`. GitHub Actions deploys automatically. Check the workflow and live Home, Research, and CV after deployment. `site` is the user-site origin `https://kl543.github.io`; do not add a repository base path.

The old `/contact.html` and `/coursework.html` addresses redirect to relevant homepage sections. `/interests.html` and `/projects.html` redirect to `/research/`. The original CV address `/assets/cv/Kaiming_Liu_CV.pdf` serves the current PDF. Keep these compatibility routes while external bookmarks may exist.

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

The version before the multi-page expansion and CV redesign is preserved at `checkpoint/v3-before-multipage-cv-redesign-20261001` (commit `9b19150`). All earlier recovery references remain unchanged.
