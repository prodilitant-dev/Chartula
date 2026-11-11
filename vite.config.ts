import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { version } from './package.json'; // <-- Импортируем версию напрямую

export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.ico'],
      manifest: {
        name: 'Chartula — Блокнот',
        short_name: 'Chartula',
        description: 'Цифровой блокнот мастера',
        theme_color: '#d97a38',
        background_color: '#1a1b1f',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\./,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ]
});