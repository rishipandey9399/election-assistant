import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('Accessibility (@a11y)', () => {
  test('home page should be accessible', async ({ page }) => {
    await page.goto('/');

    // Wait for the main content to be visible
    await page.waitForSelector('main');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('about page should be accessible', async ({ page }) => {
    await page.goto('/about');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('faq page should be accessible', async ({ page }) => {
    await page.goto('/faq');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('assistant page should be accessible', async ({ page }) => {
    await page.goto('/assistant');
    // The assistant might have dynamic content, wait for it
    await page.waitForSelector('main');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
