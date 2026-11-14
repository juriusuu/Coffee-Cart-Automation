import { Page, Locator, expect } from '@playwright/test';

export class CheckoutModal {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async submitPaymentDetails(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async verifySuccess() {
    const successBanner = this.page.locator('.snackbar, div:has-text("Thanks for your support")');
    await expect(successBanner).toBeVisible({ timeout: 10000 });
  }
}