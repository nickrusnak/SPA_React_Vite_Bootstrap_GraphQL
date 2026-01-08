import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object für die Login-Seite
 * Kapselt alle Interaktionen mit dem Login-Formular
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel(/benutzername/i);
    this.passwordInput = page.getByLabel(/passwort/i);
    this.submitButton = page.getByRole('button', { name: /anmelden/i });
    this.errorMessage = page.getByText(/fehlgeschlagen|fehler/i);
    this.heading = page.getByRole('heading', { name: /anmeldung/i });
  }

  /**
   * Navigiert zur Login-Seite
   */
  async navigate() {
    await this.page.goto('/');
  }

  /**
   * Führt Login mit gegebenen Credentials durch
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /**
   * Prüft ob die Login-Seite angezeigt wird
   */
  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  /**
   * Prüft ob eine Fehlermeldung angezeigt wird
   */
  async expectErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }
}
