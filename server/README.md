# Server Setup Instructions

## Prerequisites

* Node.js
* MySQL
* Nginx
* FFmpeg

## Installation

1. Setup MySQL

```
CREATE DATABASE database;
USE database;
CREATE TABLE accounts (uid VARCHAR(16) NOT NULL, username VARCHAR(32) NOT NULL, password VARCHAR(64) NOT NULL, stream_key VARCHAR(64) NOT NULL, PRIMARY KEY (uid), UNIQUE KEY uid (uid), UNIQUE KEY username (username), UNIQUE KEY stream_key (stream_key));
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON database.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
```

2. Install Node.js dependencies

```
npm install
```

3. Add variables PORT, DB_HOST, DB_USER, DB_PASS, DB_NAME, COOKIE_NAME, COOKIE_SECRET, and COOKIE_DOMAIN to .env

## Running

```
node index.js
```
