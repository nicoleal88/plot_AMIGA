const { expect, test } = require('@playwright/test');

const csvFixture = [
  'SD,LSID,Easting,Northing,Status,Tipo',
  'A1,1001,450000,6100000,OK,AMIGA'
].join('\n');

test('loads the application shell', async ({ page }) => {
  const consoleErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.route('**/csv/data.csv', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/csv',
      body: csvFixture
    });
  });

  await page.route('**/csv/lastUpdate.txt', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/plain',
      body: '1700000000000'
    });
  });

  await page.route(/https?:\/\/(?!127\.0\.0\.1:3013).*mapbox.*/, async (route) => {
    await route.fulfill({ status: 204, body: '' });
  });

  await page.goto('/');

  await expect(page).toHaveTitle(/AMIGA Visualizer/);
  await expect(page.locator('#sketch-div')).toBeVisible();
  expect(consoleErrors).toEqual([]);
});
