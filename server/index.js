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
})

app.post('/api/start_stream', function (req, res) {
	if (!req.body || !req.body.name) {
		return res.status(500).send('Invalid POST request');
	} else if (req.body.name != 'test') {
		return res.status(403).send('Invalid stream key');
	}
	console.log('Stream started.');
	res.status(200).send('OK');
})

app.post('/api/stop_stream', function (req, res) {
	console.log(req.body.name);
	console.log('Stream stopped.');
})
