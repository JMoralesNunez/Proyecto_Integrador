const e = require("express");
const pool = require("../db");
const path = require('path');

exports.getAllTables = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rest_tables');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
}

exports.getTableById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM rest_tables WHERE id_table = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching tablet:', error);
        res.status(500).json({ error: 'Error fetching product' });
    }
}

exports.createTable = async (req, res) => {
    const { id_table, capacity, availability } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO rest_tables (id_table, capacity, availability) VALUES ($1, $2, $3) RETURNING *',
            [id_table, capacity, availability]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating table:', error);
        res.status(500).json({ error: 'Error creating table' });
    }
}

exports.updateTable = async (req, res) => {
    const { id } = req.params;
    const { capacity, availability } = req.body;
    try {
        const result = await pool.query(
            'UPDATE rest_tables SET  capacity = $1, availability = $2 WHERE id_table = $3 RETURNING *',
            [capacity, availability, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating table:', error);
        res.status(500).json({ error: 'Error updating table' });
    }
}

exports.deleteTable = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM rest_tables WHERE id_table = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.status(200).json({ message: 'Table deleted successfully' });
    } catch (error) {
        console.error('Error deleting table:', error);
        res.status(500).json({ error: 'Error deleting table' });
    }
}


exports.occupyTable = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE rest_tables SET availability = 'occupied' WHERE id_table = $1", [id]);
    res.status(200).json({ message: "Mesa ocupada con éxito" });
  } catch (error) {
    console.error("Error al ocupar mesa:", error);
    res.status(500).json({ error: "Error al ocupar mesa" });
  }
};

exports.freeTable = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE rest_tables SET availability = 'available' WHERE id_table = $1", [id]);
    res.status(200).json({ message: "Mesa liberada con éxito" });
  } catch (error) {
    console.error("Error al liberar mesa:", error);
    res.status(500).json({ error: "Error al liberar mesa" });
  }
};