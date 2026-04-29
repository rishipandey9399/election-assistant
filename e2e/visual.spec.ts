import { test, expect } from '@playwright/test';

test.describe('Visual Regression (@visual)', () => {
  test('home page looks correct', async ({ page }) => {
    await page.goto('/');
    // Wait for fonts/images
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      mask: [page.locator('[data-testid="dynamic-content"]')], // Mask dynamic parts if any
    });
  });

  test('navigation looks correct', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toHaveScreenshot('navigation.png');
  });

  test('footer looks correct', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer.png');
  });
});
