// Built from astro.config `site`, so the sitemap URL follows SITE_URL without a second edit.
export const GET = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap-index.xml', site)}\n`);
