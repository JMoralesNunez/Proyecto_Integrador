import { RESERVATIONS_API } from "./url_res.js";



export const reservationLoaders = {
    async reservations() {
        const reservationsContainer = document.getElementById("reservationsContainer")
        reservationsContainer.innerHTML = ""
        const res = await fetch(RESERVATIONS_API);
        const reservations = await res.json();
        reservations.forEach(reservation => {
            const row = document.createElement("div")
            row.className = "reservations-card-body card-body reservation-item"
            row.innerHTML = `
                <div class="reservations-card-header">
                    <h4 class="code-title">
                        <p>#${reservation.id_reservation}</p>
                        <p class="code-order-status" style="background-color: #a7c957">
                        ${reservation.status}
                        </p>
                    </h4>
                    <select class="form-select" aria-label="select">
                        <option selected>Confirmada</option>
                        <option value="1">Pendiente</option>
                        <option value="2">Cancelada</option>
                    </select>
                </div>
                <div class="reservations-card-details">
                    <div class="reservation-client-data">
                        <h5>Cliente</h5>
                        <p class="reservation-data">${reservation.client_name}</p>
                        <p class="reservation-data">
                            <i class="fa-solid fa-phone"></i> ${reservation.phone}
                        </p>
                    </div>
                    <div class="reservation-details">
                        <h5>Detalles de la reserva</h5>
                        <p class="reservation-data">
                            <i class="fa-solid fa-calendar-days"></i> ${reservation.date_reservation}
                        </p>
                        <p class="reservation-data">Mesa #${reservation.table_number}</p>
                    </div>
                </div>
            `;
            reservationsContainer.appendChild(row)
        });
    },
    async saveReservation(){

    }
}