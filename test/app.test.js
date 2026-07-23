const assert = require('node:assert/strict');
const { after, before, describe, test } = require('node:test');
const { createApp } = require('../app');

describe('application server', () => {
  let server;
  let baseUrl;
  const originalMapboxKey = process.env.MAPBOX_API_KEY;

  before(async () => {
    process.env.MAPBOX_API_KEY = 'test-mapbox-key';
    const app = createApp();

    await new Promise((resolve, reject) => {
      server = app.listen(0, () => {
        const address = server.address();
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
      server.on('error', reject);
    });
  });

  after(async () => {
    if (originalMapboxKey === undefined) {
      delete process.env.MAPBOX_API_KEY;
    } else {
      process.env.MAPBOX_API_KEY = originalMapboxKey;
    }

    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });

  test('serves the application shell', async () => {
    const response = await fetch(`${baseUrl}/`);

    assert.equal(response.status, 200);
    assert.match(await response.text(), /AMIGA Visualizer/);
  });

  test('serves frontend scripts', async () => {
    const response = await fetch(`${baseUrl}/javascripts/sketch.js`);

    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /javascript/);
  });

  test('returns the configured Mapbox key', async () => {
    const response = await fetch(`${baseUrl}/api/mapbox-key`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { apiKey: 'test-mapbox-key' });
  });
});

test('can start without CSV downloads for browser smoke tests', async () => {
  const { startServer, stopServer } = require('../app');
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;

  globalThis.fetch = async () => {
    fetchCalls += 1;
    throw new Error('fetch should not be called');
  };

  const startedServer = startServer({
    port: 0,
    csvUrl: 'https://example.com/data.csv',
    disableCsvDownload: true
  });

  try {
    assert.equal(startedServer.refreshTimer, null);
    assert.equal(fetchCalls, 0);
  } finally {
    await stopServer(startedServer);
    globalThis.fetch = originalFetch;
  }
});
