const e = require("express");
const pool = require("../db");
const path = require('path');
const escpos = require("escpos");
escpos.USB = require("escpos-usb");


exports.getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
    o.id_order,
    o.id_table,
    TO_CHAR(o.order_date, 'DD/MM/YYYY HH12:MI AM') AS order_date,
    o.total_price,
    o.status,
    c.full_name AS client_name,
    c.phone,
    c.address AS client_address
    FROM orders o
    LEFT JOIN clients c ON o.id_client = c.id_client
    ORDER BY o.order_date DESC;
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
    WHERE order_date >= (CURRENT_DATE AT TIME ZONE 'America/Bogota')
    AND order_date < ((CURRENT_DATE + INTERVAL '1 day') AT TIME ZONE 'America/Bogota')
    AND status = 'terminada';

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
    SELECT COALESCE(SUM(total_price), 0) AS total_ingresos_today
    FROM orders
    WHERE order_date >= (CURRENT_DATE AT TIME ZONE 'America/Bogota')
    AND order_date < ((CURRENT_DATE + INTERVAL '1 day') AT TIME ZONE 'America/Bogota')
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
      "INSERT INTO orders (order_date, status, id_table, id_client) VALUES ($1, $2, $3, $4) RETURNING *",
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

exports.getItemsByOrderId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        oi.id_order_item,
        oi.id_order,
        oi.quantity,
        p.id_product,
        p.name_product,
        p.price,
        (oi.quantity * p.price) AS total_producto
      FROM order_items oi
      INNER JOIN products p ON oi.id_product = p.id_product
      WHERE oi.id_order = $1
      ORDER BY oi.id_order_item ASC;
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron items para esta orden" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener items de la orden:", error);
    res.status(500).json({ error: "No se pudieron obtener los items" });
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, total_price, id_table, id_client } = req.body;

  try {
    const result = await pool.query(
      `UPDATE orders 
       SET 
         status = COALESCE($1, status), 
         total_price = COALESCE($2, total_price), 
         id_table = COALESCE($3, id_table), 
         id_client = COALESCE($4, id_client)
       WHERE id_order = $5 
       RETURNING *`,
      [status, total_price, id_table, id_client, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    res.status(500).json({ error: "Orden no actualizada" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["terminada", "cancelada", "en proceso"].includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  try {
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id_order = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ error: "No se pudo actualizar el estado" });
  }
};

exports.updateTableStatus = async (req, res) => {
  const { id_table } = req.params;
  const { status } = req.body;
  if (!["occupied", "available", "reserved"].includes(status)) {
    return res.status(400).json({ error: "Estado de mesa inválido" });
  }

  try {
    const result = await pool.query(
      "UPDATE rest_tables SET status = $1 WHERE id_table = $2 RETURNING *",
      [status, id_table]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mesa no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar estado de la mesa:", error);
    res.status(500).json({ error: "No se pudo actualizar el estado de la mesa" });
  }
};


