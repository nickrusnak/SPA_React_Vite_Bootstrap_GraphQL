import { expect, test } from '@playwright/test';

/**
 * E2E Tests für die Buch-App
 * 
 * Testet die wichtigsten User Flows:
 * - Login
 * - Suche
 * - Details anzeigen
 */

test.describe('Buch App E2E Tests', () => {
  
  // Vor jedem Test: Zur Startseite navigieren
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sollte die Login-Seite anzeigen', async ({ page }) => {
    // Prüfen ob Login-Formular sichtbar ist
    await expect(page.getByRole('heading', { name: /anmeldung/i })).toBeVisible();
    await expect(page.getByLabel(/benutzername/i)).toBeVisible();
    await expect(page.getByLabel(/passwort/i)).toBeVisible();
  });

  test('sollte sich einloggen können', async ({ page }) => {
    // Login-Daten eingeben
    await page.getByLabel(/benutzername/i).fill('admin');
    await page.getByLabel(/passwort/i).fill('p');
    
    // Login-Button klicken
    await page.getByRole('button', { name: /anmelden|login/i }).click();
    
    // Warten auf Weiterleitung (z.B. zur Suche)
    await expect(page).toHaveURL(/suche/, { timeout: 10000 });
    
    // Prüfen ob eingeloggt (z.B. Logout-Button sichtbar)
    await expect(page.getByRole('button', { name: /logout|abmelden/i })).toBeVisible();
  });

  test('sollte Bücher suchen können', async ({ page }) => {
    // Erst einloggen
    await page.getByLabel(/benutzername/i).fill('admin');
    await page.getByLabel(/passwort/i).fill('p');
    await page.getByRole('button', { name: /anmelden|login/i }).click();
    await expect(page).toHaveURL(/suche/, { timeout: 10000 });
    
    // Suche durchführen (leere Suche = alle Bücher)
    await page.getByRole('button', { name: /suchen/i }).click();
    
    // Warten auf Ergebnisse
    await expect(page.getByText(/bücher gefunden/i)).toBeVisible({ timeout: 10000 });
  });

  test('sollte Buchdetails anzeigen können', async ({ page }) => {
    // Erst einloggen
    await page.getByLabel(/benutzername/i).fill('admin');
    await page.getByLabel(/passwort/i).fill('p');
    await page.getByRole('button', { name: /anmelden|login/i }).click();
    await expect(page).toHaveURL(/suche/, { timeout: 10000 });
    
    // Suche durchführen
    await page.getByRole('button', { name: /suchen/i }).click();
    await expect(page.getByText(/bücher gefunden/i)).toBeVisible({ timeout: 10000 });
    
    // Ersten Details-Link klicken
    await page.getByRole('link', { name: /details/i }).first().click();
    
    // Prüfen ob Detailseite geladen
    await expect(page.getByRole('heading', { name: /buchdetails/i })).toBeVisible();
    await expect(page.getByText(/isbn/i)).toBeVisible();
  });
});
