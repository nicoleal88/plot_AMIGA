// app.js

require('dotenv').config();

const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const DEFAULT_PORT = 3003;
const DEFAULT_REFRESH_MS = 1000 * 60 * 5;
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
const DEFAULT_CSV_DIR = './public/csv/';
const REQUIRED_COLUMNS = ['SD', 'LSID', 'Easting', 'Northing', 'Status', 'Tipo'];

function createApp() {
  const app = express();

  app.locals.snapshotReady = false;
  app.use(cors());
  app.use(express.static('public'));

  app.get('/api/mapbox-key', (req, res) => {
    res.json({ apiKey: process.env.MAPBOX_API_KEY || '' });
  });

  app.get('/healthz', (req, res) => {
    res.status(app.locals.snapshotReady ? 200 : 503).json({ ready: Boolean(app.locals.snapshotReady) });
  });

  return app;
}

function loadConfig(env = process.env, overrides = {}) {
  const csvUrlValue = overrides.csvUrl || env.CSV_URL;
  if (!csvUrlValue) throw new Error('CSV_URL is required');

  let csvUrl;
  try {
    csvUrl = new URL(csvUrlValue);
  } catch (error) {
    throw new Error('CSV_URL must be a valid URL');
  }

  if (csvUrl.protocol !== 'https:') {
    throw new Error('CSV_URL must use HTTPS');
  }

  const csvDir = overrides.csvDir || env.CSV_DIR || DEFAULT_CSV_DIR;
  const refreshMs = parsePositiveInteger(overrides.refreshMs || env.CSV_REFRESH_MS, DEFAULT_REFRESH_MS, 'CSV_REFRESH_MS');
  const timeoutMs = parsePositiveInteger(overrides.timeoutMs || env.CSV_TIMEOUT_MS, DEFAULT_TIMEOUT_MS, 'CSV_TIMEOUT_MS');
  const maxBytes = parsePositiveInteger(overrides.maxBytes || env.CSV_MAX_BYTES, DEFAULT_MAX_BYTES, 'CSV_MAX_BYTES');

  return {
    port: Number(overrides.port || env.PORT || DEFAULT_PORT),
    csvUrl,
    csvDir,
    csvPath: path.join(csvDir, 'data.csv'),
    datePath: path.join(csvDir, 'lastUpdate.txt'),
    manifestPath: path.join(csvDir, 'snapshot.json'),
    refreshMs,
    timeoutMs,
    maxBytes
  };
}

function parsePositiveInteger(value, defaultValue, name) {
  if (value === undefined || value === null || value === '') return defaultValue;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

async function startServer(options = {}) {
  console.log('App running...');

  const app = options.app || createApp();
  const csvDownloadDisabled = options.disableCsvDownload || process.env.DISABLE_CSV_DOWNLOAD === '1';
  let refreshTimer = null;
  let stopped = false;
  let config = null;
  let refreshImmediately = false;

  if (!csvDownloadDisabled) {
    config = loadConfig(process.env, options);
    await fsp.mkdir(config.csvDir, { recursive: true });

    if (await hasValidSnapshot(config)) {
      app.locals.snapshotReady = true;
      refreshImmediately = true;
    } else {
      await refreshSnapshot(config);
      app.locals.snapshotReady = true;
    }
  } else {
    const csvDir = options.csvDir || process.env.CSV_DIR || DEFAULT_CSV_DIR;
    await fsp.mkdir(csvDir, { recursive: true });
    app.locals.snapshotReady = true;
  }

  const port = Number(options.port || process.env.PORT || DEFAULT_PORT);
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
  });

  if (config) {
    const refreshLoop = async () => {
      try {
        await refreshSnapshot(config);
        app.locals.snapshotReady = true;
      } catch (error) {
        console.error('Error refreshing CSV snapshot:', error.message);
      } finally {
        if (!stopped) {
          refreshTimer = setTimeout(refreshLoop, config.refreshMs);
        }
      }
    };

    refreshTimer = setTimeout(refreshLoop, refreshImmediately ? 0 : config.refreshMs);
  }

  return {
    app,
    server,
    get refreshTimer() {
      return refreshTimer;
    },
    stopRefresh() {
      stopped = true;
      if (refreshTimer) clearTimeout(refreshTimer);
    }
  };
}

function stopServer(startedServer) {
  if (startedServer.stopRefresh) {
    startedServer.stopRefresh();
  } else if (startedServer.refreshTimer) {
    clearTimeout(startedServer.refreshTimer);
  }

  return new Promise((resolve, reject) => {
    startedServer.server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function refreshSnapshot(config, dependencies = {}) {
  const fetchImpl = dependencies.fetchImpl || fetch;
  const clock = dependencies.clock || Date;
  const response = await fetchImpl(config.csvUrl.href, {
    signal: AbortSignal.timeout(config.timeoutMs)
  });

  if (!response.ok) {
    throw new Error(`CSV download failed: HTTP ${response.status}`);
  }

  const csv = await readUtf8BodyWithinLimit(response.body, config.maxBytes);
  const snapshot = validateSnapshot(csv);
  const downloadedAt = clock.now().toString();
  const sha256 = sha256Text(csv);

  await publishSnapshot({
    csv,
    downloadedAt,
    sha256,
    csvPath: config.csvPath,
    datePath: config.datePath,
    manifestPath: config.manifestPath
  });

  return { ...snapshot, updatedAt: downloadedAt, sha256 };
}

async function readUtf8BodyWithinLimit(body, maxBytes) {
  if (!body || typeof body.getReader !== 'function') {
    throw new Error('CSV response body is not readable');
  }

  const reader = body.getReader();
  const chunks = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new Error('CSV response exceeds maximum size');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  if (totalBytes === 0) throw new Error('CSV response is empty');

  const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
  return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
}

function validateSnapshot(csv) {
  if (!csv || !csv.trim()) throw new Error('CSV response is empty');
  if (/^\s*</.test(csv)) throw new Error('CSV response is not CSV');

  const rows = parseCsvRows(csv);
  if (rows.length < 2) throw new Error('CSV must include a header and at least one row');

  const header = rows[0].map((column) => column.trim());
  const missingColumns = REQUIRED_COLUMNS.filter((column) => !header.includes(column));
  if (missingColumns.length > 0) {
    throw new Error(`CSV missing required columns: ${missingColumns.join(', ')}`);
  }

  const columnIndex = new Map(header.map((column, index) => [column, index]));
  const dataRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ''));
  if (dataRows.length === 0) throw new Error('CSV must include at least one data row');

  for (const row of dataRows) {
    if (row.length > header.length) throw new Error('CSV row has more fields than the header');

    const easting = Number(row[columnIndex.get('Easting')]);
    const northing = Number(row[columnIndex.get('Northing')]);
    if (!Number.isFinite(easting) || !Number.isFinite(northing)) {
      throw new Error('CSV row has invalid coordinates');
    }
  }

  return { header, rowCount: dataRows.length };
}

function parseCsvRows(csv) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const next = csv[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      if (cell.length > 0) throw new Error('CSV quote appears inside an unquoted field');
      inQuotes = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (char === '\r') {
      if (next === '\n') continue;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (inQuotes) throw new Error('CSV contains an unterminated quoted field');
  row.push(cell);
  if (row.length > 1 || row[0] !== '') rows.push(row);

  return rows;
}

async function publishSnapshot({ csv, downloadedAt, sha256, csvPath, datePath, manifestPath }) {
  const csvDir = path.dirname(csvPath);
  await fsp.mkdir(csvDir, { recursive: true });
  const tempSuffix = `${process.pid}-${Date.now()}-${crypto.randomUUID()}`;
  const tempCsvPath = `${csvPath}.${tempSuffix}.tmp`;
  const tempDatePath = `${datePath}.${tempSuffix}.tmp`;
  const tempManifestPath = `${manifestPath}.${tempSuffix}.tmp`;

  await fsp.writeFile(tempCsvPath, csv, 'utf8');
  await fsp.rename(tempCsvPath, csvPath);
  await fsp.writeFile(tempDatePath, downloadedAt, 'utf8');
  await fsp.rename(tempDatePath, datePath);
  await fsp.writeFile(tempManifestPath, `${JSON.stringify({
    schemaVersion: 1,
    updatedAt: downloadedAt,
    sha256
  })}\n`, 'utf8');
  await fsp.rename(tempManifestPath, manifestPath);
}

async function hasValidSnapshot(config) {
  try {
    const [csv, manifestText] = await Promise.all([
      fsp.readFile(config.csvPath, 'utf8'),
      fsp.readFile(config.manifestPath, 'utf8')
    ]);
    const manifest = JSON.parse(manifestText);

    return manifest.schemaVersion === 1
      && typeof manifest.updatedAt === 'string'
      && manifest.sha256 === sha256Text(csv);
  } catch (error) {
    return false;
  }
}

function sha256Text(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  createApp,
  startServer,
  stopServer,
  loadConfig,
  readUtf8BodyWithinLimit,
  validateSnapshot,
  parseCsvRows,
  publishSnapshot,
  refreshSnapshot,
  hasValidSnapshot,
  sha256Text
};
