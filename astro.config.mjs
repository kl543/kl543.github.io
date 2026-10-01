import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kl543.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
