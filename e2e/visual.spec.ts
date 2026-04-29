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
    const nav = page.getByRole('navigation', { name: 'Main Navigation' });
    await expect(nav).toHaveScreenshot('navigation.png');
  });

  test('footer looks correct', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    await expect(footer).toHaveScreenshot('footer.png');
  });
});
