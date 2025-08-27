const e = require("express");
const pool = require("../db");
const path = require('path');

exports.getAllOrders = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
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

  try {
    const result = await pool.query(
      "INSERT INTO orders (order_date) VALUES ($1) RETURNING *",
      [order_date]
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
