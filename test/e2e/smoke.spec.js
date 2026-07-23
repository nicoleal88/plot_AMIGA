const { expect, test } = require('@playwright/test');

const csvColumns = [
  'SD', 'LSID', 'Radio_Mikrotik', 'IP', 'AMIGA_Box', 'Cap_HS', 'Status',
  'Radio_Uptime', 'Front_End', 'Tubing_PS', 'Soporte_PS', 'PS_AMIGA',
  'Bateria_1', 'Bateria_2', 'Regulador', 'BBox', 'Tipo', 'To_Do',
  'Cableado_UMDs', 'ID_M101', 'ID_M102', 'ID_M103', 'RA_M101', 'RA_M102',
  'RA_M103', 'RD_M101', 'RD_M102', 'RD_M103', 'PA_M101', 'PA_M102',
  'PA_M103', 'eKit_M101', 'eKit_M102', 'eKit_M103', 'ID_M101_CU',
  'ID_M102_CU', 'ID_M103_CU', 'ID_M104_CU', 'ID_M105_CU', 'ID_M106_CU',
  'ID_M107_CU', 'ID_M108_CU', 'ID_M109_CU', 'RA_M101_CU', 'RA_M102_CU',
  'RA_M103_CU', 'RA_M104_CU', 'RA_M105_CU', 'RA_M106_CU', 'RA_M107_CU',
  'RA_M108_CU', 'RA_M109_CU', 'RD_M101_CU', 'RD_M102_CU', 'RD_M103_CU',
  'RD_M104_CU', 'RD_M105_CU', 'RD_M106_CU', 'RD_M107_CU', 'RD_M108_CU',
  'RD_M109_CU', 'PA_M101_CU', 'PA_M102_CU', 'PA_M103_CU', 'PA_M104_CU',
  'PA_M105_CU', 'PA_M106_CU', 'PA_M107_CU', 'PA_M108_CU', 'PA_M109_CU',
  'eKit_M101_CU', 'eKit_M102_CU', 'eKit_M103_CU', 'eKit_M104_CU',
  'eKit_M105_CU', 'eKit_M106_CU', 'eKit_M107_CU', 'eKit_M108_CU',
  'eKit_M109_CU', 'a_M101_CU', 'a_M102_CU', 'a_M103_CU', 'a_M104_CU',
  'a_M105_CU', 'a_M106_CU', 'a_M107_CU', 'a_M108_CU', 'a_M109_CU',
  'label_M101', 'label_M102', 'label_M103', 'label_M101_CU', 'label_M102_CU',
  'label_M103_CU', 'label_M104_CU', 'label_M105_CU', 'label_M106_CU',
  'label_M107_CU', 'label_M108_CU', 'label_M109_CU', 'TX', 'Distrib.',
  'Mallado', 'Grounding', 'Easting', 'Northing'
];

function csvCell(value) {
  return String(value).includes(',') || String(value).includes('"') || String(value).includes('\n')
    ? `"${String(value).replaceAll('"', '""')}"`
    : String(value);
}

function detectorRow(overrides) {
  const row = Object.fromEntries(csvColumns.map(column => [column, '-']));
  return csvColumns.map(column => csvCell({ ...row, ...overrides }[column])).join(',');
}

const csvFixture = [
  csvColumns.join(','),
  detectorRow({ SD: 'A1', LSID: '1001', Easting: '450000', Northing: '6100000', Status: 'OK', Tipo: 'AMIGA' }),
  detectorRow({ SD: 'B1', LSID: '1002', Easting: '450010', Northing: '6100010', Status: 'OK', Tipo: 'AMIGA' }),
  detectorRow({ SD: '<img src=x onerror=window.__xss=1>', LSID: '1003', Easting: '450020', Northing: '6100020', Status: 'OK', Tipo: 'AMIGA' })
].join('\n');

async function routeAppData(page) {
  await page.addInitScript(() => globalThis.localStorage.clear());

  await page.route('**/csv/data.csv**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/csv',
      body: csvFixture
    });
  });

  await page.route('**/csv/lastUpdate.txt**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/plain',
      body: '1700000000000'
    });
  });

  await page.route(/https?:\/\/(?!127\.0\.0\.1:3013).*mapbox.*/, async (route) => {
    await route.fulfill({ status: 204, body: '' });
  });
}

test('loads the application shell', async ({ page }) => {
  const consoleErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await routeAppData(page);

  await page.goto('/');

  await expect(page).toHaveTitle(/AMIGA Visualizer/);
  await expect(page.locator('#sketch-div')).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('renders CSV search data as text', async ({ page }) => {
  await routeAppData(page);
  await page.goto('/');
  await page.waitForFunction(() => window.searchTanks && window.searchTanks('img').length > 0);

  await page.locator('#search-input').fill('img');

  await expect(page.locator('.search-result-item')).toContainText('<img src=x onerror=window.__xss=1>');
  await expect(page.locator('.search-result-item img')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.__xss)).toBe(undefined);
});

test('updates selected panel when selection identity changes', async ({ page }) => {
  await routeAppData(page);
  await page.goto('/');
  await page.waitForFunction(() => window.searchTanks && window.searchTanks('A1').length > 0 && typeof window.updateSelectedList === 'function');

  await page.evaluate(() => {
    const first = window.searchTanks('A1')[0];
    first.selected = true;
    window.updateSelectedList();
  });

  await expect(page.locator('#selected-list')).toContainText('A1');

  await page.evaluate(() => {
    const first = window.searchTanks('A1')[0];
    const second = window.searchTanks('B1')[0];
    first.selected = false;
    second.selected = true;
    window.updateSelectedList();
  });

  await expect(page.locator('#selected-list')).toContainText('B1');
  await expect(page.locator('#selected-list')).not.toContainText('A1');
});
