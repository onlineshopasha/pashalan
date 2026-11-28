import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

function githubPagesSpaFallbackPlugin() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      const distDir = path.resolve(import.meta.dirname, 'dist');
      const indexHtml = path.join(distDir, 'index.html');
      const notFoundHtml = path.join(distDir, '404.html');
      const noJekyllFile = path.join(distDir, '.nojekyll');
      const assetsDir = path.join(distDir, 'assets');
      const buildStamp = Date.now().toString(36);

      if (fs.existsSync(distDir)) {
        fs.writeFileSync(noJekyllFile, '');
      }

      // Permanent anti-white-screen protection behind ArvanCloud CDN (max-age=600):
      // 1. Always serve stable /assets/app.js and /assets/app.css with ?v=<stamp> cache buster
      //    so ANY cached index.html (even from weeks ago) gets HTTP 200 on /assets/app.js?v=...
      // 2. Also keep copies of all historical hashed filenames so browsers holding older HTML never 404.
      if (fs.existsSync(assetsDir) && fs.existsSync(indexHtml)) {
        let htmlContent = fs.readFileSync(indexHtml, 'utf8');
        const jsMatch = htmlContent.match(/\/assets\/([A-Za-z0-9_.-]+\.js)/);
        const cssMatch = htmlContent.match(/\/assets\/([A-Za-z0-9_.-]+\.css)/);
        const mainJs = jsMatch ? jsMatch[1] : 'app.js';
        const mainCss = cssMatch ? cssMatch[1] : 'app.css';

        // Rewrite HTML <script>/<link> attributes to stable /assets/app.js?v=<stamp> & /assets/app.css?v=<stamp>
        htmlContent = htmlContent
          .replace(/src="\/assets\/[A-Za-z0-9_.-]+\.js(\?[^"]*)?"/g, `src="/assets/app.js?v=${buildStamp}"`)
          .replace(/href="\/assets\/[A-Za-z0-9_.-]+\.css(\?[^"]*)?"/g, `href="/assets/app.css?v=${buildStamp}"`);
        fs.writeFileSync(indexHtml, htmlContent, 'utf8');
        fs.copyFileSync(indexHtml, notFoundHtml);

        const legacyJsNames = [
          'app.js',
          'index.js',
          'index-BpZTsJgG.js',
          'index-C-SyN6aS.js',
          'index-BhacnjE9.js',
          'index-BIFUKSbS.js',
          'index-BvjG_j24.js',
          'index-BfPKz33B.js',
          'index-CUXg0d1S.js',
          'index-CObQ4Yic.js',
          'index-Bbr3Ptoe.js',
          'index-DYLn_9Uj.js',
        ];
        const legacyCssNames = [
          'app.css',
          'index.css',
          'index-DVzZyg9M.css',
          'index-BRCwNItw.css',
          'index-zK14iApv.css',
          'index-xqO56WEK.css',
          'index-DVa64PmZ.css',
          'index-BjjXo4zz.css',
          'index-CJlvsXUw.css',
        ];

        const srcJs = path.join(assetsDir, mainJs);
        if (fs.existsSync(srcJs)) {
          for (const alias of legacyJsNames) {
            const dest = path.join(assetsDir, alias);
            if (dest !== srcJs) {
              fs.copyFileSync(srcJs, dest);
            }
          }
        }
        const srcCss = path.join(assetsDir, mainCss);
        if (fs.existsSync(srcCss)) {
          for (const alias of legacyCssNames) {
            const dest = path.join(assetsDir, alias);
            if (dest !== srcCss) {
              fs.copyFileSync(srcCss, dest);
            }
          }
        }

        // Pre-create key SEO SPA route index.html files so GitHub Pages returns HTTP 200 (not 404)
        const staticSpaRoutes = [
          'blog',
          'blog/convert-instagram-followers-to-website-buyers',
          'templates',
          'tools',
          'services',
          'about',
          'contact',
          'calculator',
          'domain-checker',
          'ai-studio',
          'tracker',
          'auth',
        ];
        for (const route of staticSpaRoutes) {
          const routeDir = path.join(distDir, route);
          fs.mkdirSync(routeDir, { recursive: true });
          fs.copyFileSync(indexHtml, path.join(routeDir, 'index.html'));
        }
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
          entryFileNames: 'assets/app.js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/app.css';
            }
            return 'assets/[name]-[hash][extname]';
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
