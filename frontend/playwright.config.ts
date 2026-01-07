import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Konfiguration für E2E Tests
 * Testet das Frontend gegen das laufende Backend
 */
export default defineConfig({
  // Testverzeichnis
  testDir: './e2e',
  
  // Parallele Ausführung deaktivieren für einfacheres Debugging
  fullyParallel: false,
  
  // Fehler bei console.error werfen
  forbidOnly: !!process.env.CI,
  
  // Retries bei Flakiness
  retries: process.env.CI ? 2 : 0,
  
  // Reporter
  reporter: 'html',
  
  // Gemeinsame Einstellungen für alle Tests
  use: {
    // Base URL für relative Navigationen
    baseURL: 'https://localhost:5173',
    
    // SSL-Zertifikat-Fehler ignorieren (self-signed)
    ignoreHTTPSErrors: true,
    
    // Screenshots bei Fehlern
    screenshot: 'only-on-failure',
    
    // Trace bei Fehlern
    trace: 'on-first-retry',
  },

  // Projekte (Browser)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Dev Server starten vor Tests (optional, falls nicht manuell gestartet)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'https://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  //   ignoreHTTPSErrors: true,
  // },
});
