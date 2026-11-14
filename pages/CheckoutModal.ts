import { Page, Locator, expect } from '@playwright/test';

export class CheckoutModal {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.submitButton = page.getByRole('button', { name: 'Submit' });

    // Targeting the green success box container element directly
    this.successBanner = page.locator('.snackbar.success');
  }

  async submitPaymentDetails(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async verifySuccess() {
    // Zero hardcoded sleep: auto-waits for the green success box to appear containing the message text
    await expect(this.successBanner).toBeVisible({ timeout: 10000 });
    await expect(this.successBanner).toContainText('Thanks for your purchase. Please check your email for payment.');

    await this.page.waitForTimeout(3000);
  }
}