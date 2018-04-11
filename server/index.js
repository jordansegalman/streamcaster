const port = 3000;

var express = require('express');
var bodyParser = require('body-parser');

// Setup Express
var app = express();
app.use(bodyParser.urlencoded({
	extended: true
}));

// Listen on port
app.listen(port, function (err) {
	if (err) {
		return console.log(err);
	}
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
	console.log('Stream stopped.');
});
