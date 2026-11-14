import { test, expect } from '../fixtures/test-fixtures';

test.describe('Coffee Cart E2E Purchase Flow with POM & Fixtures', () => {
  
  test('Complete purchase flow: Add product, handle lucky day popup, checkout, and verify success', async ({ 
    catalogPage, 
    checkoutModal, 
    testData 
  }) => {
    // 1. Add Product
    await catalogPage.addCoffee(testData.coffees.primary);

    // 2. Handle Promo/Lucky Day popup if it triggers
    await catalogPage.handlePromoPopup(false); // e.g., clicking "Nah, I'll skip."

    // 3. Proceed to Checkout
    await catalogPage.proceedToCheckout();

    // 4. Submit Payment Details
    await checkoutModal.submitPaymentDetails(
      testData.validCustomer.name, 
      testData.validCustomer.email
    );

    // 5. Verify Success
    await checkoutModal.verifySuccess();
  });
});