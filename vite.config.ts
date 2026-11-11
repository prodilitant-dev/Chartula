import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Важно для GitHub Pages, чтобы все пути были относительными
  base: './', 
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
        
        // Эти две строки решают проблему с установкой на GitHub Pages:
        start_url: './',
        scope: './',
        
        icons: [
          {
            src: 'icons/192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Кешируем статику для офлайн-режима
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\./,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
});