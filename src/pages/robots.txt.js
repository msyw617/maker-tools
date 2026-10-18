// Built from astro.config `site`, so the sitemap URL never drifts from the canonical domain.
export const GET = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap-index.xml', site)}\n`);
