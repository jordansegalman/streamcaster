var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');

// Load environment variables
require('dotenv').config();

const port = process.env.PORT;

// Setup Express
var app = express();
app.use(bodyParser.urlencoded({
	extended: true
}));

// Setup MySQL
var dbConnection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

// Listen on port
app.listen(port, function (error) {
	if (error) throw error;
	console.log('Server listening on port ' + port + '.');
});

// Setup transcode child processes
const { spawn } = require('child_process');
var transcodeProcesses = {};

app.post('/api/start_stream', function (req, res) {
	if (!req.body || !req.body.name) {
		// If request does not contain stream key
		return res.status(500).send('Invalid POST request');
	} else if (req.body.name != 'test') {
		// If stream key invalid
		return res.status(403).send('Invalid stream key');
	}
	// If stream key valid, start transcode process
	const transcode = spawn('./transcode', [req.body.name, 'test']);
	transcode.on('error', () => {
		console.log('Transcode process error.');
	});
	transcode.on('exit', () => {
		console.log('Transcode process terminated.');
	});
	transcodeProcesses[req.body.name] = transcode;
	console.log('Transcode process spawned.');
	res.status(200).send('OK');
	console.log('Stream started.');
});

app.post('/api/stop_stream', function (req, res) {
	// Stop transcode process
	transcodeProcesses[req.body.name].kill('SIGTERM');
	delete transcodeProcesses[req.body.name];
	fs.unlink('./thumbnails/' + req.body.name + '.png', function (error) {
		if (error) throw error;
	});
	console.log('Stream stopped.');
});
