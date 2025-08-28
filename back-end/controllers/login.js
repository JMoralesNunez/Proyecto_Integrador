const pool = require("../db");

exports.login = async (req , res) => {
    try {
        const result = await pool.query("SELECT * FROM administrators");
        res.json(result.rows);
         
    } catch (error) {
    console.error("Error al obtener el administrador:", error);
    res.status(500).json({ error: "administrador no obtenidos"});
    }
}