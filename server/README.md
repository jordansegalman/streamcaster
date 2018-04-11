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
CREATE TABLE accounts (uid VARCHAR(16) NOT NULL, username VARCHAR(32) NOT NULL, password VARCHAR(64) NOT NULL, PRIMARY KEY (uid), UNIQUE KEY uid (uid));
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON database.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
```

2. Install Node.js dependencies

```
npm install
```

3. Add variables PORT, DB_HOST, DB_USER, DB_PASS, and DB_NAME to .env

## Running

```
node index.js
```
