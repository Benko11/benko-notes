import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      includeAssets: [
        "icons/notepad.svg",
        "icon-192-192.png",
        "icon-512-512.png",
      ],
      manifest: {
        name: "Benko Notes",
        short_name: "Benko Notes",
        description: "Online or offline notepad for all your note-taking needs",
        theme_color: "#c2e0f0",
        icons: [
          {
            src: "/icons/icon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon.svg",
            sizes: "any",
            purpose: "any",
          },
          {
            src: "/icons/icon-maskable.svg",
            sizes: "any",
            purpose: "maskable",
          },
        ],
      },
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg}"],
        navigateFallback: "./index.html",
      },
    }),
  ],
  build: { outDir: "dist" },
});
