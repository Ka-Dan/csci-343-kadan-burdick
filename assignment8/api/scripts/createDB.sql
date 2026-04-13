DROP DATABASE IF EXISTS recipes_db;
CREATE DATABASE recipes_db;

\c recipes_db

DROP TABLE IF EXISTS ingredients CASCADE;
CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  is_admin BOOLEAN DEFAULT FALSE,
  email VARCHAR(75) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS authors CASCADE;
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS recipes CASCADE;
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255) NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS recipe_ingredients CASCADE;
CREATE TABLE recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE
);

DO $$
  DECLARE
    -- Authors
    kadan_author_id INT;
    mike_author_id INT;
    randy_author_id INT;
    izaiah_author_id INT;
    sarah_author_id INT;

    -- Ingredients
    egg_ingredient_id INT;
    butter_ingredient_id INT;
    penne_ingredient_id INT;
    heavy_cream_ingredient_id INT;
    spinach_ingredient_id INT;
    ground_beef_ingredient_id INT;
    chicken_ingredient_id INT;
    green_pepper_ingredient_id INT;
    avocado_oil_ingredient_id INT;
    parmesan_ingredient_id INT;

  BEGIN
    INSERT INTO authors(name) VALUES('Kadan') RETURNING id INTO kadan_author_id;
    INSERT INTO authors(name) VALUES('Mike') RETURNING id INTO mike_author_id;
    INSERT INTO authors(name) VALUES('Randy') RETURNING id INTO randy_author_id;
    INSERT INTO authors(name) VALUES('Izaiah') RETURNING id INTO izaiah_author_id;
    INSERT INTO authors(name) VALUES('Sarah') RETURNING id INTO sarah_author_id;

    INSERT INTO ingredients(name) VALUES('Egg') RETURNING id INTO egg_ingredient_id;
    INSERT INTO ingredients(name) VALUES('Butter') RETURNING id INTO butter_ingredient_id;
    INSERT INTO ingredients(name) VALUES('Penne') RETURNING id INTO penne_ingredient_id;
    INSERT INTO ingredients(name) VALUES('Heavy Cream') RETURNING id INTO heavy_cream_ingredient_id;
    INSERT INTO ingredients(name) VALUES('Spinach') RETURNING id INTO spinach_ingredient_id;
    INSERT INTO ingredients(name) VALUES('Ground Beef') RETURNING id INTO ground_beef_ingredient_id;
    INSERT INTO ingredients(name) VALUES('Chicken') RETURNING id INTO chicken_ingredient_id;
    INSERT INTO ingredients(name) VALUES('Green Pepper') RETURNING id INTO green_pepper_ingredient_id;
    INSERT INTO ingredients(name) VALUES('Avocado Oil') RETURNING id INTO avocado_oil_ingredient_id;
    INSERT INTO ingredients(name) VALUES('Parmesan Cheese') RETURNING id INTO parmesan_ingredient_id;
  END
$$