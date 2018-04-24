# Server Setup Instructions

## Prerequisites

* Node.js 9.11.1
* npm 5.8.0
* MySQL 5.7.22
* Nginx 1.13.12
  * configure arguments: --with-http_ssl_module --with-http_stub_status_module --with-file-aio --with-http_v2_module --add-module=nginx-rtmp-module
* FFmpeg 3.0.11
  * configure arguments: --enable-gpl --enable-libass --enable-libfdk-aac --enable-libfreetype --enable-libmp3lame --enable-libopus --enable-libtheora --enable-libvorbis --enable-libvpx --enable-libx264 --enable-libx265 --enable-nonfree

## Installation

1. Setup MySQL database

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

4. Create the thumbnails directory in the server root directory

```
mkdir thumbnails
```

## Running

1. Make sure Nginx and MySQL are running

2. Run the Node.js server

```
node index.js
```
