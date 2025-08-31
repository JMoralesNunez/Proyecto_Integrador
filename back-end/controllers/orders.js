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


exports.printOrderReceipt = async (req, res) => {
  const { id } = req.params;

  try {
    const orderRes = await pool.query(`
      SELECT 
        o.id_order,
        TO_CHAR(o.order_date, 'DD/MM/YYYY HH12:MI AM') AS order_date,
        o.total_price,
        c.full_name AS client_name,
        c.phone,
        c.address AS client_address
      FROM orders o
      LEFT JOIN clients c ON o.id_client = c.id_client
      WHERE o.id_order = $1
    `, [id]);

    const order = orderRes.rows[0];
    if (!order) throw new Error("Orden no encontrada");

    const formattedTotal = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(order.total_price);

    const itemsRes = await pool.query(`
      SELECT 
        p.name_product,
        oi.quantity,
        p.price
      FROM order_items oi
      JOIN products p ON oi.id_product = p.id_product
      WHERE oi.id_order = $1
    `, [id]);

    const items = itemsRes.rows;


    const formatLine = (name, qty, price) => {
      const maxNameLength = 18;
      const paddedName = name.length > maxNameLength
        ? name.slice(0, maxNameLength - 1) + '…'
        : name.padEnd(maxNameLength, ' ');
      const paddedQty = String(qty).padEnd(4, ' ');
      const formattedPrice = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price).padStart(10, ' ');
      return `${paddedName}${paddedQty}${formattedPrice}`;
    };

    const formattedItems = items.map(i =>
      formatLine(i.name_product, i.quantity, i.price)
    ).join('\n');

    const layout = `
ORDEXX
------------------------
Factura #${order.id_order}
Cliente: ${order.client_name || "No registrado"}
Tel: ${order.phone || "No registrado"}
Dirección: ${order.client_address || "Pedido en restaurante"}
Fecha: ${order.order_date}
------------------------
Producto         Cant  Precio
${formattedItems}
------------------------
Total:                 ${formattedTotal}
`;

    console.log(layout);

    try {
      const device = new escpos.USB();
      const printer = new escpos.Printer(device);
      device.open(() => {
        printer.align('CT').text(layout).cut().close();
      });
    } catch (printError) {
      console.warn("No se encontró impresora USB.");

      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "../receipts", `receipt_${order.id_order}.txt`);
      fs.writeFileSync(filePath, layout);
      console.log("Recibo simulado guardado en:", filePath);
    }

    res.json({ message: "Recibo generado y enviado a impresión" });
  } catch (error) {
    console.error("Error al imprimir recibo:", error.message);
    res.status(500).json({ error: "No se pudo imprimir el recibo" });
  }
};
