DROP DATABASE IF EXISTS books_db;
CREATE DATABASE books_db;

\c books_db

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  is_admin BOOLEAN DEFAULT FALSE,
  email VARCHAR(75) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS authors CASCADE;
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  title VARCHAR(10),
  first_name VARCHAR(100),
  middle_name VARCHAR(100),
  last_name VARCHAR(100)
);

DROP TABLE IF EXISTS books CASCADE;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) UNIQUE NOT NULL,
  author_id INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL
);

DO $$
  DECLARE
    -- Users
    michael_user_id INT;
    steven_user_id INT;

    -- Authors
    dr_seuss_author_id INT;
    margaret_wise_brown_author_id INT;
    william_goldman_author_id INT;
    thomas_harris_author_id INT;
    michael_scott_author_id INT;
  BEGIN
    -- Password: P@ssw0rd!
    INSERT INTO users(email, is_admin, password) VALUES('michael.desanty@mcla.edu', true, '$2a$12$Y5D7gtrXx8inzxq/143NNuu3oOv6Vb5g8Ug/n1ohJNgbnSQgebM2y') RETURNING id INTO michael_user_id;
    INSERT INTO users(email, password) VALUES('steven@gmail.com', '$2a$12$Y5D7gtrXx8inzxq/143NNuu3oOv6Vb5g8Ug/n1ohJNgbnSQgebM2y') RETURNING id INTO steven_user_id;

    INSERT INTO authors(title, last_name) VALUES('Dr.', 'Seuss') RETURNING id INTO dr_seuss_author_id;
    INSERT INTO authors(first_name, middle_name, last_name) VALUES('Margaret', 'Wise', 'Brown') RETURNING id INTO margaret_wise_brown_author_id;
    INSERT INTO authors(first_name, last_name) VALUES('William', 'Goldman') RETURNING id INTO william_goldman_author_id;
    INSERT INTO authors(first_name, last_name) VALUES('Thomas', 'Harris') RETURNING id INTO thomas_harris_author_id;
    INSERT INTO authors(first_name, middle_name, last_name) VALUES('Michael', 'G.', 'Scott') RETURNING id INTO michael_scott_author_id;

    INSERT INTO books(title, author_id, user_id) VALUES('The Cat in the Hat', dr_seuss_author_id, steven_user_id);
    INSERT INTO books(title, author_id, user_id) VALUES('Goodnight Moon', margaret_wise_brown_author_id, steven_user_id);
    INSERT INTO books(title, author_id, user_id) VALUES('The Princess Bride', william_goldman_author_id, michael_user_id);
    INSERT INTO books(title, author_id, user_id) VALUES('The Silence of the Lambs', thomas_harris_author_id, michael_user_id);
    INSERT INTO books(title, author_id, user_id) VALUES('Somehow I Manage', michael_scott_author_id, michael_user_id);
  END
$$