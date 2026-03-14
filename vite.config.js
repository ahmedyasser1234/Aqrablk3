import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Aqrab Media',
        short_name: 'Aqrab',
        description: 'Aqrab Media - Digital Marketing & Production',
        theme_color: '#0d0e1b',
        icons: [
          {
            src: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
