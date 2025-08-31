const e = require("express");
const pool = require("../db");
const path = require('path');

exports.getAllOrder_items = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
      oi.id_order,
      p.name_product,
      SUM(oi.quantity) AS total_cantidad,
      SUM(oi.quantity * p.price) AS total_producto
      FROM order_items oi
      INNER JOIN products p ON oi.id_product = p.id_product
      GROUP BY oi.id_order, p.id_product, p.name_product
      ORDER BY oi.id_order, total_producto DESC;`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener items de orden:", error);
    res.status(500).json({ error: "Items de orden no obtenidos" });
  }
}
exports.getOrder_itemsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
    SELECT 
    oi.id_order_item,
    p.name_product,
    SUM(oi.quantity) AS total_cantidad,
    SUM(oi.quantity * p.price) AS total_producto
    FROM order_items oi
    INNER JOIN products p 
    ON oi.id_product = p.id_product
    WHERE oi.id_order_item = $1
    GROUP BY oi.id_order_item, p.id_product, p.name_product
    ORDER BY total_producto DESC;
`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item de orden no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener item de orden:", error);
    res.status(500).json({ error: "Item de orden no obtenido" });
  }
}

exports.createOrder_items = async (req, res) => {
  const { id_order, id_product, quantity } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO order_items (id_order, id_product, quantity) VALUES ($1, $2, $3) RETURNING *",
      [id_order, id_product, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear item de orden:", error);
    res.status(500).json({ error: "Item de orden no creado" });
  }
}

exports.deleteOrder_items = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM order_items WHERE id_order_item = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item de orden no encontrado" });
    }
    res.json({ message: "Item de orden eliminado" });
  } catch (error) {
    console.error("Error al eliminar item de orden:", error);
    res.status(500).json({ error: "Item de orden no eliminado" });
  }
}
