CREATE DATABASE order_management

CREATE TABLE clients (
    id_client SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL, 
    phone VARCHAR(45) NOT NULL,
    address VARCHAR(120)
);

CREATE TABLE products (
    id_product SERIAL PRIMARY KEY,
    name_product VARCHAR(120) NOT NULL UNIQUE,
    price INT NOT NULL UNIQUE
);

CREATE TABLE rest_tables (
    id_table SERIAL PRIMARY KEY,
    capacity INT NOT NULL,
    availability VARCHAR(20) NOT NULL,
    CONSTRAINT chk_availability CHECK (availability IN ('available', 'reserved', 'occupied'))
);

CREATE TABLE orders (
    id_order SERIAL PRIMARY KEY,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_price INT NOT NULL,
    id_table INT,
    id_client INT,
    FOREIGN KEY(id_table) REFERENCES rest_tables(id_table),
    FOREIGN KEY(id_client) REFERENCES clients(id_client)
);

CREATE TABLE order_items (
    id_order_item SERIAL PRIMARY KEY,
    id_order INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    id_product INT NOT NULL,
    FOREIGN KEY(id_product) REFERENCES products(id_product),
    FOREIGN KEY(id_order) REFERENCES orders(id_order)
);

CREATE TABLE reservations (
    id_reservation SERIAL PRIMARY KEY,
    capacity INT NOT NULL,
    date_reservation TIMESTAMP NOT NULL,
    id_client INT,
    id_table INT,
    FOREIGN KEY(id_client) REFERENCES clients(id_client),
    FOREIGN KEY(id_table) REFERENCES rest_tables(id_table)
);