import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'ПроДилИтант — Блокнот',
        short_name: 'ПроДилИтант',
        description: 'Цифровой блокнот мастера',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a1b1f',
        theme_color: '#d97a38',
        icons: [
          // Пока оставим так, файлы добавим позже
          { src: 'icons/192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2}'],
      }
    })
  ]
});