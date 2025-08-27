SELECT COUNT(*)
FROM orders
WHERE order_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' >= CURRENT_DATE
AND order_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' < CURRENT_DATE + INTERVAL '1 day';


SELECT COUNT(*) AS total_reservas_today
FROM reservations
WHERE date_reservation AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' >= CURRENT_DATE
AND date_reservation AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' < CURRENT_DATE + INTERVAL '1 day';


SELECT COALESCE(SUM(total_price), 0) AS total_ingresos_today
FROM orders
WHERE order_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' >= CURRENT_DATE
AND order_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota' < CURRENT_DATE + INTERVAL '1 day';


SELECT
o.id_order,
o.order_date,
o.total_price,
o.status,
c.full_name AS client_name,
c.address AS client_address
FROM orders o
LEFT JOIN clients c ON o.id_client = c.id_client;


SELECT
r.id_reservation,
r.date_reservation,
c.full_name AS client_name,
t.id_table AS table_number
FROM reservations r
LEFT JOIN clients c ON r.id_client = c.id_client
LEFT JOIN rest_tables t ON r.id_table = t.id_table;



