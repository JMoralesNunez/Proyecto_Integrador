CREATE DATABASE order_management

CREATE TABLE clients (
    id_client VARCHAR(120) PRIMARY KEY,
    full_name VARCHAR(120) not NULL, 
    phone VARCHAR(45) NULL UNIQUE,
    address VARCHAR(200) NULL
);


insert into clients (id_client,full_name,phone,address) values ('1909523199', 'jonatan morales', '3226353136', 'cra 88 #35 d28')

CREATE TABLE products (
    id_product SERIAL PRIMARY KEY,
    name_product VARCHAR(120) NOT NULL UNIQUE,
    price INT NOT NULL CHECK (price > 0)
);

CREATE TABLE rest_tables (
    id_table SERIAL PRIMARY KEY,
    capacity INT NOT NULL CHECK (capacity > 0),
    availability VARCHAR(20) NOT NULL,
    CONSTRAINT chk_availability CHECK (availability IN ('available', 'reserved', 'occupied'))
);

CREATE TABLE orders (
    id_order SERIAL PRIMARY KEY,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('terminada', 'cancelada', 'en proceso')),
    total_price INT NOT NULL,
    id_table INT null,
    id_client VARCHAR(120),
    FOREIGN KEY (id_table) REFERENCES rest_tables(id_table),
    FOREIGN KEY (id_client) REFERENCES clients(id_client)
);


CREATE TABLE order_items (
    id_order_item SERIAL PRIMARY KEY,
    id_order INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    id_product INT NULL,
    FOREIGN KEY(id_order) REFERENCES orders(id_order) ON DELETE CASCADE,
    FOREIGN KEY(id_product) REFERENCES products(id_product) ON DELETE CASCADE
);



CREATE TABLE reservations (
    id_reservation SERIAL PRIMARY KEY,
    date_reservation DATE NOT NULL,
    hour_reservation TIME NOT null,
    id_client VARCHAR(120) NOT NULL,
    id_table INT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('confirmada','cancelada')) not null,
    FOREIGN KEY(id_client) REFERENCES clients(id_client),
    FOREIGN KEY(id_table) REFERENCES rest_tables(id_table)
);

INSERT INTO rest_tables (capacity, availability) VALUES
(2, 'available'),
(2, 'available'),
(4, 'reserved'),
(4, 'available'),
(6, 'occupied'),
(6, 'available'),
(8, 'reserved'),
(8, 'available'),
(10, 'occupied'),
(12, 'available');

INSERT INTO products (name_product, price) VALUES
('Hamburguesa Clásica', 18000),
('Pizza Margarita', 25000),
('Ensalada César', 15000),
('Sopa de Tomate', 12000),
('Pollo Asado con Papas', 22000),
('Spaghetti a la Boloñesa', 20000),
('Sandwich de Jamón y Queso', 10000),
('Limonada Natural', 6000),
('Cerveza Artesanal', 8000),
('Postre de Chocolate', 9000);


drop table clients; 6
drop table order_items; 2
drop table orders; 3
drop table products; 5
drop table reservations; 1
drop table rest_tables; 4

select * from clients;

select * from clients where id_client = '5233737797';