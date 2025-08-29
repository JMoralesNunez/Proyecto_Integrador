const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db'); 

const clientsRouter = require('./routes/clients');
const productsRouter = require('./routes/products');
const rest_tablesRouter = require('./routes/rest_tables');
const ordersRouter = require('./routes/orders');
const order_itemsRouter = require('./routes/order_item');
const reservationsRouter = require('./routes/reservations');
const loginRouter = require('./routes/login')

const app = express();
const app_port = process.env.APP_PORT || 3001

app.use(cors());
app.use(express.json());

app.use('/clients', clientsRouter);
app.use('/products', productsRouter);
app.use('/rest_tables', rest_tablesRouter);
app.use('/orders', ordersRouter);
app.use('/order_items', order_itemsRouter);
app.use('/reservations', reservationsRouter);
app.use('/login', loginRouter);

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT 1 + 1 AS solution');
        const solution = result.rows[0].solution; 

        res.status(200).json({ 
            message: 'Servidor funcionando.', 
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
