DROP DATABASE IF EXISTS recipes_db;
CREATE DATABASE recipes_db;

\c recipes_db

DROP TABLE IF EXISTS recipes CASCADE;
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255) NOT NULL,
  author VARCHAR(60) NOT NULL,
  category VARCHAR(50) NOT NULL,
  ingredient1 VARCHAR(50) NOT NULL,
  ingredient2 VARCHAR(50),
  ingredient3 VARCHAR(50),
  ingredient4 VARCHAR(50),
  ingredient5 VARCHAR(50)
);



INSERT INTO recipes (name, description, author, category, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5)
VALUES
(
  'Creamy Garlic Chicken Pasta',
  'Rich pasta with garlic cream sauce and tender chicken.',
  'Kadan',
  'Dinner',
  'chicken breast',
  'pasta',
  'garlic',
  'heavy cream',
  'parmesan'
),
(
  'Spicy Jalapeno Omelet',
  'Fluffy omelet with sauteed jalapenos and cheese.',
  'Kadan',
  'Breakfast',
  'eggs',
  'jalapeno',
  'cheddar cheese',
  'butter',
  'salt'
),
(
  'Honey Soy Chicken Rice Bowl',
  'Savory chicken over rice with sweet soy glaze.',
  'Kadan',
  'Dinner',
  'chicken thigh',
  'rice',
  'soy sauce',
  'honey',
  'garlic'
),
(
  'Roasted Veggie Quinoa Bowl',
  'Healthy bowl with roasted vegetables and quinoa.',
  'Kadan',
  'Lunch',
  'quinoa',
  'zucchini',
  'bell pepper',
  'olive oil',
  'lemon'
),
(
  'Chocolate Banana Smoothie',
  'Creamy smoothie with chocolate and ripe banana.',
  'Kadan',
  'Dessert',
  'banana',
  'milk',
  'cocoa powder',
  'honey',
  'ice'
);