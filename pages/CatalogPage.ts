import { Page, Locator, expect } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly promoPopup: Locator;
  readonly promoYesButton: Locator;
  readonly promoSkipButton: Locator;
  readonly totalButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Targeting the conditional "Lucky day" popup and exact button labels[cite: 2]
    this.promoPopup = page.locator('div:has-text("It\'s your lucky day!")');
    this.promoYesButton = page.getByRole('button', { name: 'Yes, of course!' });
    this.promoSkipButton = page.getByRole('button', { name: "Nah, I'll skip." });
    this.totalButton = page.locator('[data-test="checkout"]');
  }

  async goto() {
    await this.page.goto('/');
  }

 async addCoffee(coffeeName: string) {
    // Target the specific cup using its exact data-cy attribute instead of loose text matching
    const coffeeCard = this.page.locator(`[data-cy="${coffeeName}"]`);
    await coffeeCard.click();
  }
  /**
   * Conditionally handles the "Lucky day" promo popup if it appears.
   * @param accept Pass true to accept the promo, or false to skip.
   */
  async handlePromoPopup(accept: boolean = false) {
    try {
      if (await this.promoPopup.isVisible({ timeout: 2000 })) {
        if (accept) {
          await this.promoYesButton.click();
        } else {
          await this.promoSkipButton.click();
        }
        await expect(this.promoPopup).toBeHidden();
      }
    } catch {
      // Popup did not trigger; continue safely
    }
  }

  async proceedToCheckout() {
    await this.totalButton.click();
  }
}