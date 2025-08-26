const e = require("express");
const pool = require("../db");
const path = require('path');

exports.getAllClients = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clients");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: "Clientes no obtenidos" });
  }
}

exports.getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM clients WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ error: "Cliente no obtenido" });
  }
}

exports.createClient = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clients (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
      [name, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: "Cliente no creado" });
  }
}

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    const result = await pool.query(
      "UPDATE clients SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *",
      [name, email, phone, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ error: "Cliente no actualizado" });
  }
}  

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM clients WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: "Cliente no eliminado" });
  }
}  
