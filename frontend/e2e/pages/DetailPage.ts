import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object für die Detail-Seite
 * Kapselt Interaktionen mit der Buchdetail-Ansicht
 */
export class DetailPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;
  readonly deleteModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /buchdetails/i });
    this.deleteButton = page.getByRole('button', { name: /löschen/i });
    this.deleteModal = page.getByText(/wirklich.*löschen/i);
    this.confirmDeleteButton = page.getByRole('button', { name: /ja.*löschen/i });
    this.cancelDeleteButton = page.getByRole('button', { name: /abbrechen/i });
  }

  /**
   * Navigiert zu einem bestimmten Buch
   */
  async navigate(buchId: string) {
    await this.page.goto(`/buch/${buchId}`);
  }

  /**
   * Prüft ob die Detail-Seite angezeigt wird
   */
  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
  }

  /**
   * Startet den Löschvorgang (öffnet Modal)
   */
  async startDelete() {
    await this.deleteButton.click();
    await expect(this.deleteModal).toBeVisible();
  }

  /**
   * Bestätigt das Löschen im Modal
   */
  async confirmDelete() {
    await this.confirmDeleteButton.click();
  }

  /**
   * Bricht das Löschen ab
   */
  async cancelDelete() {
    await this.cancelDeleteButton.click();
  }
}
