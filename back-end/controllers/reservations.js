const e = require("express");
const pool = require("../db");
const path = require('path');

exports.getAllReservations = async (req, res) => {
  try {
    const result = await pool.query(`SELECT
      r.id_reservation,
      r.date_reservation,
      c.full_name AS client_name,
      t.id_table AS table_number
      FROM reservations r
      LEFT JOIN clients c ON r.id_client = c.id_client
      LEFT JOIN rest_tables t ON r.id_table = t.id_table;
`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener items de orden:", error);
    res.status(500).json({ error: "Items de orden no obtenidos" });
  }
}

exports.getNumberReservations = async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT COUNT(*) AS total_reservas_today
    FROM reservations
    WHERE date_reservation AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' >= CURRENT_DATE
    AND date_reservation AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' < CURRENT_DATE + INTERVAL '1 day';
`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ordenes:", error);
    res.status(500).json({ error: "Ordenes no obtenidas" });
  }
};

exports.getReservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM reservations WHERE id_reservation = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item de orden no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener item de orden:", error);
    res.status(500).json({ error: "Item de orden no obtenido" });
  }
}
exports.createReservation = async (req, res) => {
  const { date_reservation, hour_reservation, id_client, id_table, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO reservations (date_reservation, hour_reservation, id_client, id_table, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [date_reservation, hour_reservation, id_client, id_table, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear item de orden:", error);
    res.status(500).json({ error: "Item de orden no creado" });
  }
}
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const { date_reservation, hour_reservation, id_client, id_table, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE reservations SET date_reservation = $1, hour_reservation = $2, id_client = $3, id_table = $4, status = $5 WHERE id_reservation = $6 RETURNING *",
      [date_reservation, hour_reservation, id_client, id_table, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item de orden no encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar item de orden:", error);
    res.status(500).json({ error: "Item de orden no actualizado" });
  }
}       


exports.deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM reservations WHERE id_reservation = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item de orden no encontrado" });
    }
    res.json({ message: "Item de orden eliminado" });
  } catch (error) {
    console.error("Error al eliminar item de orden:", error);
    res.status(500).json({ error: "Item de orden no eliminado" });
  }
}   