import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('Accessibility (@a11y)', () => {
  test('home page should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('main');

    // Dedicated ARIA assertions
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('about page should be accessible', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('faq page should be accessible', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: /frequently asked questions/i })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('assistant page should be accessible', async ({ page }) => {
    await page.goto('/assistant');
    await page.waitForSelector('main');

    await expect(page.getByRole('main')).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /ask anything about the election/i })
    ).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
