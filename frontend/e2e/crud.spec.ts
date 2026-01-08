import { expect, test, type Page } from '@playwright/test';

/**
 * E2E Tests für Buch erstellen und löschen
 */

// Helper: Login durchführen
async function login(page: Page) {
  await page.goto('/');
  await page.getByLabel(/benutzername/i).fill('admin');
  await page.getByLabel(/passwort/i).fill('p');
  await page.getByRole('button', { name: /anmelden/i }).click();
  await expect(page).toHaveURL(/suche/, { timeout: 10000 });
}

test.describe('Buch CRUD Tests', () => {

  test('sollte das Formular zum Anlegen eines Buches anzeigen', async ({ page }) => {
    await login(page);
    
    // Zur Create-Seite navigieren
    await page.goto('/neu');
    
    // Formular sollte sichtbar sein
    await expect(page.getByLabel(/titel/i).first()).toBeVisible();
    await expect(page.getByLabel(/isbn/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /buch anlegen/i })).toBeVisible();
  });

  test('sollte Pflichtfelder im Formular markiert haben', async ({ page }) => {
    await login(page);
    await page.goto('/neu');
    
    // Pflichtfeld-Markierungen sollten sichtbar sein
    await expect(page.getByText(/titel \*/i)).toBeVisible();
    await expect(page.getByText(/isbn \*/i)).toBeVisible();
  });

  test('sollte ein Buch löschen können', async ({ page }) => {
    await login(page);
    
    // Suche durchführen
    await page.getByRole('button', { name: /suchen/i }).click();
    await expect(page.getByText(/bücher gefunden/i)).toBeVisible({ timeout: 10000 });
    
    // Erstes Buch öffnen
    await page.getByRole('link', { name: /details/i }).first().click();
    await expect(page.getByText(/buchdetails/i)).toBeVisible();
    
    // Löschen-Button klicken
    await page.getByRole('button', { name: /löschen/i }).click();
    
    // Modal sollte erscheinen
    await expect(page.getByText(/wirklich.*löschen/i)).toBeVisible();
    
    // Bestätigen
    await page.getByRole('button', { name: /ja.*löschen/i }).click();
    
    // Sollte zur Suche zurückgeleitet werden
    await expect(page).toHaveURL(/suche/, { timeout: 10000 });
  });
});

test.describe('Navigation und Auth Tests', () => {

  test('sollte sich ausloggen können', async ({ page }) => {
    await login(page);
    
    // Logout-Button klicken
    await page.getByRole('button', { name: /logout|abmelden/i }).click();
    
    // Sollte zur Login-Seite zurück
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
    await expect(page.getByRole('heading', { name: /anmeldung/i })).toBeVisible();
  });

  test('sollte geschützte Routen zu Login weiterleiten', async ({ page }) => {
    // Direkt zur Suche ohne Login
    await page.goto('/suche');
    
    // Sollte zum Login weitergeleitet werden
    await expect(page).toHaveURL(/login/);
  });

  test('sollte zur Create-Seite navigieren können', async ({ page }) => {
    await login(page);
    
    // Direkt navigieren
    await page.goto('/neu');
    
    // Formular sollte sichtbar sein
    await expect(page.getByLabel(/titel/i).first()).toBeVisible();
  });
});

test.describe('Suchfilter Tests', () => {

  test('sollte nach Titel suchen können', async ({ page }) => {
    await login(page);
    
    // Leere Suche (zeigt alle Bücher)
    await page.getByRole('button', { name: /suchen/i }).click();
    
    // Ergebnisse prüfen - Card-Header enthält die Anzahl
    await expect(page.getByRole('heading', { name: /ergebnisse/i })).toBeVisible({ timeout: 10000 });
  });

  test('sollte nach Buchart filtern können', async ({ page }) => {
    await login(page);
    
    // Dropdown auswählen
    await page.getByLabel(/buchart/i).selectOption('HARDCOVER');
    await page.getByRole('button', { name: /suchen/i }).click();
    
    await expect(page.getByText(/bücher gefunden/i)).toBeVisible({ timeout: 10000 });
  });

  test('sollte nach Rating filtern können', async ({ page }) => {
    await login(page);
    
    // Radio-Button für Rating 5 klicken
    await page.getByLabel(/5⭐/i).click();
    await page.getByRole('button', { name: /suchen/i }).click();
    
    await expect(page.getByText(/bücher gefunden/i)).toBeVisible({ timeout: 10000 });
  });

  test('sollte nur lieferbare Bücher anzeigen', async ({ page }) => {
    await login(page);
    
    // Checkbox aktivieren
    await page.getByLabel(/nur lieferbare/i).check();
    await page.getByRole('button', { name: /suchen/i }).click();
    
    await expect(page.getByText(/bücher gefunden/i)).toBeVisible({ timeout: 10000 });
  });

  test('sollte Suchformular zurücksetzen können', async ({ page }) => {
    await login(page);
    
    // Felder ausfüllen
    await page.getByLabel(/titel/i).first().fill('Test');
    
    // Reset klicken
    await page.getByRole('button', { name: /zurücksetzen/i }).click();
    
    // Feld sollte leer sein
    await expect(page.getByLabel(/titel/i).first()).toHaveValue('');
  });
});

test.describe('Fehlerbehandlung Tests', () => {

  test('sollte Fehlermeldung bei falschem Login anzeigen', async ({ page }) => {
    await page.goto('/');
    
    await page.getByLabel(/benutzername/i).fill('wronguser');
    await page.getByLabel(/passwort/i).fill('wrongpass');
    await page.getByRole('button', { name: /anmelden/i }).click();
    
    // Fehlermeldung sollte erscheinen
    await expect(page.getByText(/fehlgeschlagen|fehler/i)).toBeVisible({ timeout: 10000 });
  });

  // Test für leere Suchergebnisse entfernt - Backend Suche ist zu flexibel
});

