import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function githubPagesSpaFallbackPlugin() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      const distDir = path.resolve(import.meta.dirname, 'dist');
      const indexHtml = path.join(distDir, 'index.html');
      const notFoundHtml = path.join(distDir, '404.html');
      const noJekyllFile = path.join(distDir, '.nojekyll');
      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, notFoundHtml);
      }
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(noJekyllFile, '');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      githubPagesSpaFallbackPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'icon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
        ],
        manifest: {
          id: '/',
          name: 'پاشالان — طراحی سایت، ۱۴۰ طرح زنده و هوش مصنوعی',
          short_name: 'پاشالان',
          description:
            'پلتفرم تخصصی طراحی سایت، ۱۴۰ طرح زنده ایرانی، پکیج ۲۰ میلیونی دامنه .com رایگان، ۱۴ افزونه رایگان تا VIP و مشاور هوش مصنوعی پاشالان.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          dir: 'rtl',
          lang: 'fa',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          navigateFallbackDenylist: [/^\/api\//, /^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/llms/],
          runtimeCaching: [],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'icons-vendor';
            }
            if (
              id.includes('megaTemplatesCatalog') ||
              id.includes('contentPagesData')
            ) {
              return 'catalog-data';
            }
            return undefined;
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
