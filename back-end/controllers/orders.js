const e = require("express");
const pool = require("../db");
const path = require('path');

exports.getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
    o.id_order,
    TO_CHAR(o.order_date, 'DD/MM/YYYY HH12:MI AM') AS order_date,
    o.total_price,
    o.status,
    c.full_name AS client_name,
    c.phone,
    c.address AS client_address
    FROM orders o
    LEFT JOIN clients c ON o.id_client = c.id_client;
`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ordenes:", error);
    res.status(500).json({ error: "Ordenes no obtenidas" });
  }
};


exports.getNumberOrders = async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT COUNT(*)
    FROM orders
    WHERE order_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' >= CURRENT_DATE
    AND order_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' < CURRENT_DATE + INTERVAL '1 day';

`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ordenes:", error);
    res.status(500).json({ error: "Ordenes no obtenidas" });
  }
};


exports.getTotalOrders = async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT COALESCE(SUM(total_price), 0) AS total_revenue_today
    FROM orders
    WHERE order_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' >= CURRENT_DATE
    AND order_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' < CURRENT_DATE + INTERVAL '1 day'
    AND status = 'terminada';

`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ordenes:", error);
    res.status(500).json({ error: "Ordenes no obtenidas" });
  }
};



exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM orders WHERE id_order = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener orden:", error);
    res.status(500).json({ error: "Orden no obtenida" });
  }
}

exports.createOrder = async (req, res) => {
  const order_date = new Date();
  const { status, id_table, id_client } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO orders (order_date, status) VALUES ($1) RETURNING *",
      [order_date, status, id_table, id_client]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear orden:", error);
    res.status(500).json({ error: "Orden no creada" });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM orders WHERE id_order = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    res.json({ message: "Orden eliminada" });
  } catch (error) {
    console.error("Error al eliminar orden:", error);
    res.status(500).json({ error: "Orden no eliminada" });
  }
}
