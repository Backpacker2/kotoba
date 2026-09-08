import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Bij de online build (GitHub Pages) staat de app onder /kotoba/.
// Lokaal (npm run dev) blijft het gewoon "/".
export default defineConfig(({ mode }) => ({
  plugins: [svelte()],
  base: mode === 'production' ? '/kotoba/' : '/',
}))
