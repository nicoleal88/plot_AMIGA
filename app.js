// app.js

require('dotenv').config();

console.log('App running...');

const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

const server = app.listen(3000, listening);

function listening() {
	console.log('Server listening on port 3000!');
}

app.use(express.static('public'));

app.get('/api/mapbox-key', (req, res) => {
  res.json({ apiKey: process.env.MAPBOX_API_KEY || '' });
});

const csv_url = process.env.CSV_URL;
const path = './public/csv/';
const csv_path = path + 'data.csv';
const date_path = path + 'lastUpdate.txt';

if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
    console.log('Created directory:', path);
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
	fs.writeFile(date_path, date, function (err) {
		if (err) return console.log(err);
		// console.log('Hello World > helloworld.txt');
	});
	//console.log('Done!');
}
 
let interval = 1000 * 60 * 5

// Download immediately when server starts
download(csv_url, csv_path);

// Then set up interval for future updates
setInterval(() => {
    download(csv_url, csv_path);
}, interval);
