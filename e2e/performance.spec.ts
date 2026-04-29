import { test, expect } from '@playwright/test';

test.describe('Performance Metrics', () => {
  test('home page should load within budget', async ({ page }) => {
    // Only works in Chromium
    const browserName = test.info().project.name;
    if (browserName !== 'chromium') {
      test.skip();
    }

    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');

    const start = Date.now();
    await page.goto('/');
    const end = Date.now();

    const loadTime = end - start;
    console.info(`Home page load time: ${loadTime}ms`);

    // Budget: 3 seconds for full load
    expect(loadTime).toBeLessThan(3000);

    const performanceMetrics = await client.send('Performance.getMetrics');
    const metrics = performanceMetrics.metrics;

    const findMetric = (name: string) => metrics.find((m) => m.name === name)?.value;

    console.info('Performance Metrics:', {
      JSHeapUsedSize: findMetric('JSHeapUsedSize'),
      LayoutCount: findMetric('LayoutCount'),
      RecalcStyleCount: findMetric('RecalcStyleCount'),
    });
  });
});
