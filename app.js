// app.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');

const DEFAULT_PORT = 3003;
const DEFAULT_REFRESH_MS = 1000 * 60 * 5;
const csvDir = './public/csv/';
const csvPath = csvDir + 'data.csv';
const datePath = csvDir + 'lastUpdate.txt';

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.static('public'));

  app.get('/api/mapbox-key', (req, res) => {
    res.json({ apiKey: process.env.MAPBOX_API_KEY || '' });
  });

  return app;
}

function startServer(options = {}) {
  console.log('App running...');

  const app = options.app || createApp();
  const port = Number(options.port || process.env.PORT || DEFAULT_PORT);
  const csvUrl = options.csvUrl || process.env.CSV_URL;
  const refreshMs = Number(options.refreshMs || process.env.CSV_REFRESH_MS || DEFAULT_REFRESH_MS);

  if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir, { recursive: true });
    console.log('Created directory:', csvDir);
  }

  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
  });

  download(csvUrl, csvPath);

  const refreshTimer = setInterval(() => {
    download(csvUrl, csvPath);
  }, refreshMs);

  return { app, server, refreshTimer };
}

function stopServer(startedServer) {
  if (startedServer.refreshTimer) {
    clearInterval(startedServer.refreshTimer);
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

async function download(url, filePath) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);
        writeDateFile();
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

function writeDateFile() {
	const date = Date.now().toString();
	fs.writeFile(datePath, date, function (err) {
		if (err) return console.log(err);
		// console.log('Hello World > helloworld.txt');
	});
	//console.log('Done!');
}

if (require.main === module) {
  startServer();
}

module.exports = { createApp, startServer, stopServer };
