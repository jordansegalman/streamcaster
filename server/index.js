var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');
var validator = require('validator');
var bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config();

const port = process.env.PORT;
const saltRounds = 14;
const crypto = require('crypto');

// Setup Express
var app = express();
app.use(bodyParser.json());
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

// Setup transcode child processes
const { spawn } = require('child_process');
var transcodeProcesses = {};

// Listen on port
app.listen(port, function (error) {
	if (error) throw error;
	console.log('Server listening on port ' + port + '.');
});

// Called when a stream is started
app.post('/api/start_stream', function (req, res) {
	if (!req.body || !req.body.name) {
		// If request does not contain stream key
		return res.status(400).end();
	} else if (req.body.name != 'test') {
		// If stream key invalid
		return res.status(403).end();
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
	res.status(200).end();
	console.log('Stream started.');
});

// Called when a stream is stopped
app.post('/api/stop_stream', function (req, res) {
	// Stop transcode process
	transcodeProcesses[req.body.name].kill('SIGTERM');
	delete transcodeProcesses[req.body.name];
	fs.unlink('./thumbnails/' + req.body.name + '.png', function (error) {
		if (error) throw error;
	});
	console.log('Stream stopped.');
});

// Called when user attempts registration
app.post('/api/register', function (req, res) {
	if (!req.body || !req.body.username || !req.body.password) {
		return res.status(400).json({response: 'Invalid POST request'});
	}
	// Validate username
	if (!validateUsername(req.body.username)) {
		return res.status(400).json({response: 'Invalid username'});
	}
	// Validate password
	if (!validatePassword(req.body.password)) {
		return res.status(400).json({response: 'Invalid password'});
	}
	register(req.body.username, req.body.password, res);
});

// Caled when user attempts to log in
app.post('/api/login', function (req, res) {
	if (!req.body || !req.body.username || !req.body.password) {
		return res.status(400).json({response: 'Invalid POST request'});
	}
	// Validate username
	if (!validateUsername(req.body.username)) {
		return res.status(400).json({response: 'Invalid username'});
	}
	// Validate password
	if (!validatePassword(req.body.password)) {
		return res.status(400).json({response: 'Invalid password'});
	}
	login(req.body.username, req.body.password, res);
});

// Validates a user ID
function validateUid(uid) {
	return !validator.isEmpty(uid) && validator.isHexadecimal(uid) && validator.isLength(uid, {min: 16, max: 16});
}

// Validates a username
function validateUsername(username) {
	return !validator.isEmpty(username) && validator.isAlphanumeric(username) && validator.isLength(username, {min: 4, max: 32});
}

// Validates a password
function validatePassword(password) {
	return !validator.isEmpty(password) && validator.isAscii(password) && validator.isLength(password, {min: 8, max: 64});
}

// Registers an account
function register(username, password, res) {
	// Check if username already exists
	var sql = 'SELECT ?? FROM ?? WHERE ??=?';
	var inserts = ['username', 'accounts', 'username', username];
	dbConnection.query(sql, inserts, function (error, results) {
		if (error) throw error;
		if (results.length != 0) {
			return res.status(400).json({response: 'Username exists'});
		} else {
			// Hash password
			bcrypt.hash(password, saltRounds, function (err, hash) {
				// Generate user ID and check if already exists
				var uid = crypto.randomBytes(8).toString('hex');
				var sql = 'SELECT ?? FROM ?? WHERE ??=?';
				var inserts = ['uid', 'accounts', 'uid', uid];
				dbConnection.query(sql, inserts, function (error, results) {
					if (error) throw error;
					if (results.length != 0) {
						return res.status(500).json({response: 'User ID collision'});
					} else {
						// Insert account in accounts table
						var sql = 'INSERT INTO ?? SET ?';
						var inserts = ['accounts', {'uid': uid, 'username': username, 'password': hash}];
						dbConnection.query(sql, inserts, function (error, results) {
							if (error) throw error;
							if (results.affectedRows != 1) {
								return res.status(500).json({response: 'Registration error'});
							}
							console.log('Account registered.');
							return res.status(200).json({response: 'Registration successful'});
						});
					}
				});
			});
		}
	});
}

// Logs a user in
function login(username, password, res) {
        // Get user ID and password hash for username
        var sql = 'SELECT ??,?? FROM ?? WHERE ??=?';
        var inserts = ['uid', 'password', 'accounts', 'username', username];
        dbConnection.query(sql, inserts, function (error, results) {
                if (error) throw error;
                if (results.length != 1) {
                        return res.status(400).json({response: 'Invalid username or password'});
                } else {
                        // Compare sent password hash to account password hash
                        bcrypt.compare(password, result[0].password, function (err, result) {
                                if (result === true) {
                                        console.log("User logged in.");
                                        return res.status(200).json({response: 'Login successful'});
                                } else {
                                        return res.status(400).json({response: 'Invalid username or password'});
                                }
                        });
                }
        });
}
