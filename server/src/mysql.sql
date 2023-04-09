CREATE DATABASE notetaker;

CREATE USER 'notetaker'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

GRANT ALL PRIVILEGES ON notetaker.* TO 'notetaker'@'localhost';

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) UNIQUE,
    password CHAR(60)
);

CREATE TABLE metadata (
    id INT,
    user_id INT,
    parent INT,
    name VARCHAR(20),
    color CHAR(7),
    type VARCHAR(10),
    modified TIMESTAMP,
    PRIMARY KEY (id, user_id)
);

CREATE TABLE data (
    id INT,
    user_id INT,
    text TEXT CHARACTER SET utf8mb4,
    modified TIMESTAMP,
    PRIMARY KEY (id, user_id)
);
