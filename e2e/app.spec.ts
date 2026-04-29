import { test, expect } from '@playwright/test';

test.describe('Election Assistant E2E', () => {
  test('should navigate through the core user journey', async ({ page }) => {
    // 1. Visit Home Page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Navigate Your Voting Journey');

    // 2. Navigate to Timeline
    await page.locator('nav').getByText('Timeline').first().click();
    await expect(page).toHaveURL(/.*timeline/);
    await expect(page.locator('h1')).toContainText('Election Timeline');

    // 3. Navigate to Polling Place
    await page.locator('nav').getByText('Polling Place').first().click();
    await expect(page).toHaveURL(/.*polling-place/);
    await expect(page.locator('h1')).toContainText('Find Your Polling Place');

    // Wait for hydration
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 4. Test Address Search
    await page.getByLabel('Registered Address').fill('1600 Pennsylvania Ave NW, Washington, DC');
    await page.getByRole('button', { name: /Find Location/i }).click();

    // Wait for the result to appear (mocked response in 1.5s)
    await expect(page.getByText('Community Center Gymnasium')).toBeVisible({ timeout: 15000 });

    // 5. Navigate to AI Assistant
    await page.locator('nav').getByText('AI Assistant').first().click();
    await expect(page).toHaveURL(/.*assistant/);
    await expect(page.locator('h1')).toContainText('AI Election Assistant');
    await page.waitForTimeout(2000);

    // 6. Test AI Chat Interaction
    const chatInput = page.getByPlaceholder(/Ask about voter ID/i);
    await chatInput.waitFor({ state: 'visible' });
    await chatInput.fill('How do I register to vote?');
    await page.getByRole('button', { name: /Send/i }).click();

    // Check for final reply
    await expect(page.getByText(/running in mock mode/i)).toBeVisible({ timeout: 20000 });
  });
});
