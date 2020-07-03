// app.js

console.log('App running...');

//Import Express library
const express = require('express');

//Import CORS
// const cors = require('cors');

// Create Express app
const app = express();
// app.use(cors());

// Start the Express server
const server = app.listen(3000, listening);

function listening(){
	console.log('Server listening on port 3000!');
}

app.use(express.static('public'));

// A sample route
// app.get('/', (req, res) => res.send('Hello World!'))

