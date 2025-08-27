

export const reservationLoaders = {
    async reservations() {
        const reservationsContainer = document.getElementById("reservationsContainer")
        reservationsContainer.innerHTML = ""
        const res = await fetch();
        const reservations = await res.json();
        reservations.forEach(reservation => {
            const row = document.createElement("div")
            row.className = "reservations-card-body card-body"
            row.innerHTML = `
                <div class="reservations-card-header">
                    <h4 class="code-title">
                        <p>${reservation}</p>
                        <p class="code-order-status" style="background-color: #a7c957">
                        ${reservation}
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
                        <p class="reservation-data">${reservation}</p>
                        <p class="reservation-data">
                            <i class="fa-solid fa-phone"></i> ${reservation}
                        </p>
                    </div>
                    <div class="reservation-details">
                        <h5>Detalles de la reserva</h5>
                            <p class="reservation-data">
                                <i class="fa-solid fa-calendar-days"></i> ${reservation}
                            </p>
                        <p class="reservation-data">
                            <i class="fa-solid fa-clock"></i> ${reservation}
                        </p>
                        <p class="reservation-data">Mesa ${reservation}</p>
                    </div>
                </div>
            `;
            reservationsContainer.appendChild(row)
        });
    },
    async saveReservation(){

    }
}