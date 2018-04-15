var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');
var validator = require('validator');
var bcrypt = require('bcrypt');
var session = require('express-session');
var morgan = require('morgan');

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
app.use(morgan('tiny'));

// Setup session
app.set('trust proxy', 1);
app.use(session({
	name: process.env.COOKIE_NAME,
	secret: process.env.COOKIE_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: { domain: process.env.COOKIE_DOMAIN, httpOnly: true, secure: true, maxAge: 31536000000 }
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

// Called when user attempts to log in
app.post('/api/login', function (req, res) {
	if (!req.body || !req.body.username || !req.body.password) {
		return res.status(400).json({response: 'Invalid POST request'});
	}
	// If session authenticated
	if (req.session && req.session.authenticated && req.session.authenticated === true) {
		return res.status(400).json({response: 'Already logged in'});
	}
	// Validate username
	if (!validateUsername(req.body.username)) {
		return res.status(400).json({response: 'Invalid username'});
	}
	// Validate password
	if (!validatePassword(req.body.password)) {
		return res.status(400).json({response: 'Invalid password'});
	}
	login(req.body.username, req.body.password, req, res);
});

// Checks if session is authenticated
app.get('/api/check_authenticated', function (req, res) {
	// If session authenticated
	if (req.session && req.session.authenticated && req.session.authenticated === true) {
		return res.status(200).json({response: 'Authenticated'});
	}
	return res.status(400).json({response: 'Not authenticated'});
});

// Called when user attempts to log out
app.get('/api/logout', function (req, res) {
	// If session not authenticated
	if (!req.session || !req.session.authenticated || req.session.authenticated !== true) {
		return res.status(400).json({response: 'Not logged in'});
	}
	logout(req, res);
});

// Called when user attempts to delete account
app.post('/api/delete_account', function (req, res) {
	if (!req.body || !req.body.password) {
		return res.status(400).json({response: 'Invalid POST request'});
	}
	// If session not authenticated
	if (!req.session || !req.session.authenticated || req.session.authenticated !== true) {
		return res.status(400).json({response: 'Not logged in'});
	}
	// Validate password
	if (!validatePassword(req.body.password)) {
		return res.status(400).json({response: 'Invalid password'});
	}
	deleteAccount(req.body.password, req, res);
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
function login(username, password, req, res) {
	// Get user ID and password hash for username
	var sql = 'SELECT ??,?? FROM ?? WHERE ??=?';
	var inserts = ['uid', 'password', 'accounts', 'username', username];
	dbConnection.query(sql, inserts, function (error, results) {
		if (error) throw error;
		if (results.length != 1) {
			return res.status(400).json({response: 'Invalid username or password'});
		} else {
			// Compare sent password hash to account password hash
			bcrypt.compare(password, results[0].password, function (err, result) {
				if (result === true) {
					// Setup session
					req.session.authenticated = true;
					req.session.uid = results[0].uid;
					req.session.username = username;
					console.log("User logged in.");
					return res.status(200).json({response: 'Login successful'});
				} else {
					return res.status(400).json({response: 'Invalid username or password'});
				}
			});
		}
	});
}

// Logs a user out
function logout(req, res) {
	// Destroy the session
	req.session.destroy(function (err) {
		if (err) throw err;
		console.log('User logged out.');
		return res.status(200).json({response: 'Logout successful'});
	});
}

// Deletes an account
function deleteAccount(password, req, res) {
	// Get password hash for user ID
	var sql = 'SELECT ?? FROM ?? WHERE ??=?';
	var inserts = ['password', 'accounts', 'uid', req.session.uid];
	dbConnection.query(sql, inserts, function (error, results) {
		if (error) throw error;
		if (results.length != 1) {
			return res.status(500).json({response: 'User ID not found'});
		} else {
			// Compare sent password hash to account password hash
			bcrypt.compare(password, results[0].password, function (err, result) {
				if (result === true) {
					// Delete account
					var sql = 'DELETE FROM ?? WHERE ??=?';
					var inserts = ['accounts', 'uid', req.session.uid];
					dbConnection.query(sql, inserts, function (error, results) {
						if (error) throw error;
						if (results.affectedRows != 1) {
							return res.status(500).json({response: 'Account deletion error'});
						}
						// Destroy the session
						req.session.destroy(function (err) {
							if (err) throw err;
							console.log('Account deleted.');
							return res.status(200).json({response: 'Account deletion successful'});
						});
					});
				} else {
					return res.status(400).json({response: 'Invalid password'});
				}
			});
		}
	});
}
