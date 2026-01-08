import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object für die Such-Seite
 * Kapselt alle Interaktionen mit dem Suchformular und den Ergebnissen
 */
export class SearchPage {
  readonly page: Page;
  
  // Formular-Elemente
  readonly titelInput: Locator;
  readonly isbnInput: Locator;
  readonly buchartSelect: Locator;
  readonly lieferbarCheckbox: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  
  // Rating Radio-Buttons
  readonly ratingAll: Locator;
  
  // Ergebnisse
  readonly resultsHeading: Locator;
  readonly noResultsMessage: Locator;
  readonly detailLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Textfelder
    this.titelInput = page.getByLabel(/titel/i).first();
    this.isbnInput = page.getByLabel(/isbn/i).first();
    
    // Dropdown
    this.buchartSelect = page.getByLabel(/buchart/i);
    
    // Checkbox
    this.lieferbarCheckbox = page.getByLabel(/nur lieferbare/i);
    
    // Buttons
    this.searchButton = page.getByRole('button', { name: /suchen/i });
    this.resetButton = page.getByRole('button', { name: /zurücksetzen/i });
    
    // Rating
    this.ratingAll = page.getByLabel(/alle/i).first();
    
    // Ergebnisse
    this.resultsHeading = page.getByText(/ergebnisse.*bücher/i);
    this.noResultsMessage = page.getByText(/keine bücher gefunden/i);
    this.detailLinks = page.getByRole('link', { name: /details/i });
  }

  /**
   * Navigiert zur Such-Seite
   */
  async navigate() {
    await this.page.goto('/suche');
  }

  /**
   * Führt eine Suche mit dem aktuellen Formular durch
   */
  async search() {
    await this.searchButton.click();
  }

  /**
   * Sucht nach einem bestimmten Titel
   */
  async searchByTitel(titel: string) {
    await this.titelInput.fill(titel);
    await this.search();
  }

  /**
   * Wählt eine Buchart im Dropdown
   */
  async selectBuchart(art: 'EPUB' | 'HARDCOVER' | 'PAPERBACK') {
    await this.buchartSelect.selectOption(art);
  }

  /**
   * Aktiviert den Lieferbar-Filter
   */
  async filterLieferbar() {
    await this.lieferbarCheckbox.check();
  }

  /**
   * Setzt das Formular zurück
   */
  async resetForm() {
    await this.resetButton.click();
  }

  /**
   * Wählt ein Rating über Radio-Button
   */
  async selectRating(rating: 1 | 2 | 3 | 4 | 5) {
    await this.page.getByLabel(`${rating}⭐`).click();
  }

  /**
   * Prüft ob Suchergebnisse angezeigt werden
   */
  async expectResults() {
    // Warten bis das Netzwerk ruhig ist
    await this.page.waitForLoadState('networkidle');
    // Text enthält "Ergebnisse" und "Bücher gefunden"
    await expect(this.page.getByText(/Bücher gefunden/i)).toBeVisible({ timeout: 15000 });
  }

  /**
   * Klickt auf den ersten Detail-Link
   */
  async openFirstResult() {
    await this.detailLinks.first().click();
  }
}
