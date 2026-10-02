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
assert.ok(!/Coming Soon|passionate about|cutting-edge/i.test(html));
assert.equal(html.includes('id="publications"'), papers.length > 0, 'No empty publications section');
assert.equal(html.includes('id="talks"'), talks.length > 0, 'No empty talks section');
assert.deepEqual(readFileSync('dist/cv/Kaiming_Liu_CV.pdf'), readFileSync('cv/Kaiming_Liu_CV.pdf'));
assert.deepEqual(readFileSync('dist/assets/cv/Kaiming_Liu_CV.pdf'), readFileSync('cv/Kaiming_Liu_CV.pdf'));
assert.ok(readFileSync('cv/Kaiming_Liu_CV.pdf').subarray(0, 5).toString() === '%PDF-');
// Check links across pages: a new Research fragment must exist at its destination,
// rather than merely pointing at an HTML file which happens to exist.
const htmlFiles = directory => readdirSync(directory, { withFileTypes: true }).flatMap(item => {
  const path = join(directory, item.name);
  return item.isDirectory() ? htmlFiles(path) : item.name.endsWith('.html') ? [path] : [];
});
const redirects = new Set(['contact.html', 'coursework.html', 'interests.html', 'projects.html']);
for (const file of htmlFiles('dist')) {
  const source = readFileSync(file, 'utf8');
  const relative = file.slice('dist/'.length);
  const pathname = relative === 'index.html' ? '/' : relative.endsWith('/index.html') ? `/${relative.slice(0, -10)}` : `/${relative}`;
  const url = new URL(pathname, profile.website);
  assert.ok(!/<script\b/.test(source), `${file}: no browser JavaScript`);
  assert.ok(source.includes('<html lang="en"'), `${file}: language`);
  if (!redirects.has(relative)) {
    assert.equal((source.match(/<h1\b/g) || []).length, 1, `${file}: one main heading`);
    const canonical = source.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(canonical, url.href, `${file}: canonical URL`);
    assert.ok(source.includes('href="/research/"'), `${file}: Research navigation`);
    assert.ok(source.includes(`href="${profile.cvUrl}"`), `${file}: CV navigation`);
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
const researchHtml = readFileSync('dist/research/index.html', 'utf8');
assert.equal(new Set(research.projects.map(project => project.id)).size, research.projects.length, 'Unique project IDs');
for (const project of research.projects) {
  assert.ok(project.paragraphs.length > 0, `${project.id}: substantive research content`);
  assert.ok(researchHtml.includes(`id="${project.id}"`));
  if (project.selected) assert.ok(html.includes(`href="/research/#${project.id}"`), `${project.id}: Home links to detail`);
  if (project.workflow) {
    assert.ok(researchHtml.includes(`aria-label="${project.workflow.label}"`), `${project.id}: accessible workflow`);
    assert.ok(researchHtml.includes(`id="${project.id}-caption"`), `${project.id}: caption`);
  }
}
assert.ok(existsSync('dist/fonts/academic-serif-latin.woff2'));
assert.ok(readFileSync('dist/fonts/OFL.txt', 'utf8').includes('SIL OPEN FONT LICENSE'));
assert.ok(existsSync('dist/404.html'));
const writing = readdirSync('src/content/writing').filter(file => file.endsWith('.md'));
if (!writing.length) assert.ok(!html.includes('id="writing"'), 'No empty writing section');
console.log('All pages: headings, navigation, canonical URLs, zero JavaScript, local links/fragments, research workflows, font license, and CV copies verified.');
