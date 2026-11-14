import { Page, Locator, expect } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly promoPopup: Locator;
  readonly promoYesButton: Locator;
  readonly promoSkipButton: Locator;
  readonly totalButton: Locator;


  constructor(page: Page) {
    this.page = page;
    // Target the specific promo container class directly to avoid matching parent wrappers like #app
    this.promoPopup = page.locator('.promo');
    this.promoYesButton = page.getByRole('button', { name: 'Yes, of course!' });
    this.promoSkipButton = page.getByRole('button', { name: "Nah, I'll skip." });
    this.totalButton = page.locator('[data-test="checkout"]');
  }
  async goto() {
    await this.page.goto('/');
  }

  async addCoffee(coffeeName: string) {
    // Utilizes exact data-cy attribute mapping to eliminate strict mode violations
    const coffeeCard = this.page.locator(`[data-cy="${coffeeName}"]`);
    await coffeeCard.click();
  }

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
      // Non-blocking fallback if popup isn't triggered
    }
  }

  async proceedToCheckout() {
    await this.totalButton.click();
  }

  // Bonus Feature A: Double-click heading to translate to Chinese
  async translateCoffeeTitle(coffeeName: string) {
    // Use text-is to match the exact heading text strictly, avoiding partial matches on variants
    const coffeeHeading = this.page.locator(`h4:text-is("${coffeeName}")`);
    await coffeeHeading.dblclick();
  }

  // Bonus Feature B: Right-click on the coffee icon/card to open the add-to-cart dialog
  async rightClickCoffeeCard(coffeeName: string) {
    // Target the specific coffee card container using its data-cy attribute and right-click
    const coffeeCard = this.page.locator(`[data-cy="${coffeeName}"]`);
    await coffeeCard.click({ button: 'right' });
  }

  // Action inside the custom dialog that pops up after right-clicking
  async confirmCustomDialog() {
    const submitButton = this.page.getByRole('button', { name: 'Submit' }); // or the exact button text in the dialog
    await submitButton.click();
  }
}