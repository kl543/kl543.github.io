import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync('dist/index.html', 'utf8');
const profile = JSON.parse(readFileSync('src/data/profile.json', 'utf8'));
const papers = JSON.parse(readFileSync('src/data/publications.json', 'utf8'));
const talks = JSON.parse(readFileSync('src/data/talks.json', 'utf8'));
assert.ok(papers.every(paper => ['published', 'preprint'].includes(paper.status)), 'Only verified publications or public preprints');
assert.equal(new Set(papers.map(paper => paper.id)).size, papers.length, 'Unique publication IDs');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'One main heading');
assert.ok(html.includes('<html lang="en"'));
assert.ok(html.includes('rel="canonical" href="https://kl543.github.io/"'));
assert.ok(html.includes(`mailto:${profile.email}`));
assert.ok(!/<script\b/.test(html), 'Homepage must ship no client-side JavaScript');
assert.ok(!/Coming Soon|passionate about|cutting-edge/i.test(html));
assert.equal(html.includes('id="publications"'), papers.length > 0, 'No empty publications section');
assert.equal(html.includes('id="talks"'), talks.length > 0, 'No empty talks section');
assert.deepEqual(readFileSync('dist/cv/Kaiming_Liu_CV.pdf'), readFileSync('cv/Kaiming_Liu_CV.pdf'));
assert.deepEqual(readFileSync('dist/assets/cv/Kaiming_Liu_CV.pdf'), readFileSync('cv/Kaiming_Liu_CV.pdf'));
assert.ok(readFileSync('cv/Kaiming_Liu_CV.pdf').subarray(0, 5).toString() === '%PDF-');
for (const match of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) {
  const path = match[1];
  assert.ok(existsSync(join('dist', path, path.endsWith('/') ? 'index.html' : '')), `Missing local asset: ${path}`);
}
for (const match of html.matchAll(/href="\/#([^"]+)"/g)) {
  assert.ok(html.includes(`id="${match[1]}"`), `Missing fragment: ${match[1]}`);
}
assert.ok(existsSync('dist/404.html'));
const writing = readdirSync('src/content/writing').filter(file => file.endsWith('.md'));
if (!writing.length) assert.ok(!html.includes('id="writing"'), 'No empty writing section');
console.log('Static output, canonical URL, zero JavaScript, assets, fragments, and CV copies verified.');
