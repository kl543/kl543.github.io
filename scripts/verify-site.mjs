import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync('dist/index.html', 'utf8');
const profile = JSON.parse(readFileSync('src/data/profile.json', 'utf8'));
const papers = JSON.parse(readFileSync('src/data/publications.json', 'utf8'));
const talks = JSON.parse(readFileSync('src/data/talks.json', 'utf8'));
const research = JSON.parse(readFileSync('src/data/research.json', 'utf8'));
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
for (const file of htmlFiles('dist')) {
  const source = readFileSync(file, 'utf8');
  const relative = file.slice('dist/'.length);
  const pathname = relative === 'index.html' ? '/' : relative.endsWith('/index.html') ? `/${relative.slice(0, -10)}` : `/${relative}`;
  const url = new URL(pathname, profile.website);
  assert.ok(!/<script\b/.test(source), `${file}: no browser JavaScript`);
  assert.ok(source.includes('<html lang="en"'), `${file}: language`);
  const isRedirect = /http-equiv="refresh"/.test(source);
  if (!isRedirect) {
    assert.equal((source.match(/<h1\b/g) || []).length, 1, `${file}: one main heading`);
    const canonical = source.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(canonical, url.href, `${file}: canonical URL`);
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
console.log('Single-page content, professional links, headings/canonicals, zero JavaScript, local links/anchors, Research redirect, font license, and CV copies verified.');
