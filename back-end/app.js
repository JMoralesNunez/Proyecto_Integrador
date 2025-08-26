const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db'); 

const clientsRouter = require('./routes/clients');

const app = express();
const app_port = process.env.APP_PORT || 3000

app.use(cors());
app.use(express.json());


app.use('/clients', clientsRouter);

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT 1 + 1 AS solution');
        const solution = result.rows[0].solution; 

        res.status(200).json({ 
            message: 'Servidor del CRUD está funcionando.', 
            solution: solution
        });
    } catch (error) {
        console.error('Error en la base de datos:', error);
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
    }
});

app.listen(app_port, () => {
    console.log(`Servidor corriendo en http://localhost:${app_port}`);
});