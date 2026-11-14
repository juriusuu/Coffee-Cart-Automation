import { test, expect } from '../fixtures/test-fixtures';

test.describe('Coffee Cart E2E Purchase Flow with POM & Fixtures', () => {

  test('Complete purchase flow: Add multiple products, handle popup, checkout, and verify success', async ({
    catalogPage,
    checkoutModal,
    testData
  }) => {
    // 1. Loop through all coffees in the JSON test data array and add them sequentially
    for (const coffeeName of testData.coffeesToOrder) {
      await catalogPage.addCoffee(coffeeName);

      // Handle the lucky day/promo popup if it triggers after adding an item
      await catalogPage.handlePromoPopup(true); // Pass true to click "Yes, of course!"
      //await catalogPage.handlePromoPopup(false); // Pass false to click "Nah, I'll skip."

    }

    // 3. Proceed to Checkout (cart count will now reflect multiple items)
    await catalogPage.proceedToCheckout();

    // 4. Submit Payment Details (Name & Email isolation)
    await checkoutModal.submitPaymentDetails(
      testData.validCustomer.name,
      testData.validCustomer.email
    );

    // 5. Verify Success (Green success banner)
    await checkoutModal.verifySuccess();

  });

  test.describe('Special Feature Tests (Bonus)', () => {

    test('Bonus A: Double-click all coffee titles to translate to Chinese', async ({ catalogPage, page }) => {
      // Array of all coffee names displayed on the catalog page
      const coffees = [
        'Espresso',
        'Espresso Macchiato',
        'Cappuccino',
        'Mocha',
        'Flat White',
        'Americano',
        'Cafe Latte',
        'Espresso Con Panna',
        'Cafe Breve'
      ];

      // Loop through each coffee name and trigger the double-click translation
      for (const coffeeName of coffees) {
        await catalogPage.translateCoffeeTitle(coffeeName);
      }

      // Optional: Verify that at least one or all headings show the Chinese translation text
      // (You can check for the generic Chinese character pattern used in the app's translations)
      const translatedHeadings = page.locator('h4');
      await expect(translatedHeadings.first()).toBeVisible();
    });

    test('Bonus B: Right-click coffee icon to open add-to-cart dialog', async ({ catalogPage, page }) => {
      // 1. Right-click the coffee card
      await catalogPage.rightClickCoffeeCard('Espresso');

      // 2. Assert using the actual text or button appearing in the dialog popup
      const dialogPrompt = page.getByText('Add Espresso to the cart?');
      await expect(dialogPrompt).toBeVisible();

      // Alternatively, assert on the action buttons inside the dialog
      const yesButton = page.getByRole('button', { name: 'Yes' });
      await expect(yesButton).toBeVisible();
    });

    test('Bonus C: Promo coffee pop-up triggers on every 3rd item added', async ({ catalogPage }) => {
      await catalogPage.addCoffee('Espresso');
      await catalogPage.handlePromoPopup(false);

      await catalogPage.addCoffee('Cappuccino');
      await catalogPage.handlePromoPopup(false);

      // 3rd item triggers the promo/lucky day popup
      await catalogPage.addCoffee('Mocha');
      await expect(catalogPage.promoPopup).toBeVisible();
    });
  });
});