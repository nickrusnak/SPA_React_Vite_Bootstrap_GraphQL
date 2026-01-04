/**
 * Vite Konfiguration für die React SPA
 *
 * Diese Konfiguration richtet HTTPS für lokale Entwicklung ein und
 * konfiguriert einen Proxy zum Backend-Server, um CORS-Probleme zu vermeiden.
 */
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    // React Plugin für Fast Refresh und JSX-Transformation
    react(),
    // mkcert erstellt automatisch lokale SSL-Zertifikate für HTTPS
    mkcert(),
  ],

  server: {
    // Standard-Port für Vite, auch in Backend CORS konfiguriert
    port: 5173,

    // Proxy-Konfiguration um CORS-Probleme zu umgehen
    // Alle Anfragen an /graphql werden an den Backend-Server weitergeleitet
    proxy: {
      '/graphql': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        // Selbstsignierte Zertifikate vom Backend akzeptieren
        secure: false,
      },
    },
  },

  // Pfad-Aliase für saubere Imports (z.B. @/components statt ../../../components)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
