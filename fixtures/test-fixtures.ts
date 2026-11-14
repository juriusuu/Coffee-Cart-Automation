import { test as base } from '@playwright/test';
import { CatalogPage } from '../pages/CatalogPage';
import { CheckoutModal } from '../pages/CheckoutModal';
import testData from '../test-data/checkout-data.json';

type MyFixtures = {
  catalogPage: CatalogPage;
  checkoutModal: CheckoutModal;
  testData: typeof testData;
};

export const test = base.extend<MyFixtures>({
  catalogPage: async ({ page }, use) => {
    const catalogPage = new CatalogPage(page);
    await catalogPage.goto();
    await use(catalogPage);
  },
  checkoutModal: async ({ page }, use) => {
    const checkoutModal = new CheckoutModal(page);
    await use(checkoutModal);
  },
  testData: async ({}, use) => {
    await use(testData);
  },
});

export { expect } from '@playwright/test';