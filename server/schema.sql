#DROP DATABASE microhoods;
CREATE DATABASE microhoods;

USE microhoods;

CREATE TABLE users (
  username VARCHAR(30), user_id SERIAL NOT NULL  PRIMARY KEY
);

CREATE TABLE tags (
  user_id int, tag VARCHAR(50), coordinates VARCHAR(50), tag_id SERIAL NOT NULL PRIMARY KEY
);
