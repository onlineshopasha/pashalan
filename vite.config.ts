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
      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, notFoundHtml);
      }
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(noJekyllFile, '');
      }

      // Permanent anti-white-screen protection:
      // Create backward-compatible copies for all previous hashed filenames so
      // if ArvanCloud CDN or a user's mobile browser serves a cached index.html,
      // the requested JS/CSS file still exists (HTTP 200) and never white-screens.
      const assetsDir = path.join(distDir, 'assets');
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        const mainJs = files.find((f) => f.endsWith('.js') && !f.endsWith('.map'));
        const mainCss = files.find((f) => f.endsWith('.css'));

        const legacyJsNames = [
          'app.js',
          'index.js',
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
          'index-zK14iApv.css',
          'index-xqO56WEK.css',
          'index-DVa64PmZ.css',
          'index-BjjXo4zz.css',
          'index-CJlvsXUw.css',
        ];

        if (mainJs) {
          const srcJs = path.join(assetsDir, mainJs);
          for (const alias of legacyJsNames) {
            const dest = path.join(assetsDir, alias);
            if (dest !== srcJs) {
              fs.copyFileSync(srcJs, dest);
            }
          }
        }
        if (mainCss) {
          const srcCss = path.join(assetsDir, mainCss);
          for (const alias of legacyCssNames) {
            const dest = path.join(assetsDir, alias);
            if (dest !== srcCss) {
              fs.copyFileSync(srcCss, dest);
            }
          }
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
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/app.[ext]',
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
