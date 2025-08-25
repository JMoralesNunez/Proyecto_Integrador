const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const cors = require('cors')
const app = express();
app.use(express.json());

// conexion a base de datos que viene desde el env melisimo
const pool = new Pool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT
});


//upload clientes funcional trabajando al dia con postman :)

    app.post('/upload_client', async (req, res) => {
    const { full_name, phone, address } = req.body;
    try {
        const result = await pool.query(
        'INSERT INTO clients (full_name, phone, address) VALUES ($1, $2, $3) RETURNING *',
        [full_name, phone, address]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
    });
//get funcional melo caramelo ya se pueden ver usuarios
    app.get("/clients", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clients");
    return res.json(result.rows); 
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: "Clientes no obtenidos" });
  }
});

//post crear mesas melas caramelas 
app.post('/upload_tables', async (req, res) => {
    const { capacity, availability } = req.body;
    try {
        const result = await pool.query(
        'INSERT INTO rest_tables (capacity, availability) VALUES ($1, $2) RETURNING *',
        [capacity, availability]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al crear la mesa' });
    }
    });

//get para ver todas las mesas podemso filtrar para cer disponibles oresservadas o usasdas
    app.get("/tables", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rest_tables");
    return res.json(result.rows); 
  } catch (error) {
    console.error("Error al obtener mesas:", error);
    res.status(500).json({ error: "Mesas no obtenidas" });
  }
});

 app.post('/upload_product', async (req, res) => {
    const { name_product, price } = req.body;
    try {
        const result = await pool.query(
        'INSERT INTO products (name_product, price) VALUES ($1, $2) RETURNING *',
        [name_product, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
    });

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    return res.json(result.rows); 
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Productos no obtenidos" });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
