import { RESERVATIONS_API } from "../reservations/url_res.js";
import { URL_REST_TABLES } from "./url_restables.js";

export const resTablesLoader = () => {
  setInterval(async () => {
    try {
      const res = await fetch(RESERVATIONS_API);
      const reservations = await res.json();
      // obtenemos la fecha con un proceso largo porque de otra forma no funciona ya que el formato viene con retracción de hora y no es posible comparar directamente
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const dateNow = `${year}-${month}-${day}`;
      
      // obtenemos la hora actual
      const hourNow = now.getHours();
      const minuteNow = now.getMinutes();

      console.log(`Verificando reservaciones - Fecha actual: ${dateNow}, Hora actual: ${hourNow}:${minuteNow.toString().padStart(2, '0')}`);

      // realizamos for of para hacer posible await dentro del ciclo (for each no se deja)
      for (const reservation of reservations) {
        const dateReservationRaw = String(reservation.date_reservation).slice(0, 10);
        const hourReservation = reservation.hour_reservation.slice(0, 5);
        
        // Convertir fecha de DD/MM/YYYY a YYYY-MM-DD
        const [day, month, year] = dateReservationRaw.split("/");
        const fechaReservaISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        // Extraemos la hora y minuto de la hora de la reservación
        const [hourReservationNum, minuteReservationNum] = hourReservation.split(":").map(Number);


        // Verificar si es la misma fecha
        if (dateNow === fechaReservaISO) {
          console.log("Fechas coinciden");
          
          // Verificar si la hora coincide (considerando una tolerancia de unos minutos)
          const reservationTimeInMinutes = hourReservationNum * 60 + minuteReservationNum;
          const currentTimeInMinutes = hourNow * 60 + minuteNow;
          const timeDifference = Math.abs(currentTimeInMinutes - reservationTimeInMinutes);
          
          console.log(`  Diferencia en minutos: ${timeDifference}`);
          
          // Tolerancia de 2 minutos para encontrar las diferencias)
          if (timeDifference <= 2) {
            console.log("🚨 🔴Coinciden la fecha y la hora (dentro del rango de tolerancia)🔴");
            
            if (reservation.status === "confirmada") {
              console.log(`Ocupando mesa: ${reservation.table_number}`);
              try {
                const occupyResponse = await fetch(`${URL_REST_TABLES}${reservation.table_number}/occupy`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" }
                });
                
                if (occupyResponse.ok) {
                  console.log("Mesa ocupada exitosamente");

                } else {
                  console.error("Error en la respuesta del servidor:", occupyResponse.status);
                }
              } catch (error) {
                console.error("Error al ocupar mesa:", error);
              }
            } else {
              console.log(`Reservación no confirmada (status: ${reservation.status})`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error al verificar reservations:", error);
    }
  }, 30000); 
};