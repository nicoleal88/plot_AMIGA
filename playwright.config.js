const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test/e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3013',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:3013',
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: '3013',
      MAPBOX_API_KEY: 'test-mapbox-key',
      DISABLE_CSV_DOWNLOAD: '1',
      CSV_REFRESH_MS: '600000'
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
