/**
 * Vite PWA configuration for followgod
 * Caches Cloudinary images and page assets for instant loading
 */
import { VitePWA } from 'vite-plugin-pwa'

export const pwaConfig = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['**/*.{js,css,html,ico,png,svg,woff2}'],
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        // Cache Cloudinary images (stale-while-revalidate = instant from cache, update in bg)
        urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\/image\/upload\/.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'cloudinary-images',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Cache navigation requests for instant route transitions
        urlPattern: /\/[a-zA-Z0-9\/_-]*$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 24 hours
          },
          networkTimeoutSeconds: 3,
        },
      },
      {
        // Cache Font Awesome & other static CDN assets
        urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|eot)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
    ],
    // Skip waiting so the new SW activates immediately after install
    skipWaiting: true,
    clientsClaim: true,
  },
  manifest: {
    name: 'FOLLOW GOD',
    short_name: 'FG',
    description: 'Faith-inspired fashion for everyday wear',
    theme_color: '#111827',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: 'https://res.cloudinary.com/djdbcoyot/image/upload/v1781776847/zfp64sddl6r4e7stmelk.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  },
})