import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Cloudflare Pages 환경변수 SITE_URL (예: https://내도메인.com). 없으면 example.com + noindex로 빌드된다.
  site: process.env.SITE_URL || 'https://example.com',
  integrations: [sitemap({ filter: (p) => new URL(p).pathname !== '/', i18n: { defaultLocale: 'en', locales: { en: 'en', ko: 'ko' } } })],
});
