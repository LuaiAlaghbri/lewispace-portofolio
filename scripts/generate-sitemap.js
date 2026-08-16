import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const portfolioPath = path.join(__dirname, '..', 'src', 'data', 'portfolio.js');
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const domain = 'https://lewispace.dev';

try {
  const content = fs.readFileSync(portfolioPath, 'utf-8');
  
  // Extract project IDs using a regex
  const idRegex = /"?id"?:\s*(\d+)/g;
  let match;
  const projectIds = new Set();
  while ((match = idRegex.exec(content)) !== null) {
    projectIds.add(match[1]);
  }

  const date = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Home page
  sitemap += `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${date}</lastmod>\n    <priority>1.0</priority>\n  </url>\n`;

  // Project pages
  for (const id of Array.from(projectIds).sort((a, b) => Number(a) - Number(b))) {
    sitemap += `  <url>\n    <loc>${domain}/project/${id}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  sitemap += `</urlset>\n`;

  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Successfully generated sitemap.xml with ${projectIds.size + 1} URLs.`);
} catch (error) {
  console.error('Error generating sitemap:', error);
}
