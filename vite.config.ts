import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  // Load env file based on `mode` in the current working directory.
  // const env = loadEnv(mode, process.cwd(), "");
  // console.log({ mode, env });
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "prompt",

        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',

        includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],

        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],

          globIgnores: ["**/node_modules/**", "**/dev-dist/**"],
        },

        devOptions: {
          enabled: true,
          type: "module",
        },

        manifest: {
          name: "PWA PoC",
          short_name: "PWA PoC",
          description: "A Proof of Concept for PWA with Push Notifications",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
    server: {
      host: "0.0.0.0",
      port: 3000
    },
  };
});
