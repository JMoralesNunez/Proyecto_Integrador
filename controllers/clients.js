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
    const result = await pool.query("SELECT * FROM clients WHERE id_client = $1", [id]);
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
  const {id_client, full_name, phone, addres } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clients (id_client, full_name, phone, address) VALUES ($1, $2, $3, $4) RETURNING *",
      [id_client, full_name, phone, addres]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: "Cliente no creado" });
  }
}

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, addres } = req.body;
  try {
    const result = await pool.query(
      "UPDATE clients SET full_name = $1, phone = $2, address = $3 WHERE id_client = $4 RETURNING *",
      [full_name, phone, addres, id]
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
    const result = await pool.query("DELETE FROM clients WHERE id_client = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: "Cliente no eliminado" });
  }
}  
