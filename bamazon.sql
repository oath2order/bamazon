DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
use bamazon_db;

Create Table products(
item_id INTEGER(11) auto_increment not null,
product_name VARCHAR(25),
dept_name VARCHAR(25),
price INTEGER(4),
stock_quantity INTEGER(4),
product_sales INTEGER(11) DEFAULT 0,
primary key(item_id)
);

Insert into products (product_name, dept_name, price, stock_quantity)
VALUES ("Soda", "Food", 3, 89),
("Pizza", "Food", 8, 34), 
("Playstation", "Electronics", 400, 25),
("Clue", "Games", 15, 12),
("Harry Potter", "Books", 18, 124),
("Laptop", "Electronics", 800, 50),
("Chocolate", "Food", 5, 70),
("Legend of Zelda", "Games", 50, 189),
("Wheel of Time", "Books", 10, 10),
("Pulp Fiction", "Movies", 9, 23);

CREATE TABLE departments(
department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
dept_name VARCHAR(25), 
over_head_costs INTEGER(11),
PRIMARY KEY(department_id)
);

INSERT INTO departments (dept_name, over_head_costs)
VALUES ("Food", 100), ("Electronics", 1000), ("Books", 150), ("Games", 300), ("Movies", 50);

