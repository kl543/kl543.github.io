import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync('dist/index.html', 'utf8');
const profile = JSON.parse(readFileSync('src/data/profile.json', 'utf8'));
const papers = JSON.parse(readFileSync('src/data/publications.json', 'utf8'));
const talks = JSON.parse(readFileSync('src/data/talks.json', 'utf8'));
const research = JSON.parse(readFileSync('src/data/research.json', 'utf8'));
const decodeHtml = value => value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const title = decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1] || '');
assert.ok(title.startsWith(profile.name) && /Machine Learning Research/.test(title) && /UIUC/.test(title), 'Title identifies person, research field and institution');
assert.ok(html.includes(profile.title) && profile.description.includes('Physics PhD'), 'Physics identity remains visible and in metadata');
assert.equal(decodeHtml(html.match(/<meta name="description" content="([^"]+)"/)?.[1] || ''), profile.description);
assert.ok(html.includes(`>${profile.name}</h1>`) && html.includes(`>${profile.institution}</a>`), 'Visible name and full university');
assert.ok(!/http-equiv="refresh"/.test(html), 'Homepage does not redirect');
assert.ok(papers.every(paper => ['published', 'preprint'].includes(paper.status)), 'Only verified publications or public preprints');
assert.equal(new Set(papers.map(paper => paper.id)).size, papers.length, 'Unique publication IDs');
assert.ok(html.includes(`mailto:${profile.email}`));
assert.ok(!/<nav\b/.test(html), 'Homepage has no navbar');
assert.ok(!/Current work|Selected research|href="\/research\//.test(html), 'Research lives directly on Home');
const linksRow = html.match(/<ul class="contact-links"[^>]*>([\s\S]*?)<\/ul>/)?.[1];
assert.ok(linksRow, 'One professional links row');
const expectedLinks = [`mailto:${profile.email}`, profile.cvUrl, ...(profile.scholar ? [profile.scholar] : []), profile.github, profile.linkedin];
assert.deepEqual([...linksRow.matchAll(/href="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&')), expectedLinks, 'Professional links have the required order');
assert.equal(html.includes('Google Scholar'), Boolean(profile.scholar), 'No guessed or placeholder Scholar link');
assert.ok(!/Coming Soon|passionate about|cutting-edge/i.test(html));
assert.equal(html.includes('id="publications"'), papers.length > 0, 'No empty publications section');
assert.equal(html.includes('id="talks"'), talks.length > 0, 'No empty talks section');
assert.deepEqual(readFileSync('dist/cv/Kaiming_Liu_CV.pdf'), readFileSync('cv/Kaiming_Liu_CV.pdf'));
assert.deepEqual(readFileSync('dist/assets/cv/Kaiming_Liu_CV.pdf'), readFileSync('cv/Kaiming_Liu_CV.pdf'));
assert.ok(readFileSync('cv/Kaiming_Liu_CV.pdf').subarray(0, 5).toString() === '%PDF-');
// Verify fragment destinations, including compatibility redirects back to Home.
const htmlFiles = directory => readdirSync(directory, { withFileTypes: true }).flatMap(item => {
  const path = join(directory, item.name);
  return item.isDirectory() ? htmlFiles(path) : item.name.endsWith('.html') ? [path] : [];
});
const indexableUrls = [];
let homepageSchema;
for (const file of htmlFiles('dist')) {
  const source = readFileSync(file, 'utf8');
  const relative = file.slice('dist/'.length);
  // Google's exact ownership file is plain text, not a canonical content page.
  if (/^google[a-zA-Z0-9]+\.html$/.test(relative) && source.trim() === `google-site-verification: ${relative}`) continue;
  const pathname = relative === 'index.html' ? '/' : relative.endsWith('/index.html') ? `/${relative.slice(0, -10)}` : `/${relative}`;
  const url = new URL(pathname, profile.website);
  const scripts = [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  assert.equal((source.match(/<script\b/g) || []).length, scripts.length, `${file}: complete script elements`);
  assert.equal(scripts.length, relative === 'index.html' ? 1 : 0, `${file}: only homepage structured metadata`);
  for (const [, attributes, json] of scripts) {
    assert.ok(/\btype="application\/ld\+json"/.test(attributes) && !/\b(?:src|on\w+)\s*=/.test(attributes), `${file}: inert JSON-LD, no executable JavaScript`);
    homepageSchema = JSON.parse(json);
  }
  assert.ok(source.includes('<html lang="en"'), `${file}: language`);
  const isRedirect = /http-equiv="refresh"/.test(source);
  const noIndex = [...source.matchAll(/<meta\b[^>]*>/g)].some(([tag]) => /\bname="(?:robots|googlebot)"/i.test(tag) && /\bcontent="[^"]*\bnoindex\b/i.test(tag));
  if (relative === 'index.html') assert.ok(!noIndex, 'Homepage remains indexable');
  if (!isRedirect) {
    assert.equal((source.match(/<h1\b/g) || []).length, 1, `${file}: one main heading`);
    const canonical = source.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(canonical, url.href, `${file}: canonical URL`);
    if (relative !== '404.html' && !noIndex) indexableUrls.push(canonical);
    assert.ok(!/<header[^>]*>[\s\S]*?<nav\b[\s\S]*?<\/header>/.test(source), `${file}: no primary navbar`);
  }
  const ids = [...source.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: unique IDs`);
  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = new URL(match[1].replaceAll('&amp;', '&'), url);
    if (target.origin !== url.origin) continue;
    const destination = join('dist', decodeURIComponent(target.pathname), target.pathname.endsWith('/') ? 'index.html' : '');
    assert.ok(existsSync(destination), `${file}: missing ${target.pathname}`);
    if (target.hash) {
      assert.ok(readFileSync(destination, 'utf8').includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${file}: missing ${target.href}`);
    }
  }
}
assert.equal(homepageSchema['@context'], 'https://schema.org');
assert.equal(homepageSchema['@graph'].length, 2, 'One profile and one website entity');
const profilePage = homepageSchema['@graph'].find(node => node['@type'] === 'ProfilePage');
const website = homepageSchema['@graph'].find(node => node['@type'] === 'WebSite');
assert.ok(profilePage && website, 'ProfilePage and WebSite types');
const person = profilePage.mainEntity;
assert.equal(person['@type'], 'Person');
assert.equal(person.name, profile.name);
assert.equal(person.description, profile.description);
assert.equal(person.affiliation['@type'], 'CollegeOrUniversity');
assert.equal(person.affiliation.name, profile.institution);
assert.equal(person.affiliation.url, profile.education[0].url);
assert.deepEqual(person.sameAs, [profile.github, profile.linkedin], 'Only confirmed identities');
for (const node of [profilePage, person, website]) assert.equal(node.url, profile.website, 'Canonical entity URLs');
assert.equal(website.name, profile.name);
assert.equal(profilePage.isPartOf['@id'], website['@id']);
assert.equal(website.publisher['@id'], person['@id']);
assert.equal(person.image, new URL('images/kaiming-liu.jpg', profile.website).href);
assert.ok(existsSync(join('dist', new URL(person.image).pathname)), 'Crawlable profile image exists');
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), 'Sitemap namespace');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decodeHtml(url));
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'No duplicate sitemap entries');
assert.deepEqual(sitemapUrls.sort(), indexableUrls.sort(), 'Sitemap lists exactly canonical indexable pages, excluding redirects/404');
const robots = readFileSync('dist/robots.txt', 'utf8');
assert.ok(/^User-agent: \*$/m.test(robots) && /^Allow: \/$/m.test(robots) && !/^Disallow:\s*\/\s*$/m.test(robots), 'Robots allows crawling');
assert.ok(robots.includes(`Sitemap: ${new URL('sitemap.xml', profile.website).href}`), 'Robots advertises canonical sitemap');
assert.equal(new Set(research.projects.map(project => project.id)).size, research.projects.length, 'Unique project IDs');
for (const project of research.projects) {
  assert.ok(project.text.length > 0 && html.includes(project.text), `${project.id}: complete text on Home`);
  assert.ok(html.includes(`id="${project.id}"`), `${project.id}: stable Home anchor`);
}
assert.ok(html.includes('id="background"'), 'Stable background anchor');
const legacyResearch = readFileSync('dist/research/index.html', 'utf8');
assert.ok(legacyResearch.includes('content="0;url=/#research"'), 'Research redirects to Home');
assert.ok(legacyResearch.includes('content="noindex, follow"'), 'Legacy research does not compete in search');
assert.ok(legacyResearch.includes(`rel="canonical" href="${profile.website}"`));
assert.ok(!legacyResearch.includes('id="crystal-field"'), 'No duplicated detail content');
assert.ok(existsSync('dist/fonts/academic-serif-latin.woff2'));
assert.ok(readFileSync('dist/fonts/OFL.txt', 'utf8').includes('SIL OPEN FONT LICENSE'));
assert.ok(existsSync('dist/404.html'));
const writing = readdirSync('src/content/writing').filter(file => file.endsWith('.md'));
if (!writing.length) assert.ok(!html.includes('id="writing"'), 'No empty writing section');
console.log('Single-page content, links/anchors, canonicals, inert JSON-LD, indexability, sitemap/robots, no executable JavaScript, redirects, font license, and CV copies verified.');
