import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// Bij de online build (GitHub Pages) staat de app onder /kotoba/.
// Lokaal (npm run dev) blijft het gewoon "/".
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/kotoba/' : '/',
  plugins: [
    svelte(),
    // Maakt van de web-app een installeerbare app (PWA): eigen icoon,
    // schermvullend, en de schil werkt offline.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kotoba — Japanse woorden',
        short_name: 'Kotoba',
        description: 'Verzamel en leer je Japanse woorden.',
        lang: 'nl',
        theme_color: '#c1352b',
        background_color: '#f6f3ec',
        display: 'standalone',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Het woordenboek (dict/*.dat.gz, 17MB) NIET meebakken in de offline-cache.
        globIgnores: ['**/dict/**'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      devOptions: { enabled: false },
    }),
  ],
}))
