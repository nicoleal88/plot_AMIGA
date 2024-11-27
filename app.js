// app.js

console.log('App running...');

//Import Express library
const express = require('express');

//Import CORS
const cors = require('cors');

// Create Express app
const app = express();
app.use(cors());

// Start the Express server
const server = app.listen(3000, listening);

function listening() {
	console.log('Server listening on port 3000!');
}

app.use(express.static('public'));

// A sample route
// app.get('/', (req, res) => res.send('Hello World!'))

const fs = require('fs');

const request = require('request');

const csv_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3WkkXWxUp3TXEBsqGeeAtuMNKwVu3ZPASyzY8C43B5fWEyKqp2Xs0sEcM3_VXy_eoJNI_a8Mo8aiN/pub?gid=182439664&single=true&output=csv"

const path = './public/csv/'

const csv_path = path + 'data.csv'

const date_path = path + 'lastUpdate.txt';

function download(url, path, callback) {
	request.head(url, (err, res, body) => {
		request(url)
			.pipe(fs.createWriteStream(path))
			.on('close', callback)
	})
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
download(csv_url, csv_path, writeDateFile);

// Then set up interval for future updates
setInterval(download, interval, csv_url, csv_path, writeDateFile);
