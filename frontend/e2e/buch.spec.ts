import { expect, test } from './fixtures';

/**
 * E2E Tests mit Page Object Model Pattern und Fixtures
 * 
 * Die Tests nutzen Playwright Fixtures für Dependency Injection.
 * Page Objects werden automatisch bereitgestellt und destrukturiert.
 */

test.describe('Authentifizierung', () => {
  test('sollte die Login-Seite anzeigen', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.expectToBeVisible();
  });

  test('sollte sich erfolgreich einloggen können', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login('admin', 'p');
    
    // Nach Login sollte zur Suche weitergeleitet werden
    await expect(page).toHaveURL(/suche/, { timeout: 10000 });
  });

  test('sollte Fehlermeldung bei falschem Login anzeigen', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('wronguser', 'wrongpassword');
    
    await loginPage.expectErrorMessage();
  });

  test('sollte sich ausloggen können', async ({ loginPage, page }) => {
    // Erst einloggen
    await loginPage.navigate();
    await loginPage.login('admin', 'p');
    await expect(page).toHaveURL(/suche/, { timeout: 10000 });
    
    // Dann ausloggen
    await page.getByRole('button', { name: /logout|abmelden/i }).click();
    
    // Sollte wieder auf Login sein
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });
});

test.describe('Buchsuche', () => {
  // Vor jedem Test einloggen
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login('admin', 'p');
    await expect(page).toHaveURL(/suche/, { timeout: 10000 });
  });

  test('sollte Suchergebnisse anzeigen', async ({ searchPage }) => {
    await searchPage.search();
    await searchPage.expectResults();
  });

  test('sollte nach Titel suchen können', async ({ searchPage }) => {
    await searchPage.searchByTitel('Alice');
    await searchPage.expectResults();
  });

  test('sollte nach Rating filtern können', async ({ searchPage }) => {
    await searchPage.selectRating(5);
    await searchPage.search();
    await searchPage.expectResults();
  });

  test('sollte nach Buchart filtern können', async ({ searchPage }) => {
    await searchPage.selectBuchart('HARDCOVER');
    await searchPage.search();
    await searchPage.expectResults();
  });

  test('sollte nur lieferbare Bücher filtern können', async ({ searchPage }) => {
    await searchPage.filterLieferbar();
    await searchPage.search();
    await searchPage.expectResults();
  });

  test('sollte Suchformular zurücksetzen können', async ({ searchPage }) => {
    // Etwas eingeben
    await searchPage.titelInput.fill('Test');
    
    // Zurücksetzen
    await searchPage.resetForm();
    
    // Feld sollte leer sein
    await expect(searchPage.titelInput).toHaveValue('');
  });
});

test.describe('Buchdetails', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login('admin', 'p');
    await expect(page).toHaveURL(/suche/, { timeout: 10000 });
  });

  test('sollte Buchdetails anzeigen können', async ({ searchPage, detailPage }) => {
    // Suche und erstes Ergebnis öffnen
    await searchPage.search();
    await searchPage.expectResults();
    await searchPage.openFirstResult();
    
    // Detail-Seite sollte sichtbar sein
    await detailPage.expectToBeVisible();
  });

  test('sollte Lösch-Dialog anzeigen und abbrechen können', async ({ searchPage, detailPage }) => {
    // Zu Details navigieren
    await searchPage.search();
    await searchPage.expectResults();
    await searchPage.openFirstResult();
    await detailPage.expectToBeVisible();
    
    // Löschen starten und abbrechen
    await detailPage.startDelete();
    await detailPage.cancelDelete();
    
    // Sollte immer noch auf Detail-Seite sein
    await detailPage.expectToBeVisible();
  });
});

test.describe('Navigation', () => {
  test('sollte geschützte Routen zu Login weiterleiten', async ({ page }) => {
    // Ohne Login direkt zur Suche versuchen
    await page.goto('/suche');
    
    // Sollte zum Login weitergeleitet werden
    await expect(page).toHaveURL(/login/);
  });

  test('sollte zur Create-Seite navigieren können', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login('admin', 'p');
    await expect(page).toHaveURL(/suche/, { timeout: 10000 });
    
    // Zur Create-Seite navigieren
    await page.goto('/neu');
    
    // Formular sollte sichtbar sein
    await expect(page.getByLabel(/titel/i).first()).toBeVisible();
  });
});
