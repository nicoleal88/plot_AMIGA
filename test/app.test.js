const assert = require('node:assert/strict');
const { after, before, describe, test } = require('node:test');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {
  createApp,
  hasValidSnapshot,
  loadConfig,
  refreshSnapshot,
  sha256Text,
  startServer,
  stopServer,
  validateSnapshot
} = require('../app');

const validCsv = [
  'SD,LSID,Easting,Northing,Status,Tipo,Notes',
  'A1,1001,450000,6100000,OK,AMIGA,"quoted, note"'
].join('\n');

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
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;

  globalThis.fetch = async () => {
    fetchCalls += 1;
    throw new Error('fetch should not be called');
  };

  const startedServer = await startServer({
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

describe('CSV snapshot publishing', () => {
  test('validates CSV_URL configuration without exposing values', () => {
    assert.throws(() => loadConfig({}), /CSV_URL is required/);
    assert.throws(() => loadConfig({ CSV_URL: 'not a url' }), /valid URL/);
    assert.throws(() => loadConfig({ CSV_URL: 'http://example.com/data.csv' }), /HTTPS/);

    const config = loadConfig({ CSV_URL: 'https://example.com/data.csv' });
    assert.equal(config.csvUrl.href, 'https://example.com/data.csv');
    assert.equal(config.refreshMs, 300000);
  });

  test('validates required columns, rows and coordinates', () => {
    assert.deepEqual(validateSnapshot(validCsv).header.slice(0, 6), ['SD', 'LSID', 'Easting', 'Northing', 'Status', 'Tipo']);
    assert.throws(() => validateSnapshot('<!doctype html>'), /not CSV/);
    assert.throws(() => validateSnapshot('SD,LSID\nA1,1001'), /missing required columns/);
    assert.throws(() => validateSnapshot('SD,LSID,Easting,Northing,Status,Tipo\n'), /at least one row/);
    assert.throws(() => validateSnapshot('SD,LSID,Easting,Northing,Status,Tipo\nA1,1001,nope,6100000,OK,AMIGA'), /invalid coordinates/);
  });

  test('downloads, validates and publishes a snapshot with manifest last', async () => {
    const csvDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plot-amiga-csv-'));
    const config = loadConfig({ CSV_URL: 'https://example.com/data.csv' }, { csvDir });
    const updatedAt = 1700000000000;

    const snapshot = await refreshSnapshot(config, {
      clock: { now: () => updatedAt },
      fetchImpl: async () => new Response(validCsv, { status: 200 })
    });

    const [csv, lastUpdate, manifestText] = await Promise.all([
      fs.readFile(config.csvPath, 'utf8'),
      fs.readFile(config.datePath, 'utf8'),
      fs.readFile(config.manifestPath, 'utf8')
    ]);
    const manifest = JSON.parse(manifestText);

    assert.equal(snapshot.rowCount, 1);
    assert.equal(csv, validCsv);
    assert.equal(lastUpdate, String(updatedAt));
    assert.deepEqual(manifest, {
      schemaVersion: 1,
      updatedAt: String(updatedAt),
      sha256: sha256Text(validCsv)
    });
    assert.equal(await hasValidSnapshot(config), true);
  });

  test('does not replace an existing snapshot with an invalid response', async () => {
    const csvDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plot-amiga-csv-'));
    const config = loadConfig({ CSV_URL: 'https://example.com/data.csv' }, { csvDir });
    await refreshSnapshot(config, { fetchImpl: async () => new Response(validCsv, { status: 200 }) });
    const originalCsv = await fs.readFile(config.csvPath, 'utf8');

    await assert.rejects(
      () => refreshSnapshot(config, { fetchImpl: async () => new Response('<html></html>', { status: 200 }) }),
      /not CSV/
    );

    assert.equal(await fs.readFile(config.csvPath, 'utf8'), originalCsv);
    assert.equal(await hasValidSnapshot(config), true);
  });

  test('rejects oversized CSV responses before publishing', async () => {
    const csvDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plot-amiga-csv-'));
    const config = loadConfig({ CSV_URL: 'https://example.com/data.csv' }, { csvDir, maxBytes: 10 });

    await assert.rejects(
      () => refreshSnapshot(config, { fetchImpl: async () => new Response(validCsv, { status: 200 }) }),
      /maximum size/
    );

    await assert.rejects(() => fs.stat(config.csvPath));
  });
});
