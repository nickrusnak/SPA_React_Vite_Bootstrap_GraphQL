/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';
import { DetailPage } from './pages/DetailPage';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';

/**
 * Custom Playwright Fixtures für Page Objects
 * 
 * Diese Datei erweitert den Basis-Test mit Page Object Fixtures.
 * Das ist der empfohlene Playwright-Weg für das Page Object Model.
 * 
 * Verwendung in Tests:
 * import { test, expect } from './fixtures';
 * test('Test', async ({ loginPage, searchPage }) => { ... });
 */

// Typdefinition für unsere Custom Fixtures
type PageObjectFixtures = {
  loginPage: LoginPage;
  searchPage: SearchPage;
  detailPage: DetailPage;
};

// Erweitere den Basis-Test mit unseren Fixtures
export const test = base.extend<PageObjectFixtures>({
  // LoginPage Fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // SearchPage Fixture
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },

  // DetailPage Fixture
  detailPage: async ({ page }, use) => {
    const detailPage = new DetailPage(page);
    await use(detailPage);
  },
});

// Re-exportiere expect für einfachen Import
export { expect } from '@playwright/test';
