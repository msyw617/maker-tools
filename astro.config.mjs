import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://craftnumbers.com',
  integrations: [sitemap({ filter: (p) => new URL(p).pathname !== '/', i18n: { defaultLocale: 'en', locales: { en: 'en', ko: 'ko' } } })],
});
