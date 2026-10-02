import { getCollection } from 'astro:content';
import profile from '../data/profile.json';

export async function GET() {
  const writing = (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => a.id.localeCompare(b.id));
  const urls = [
    profile.website,
    ...writing.map(post => new URL(`writing/${post.id}/`, profile.website).href),
  ];
  const escapeXml = (url: string) => url.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
