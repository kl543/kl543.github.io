# Google Search Console setup

1. Open [Google Search Console](https://search.google.com/search-console/) and sign in.
2. Add a **URL-prefix** property for `https://kl543.github.io/`.
3. Obtain the exact HTML verification file or HTML meta tag from Search Console. For the file method, put the downloaded file in `public/` without renaming or editing it, deploy, then click **Verify**. For the tag method, put Google's exact tag in the homepage `<head>` in `src/layouts/Page.astro`, deploy, then click **Verify**. Keep the verification file/tag afterward; do not invent a token.
4. Use **URL Inspection** for `https://kl543.github.io/`, then **Test live URL**.
5. Click **Request Indexing** for the homepage.
6. Open **Sitemaps** and submit `sitemap.xml` for this property: `https://kl543.github.io/sitemap.xml`.
7. Check **Page indexing**, **URL Inspection**, and **Settings → Crawl stats** later for crawl/indexing status or reported problems.
