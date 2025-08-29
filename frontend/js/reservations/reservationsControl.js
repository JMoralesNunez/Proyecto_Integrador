import { RESERVATIONS_API } from "./url_res.js";



export const reservationLoaders = {
  async reservations() {
    const reservationsContainer = document.getElementById("reservationsContainer");
    reservationsContainer.innerHTML = "";
    const res = await fetch(RESERVATIONS_API);
    const reservations = await res.json();

    reservations.forEach(reservation => {
      let back_color = "";
      if (reservation.status == "confirmada") {
        back_color = "green";
      }
      if (reservation.status == "cancelada") {
        back_color = "red";
      }

      const row = document.createElement("div");
      row.className = "reservations-card-body card-body reservation-item";
      row.innerHTML = `
        <div class="reservations-card-header">
          <h4 class="code-title">
            <p>#${reservation.id_reservation}</p>
            <p class="code-order-status" style="background-color: ${back_color}">
              ${reservation.status}
            </p>
          </h4>
          <select class="form-select reservation-status" data-id="${reservation.id_reservation}">
            <option value="confirmada" ${reservation.status === "confirmada" ? "selected" : ""}>Confirmada</option>
            <option value="cancelada" ${reservation.status === "cancelada" ? "selected" : ""}>Cancelada</option>
          </select>
        </div>
        <div class="reservations-card-details">
          <div class="reservation-client-data">
            <h5>Cliente</h5>
            <p class="reservation-data client-name">${reservation.client_name}</p>
            <p class="reservation-data">
              <i class="fa-solid fa-phone"></i> ${reservation.phone}
            </p>
          </div>
          <div class="reservation-details">
            <h5>Detalles de la reserva</h5>
            <p class="reservation-data">
              <i class="fa-solid fa-calendar-days"></i> ${reservation.date_reservation}
            </p>
            <p class="reservation-data">
              <i class="fa-solid fa-clock"></i> ${reservation.hour_reservation}
            </p>
            <p class="reservation-data">Mesa #${reservation.table_number}</p>
          </div>
        </div>
      `;

      const select = row.querySelector(".reservation-status");
      select.addEventListener("change", async e => {
        const newStatus = e.target.value;
        const statusTag = row.querySelector(".code-order-status");
        statusTag.textContent = newStatus;
        statusTag.style.backgroundColor = newStatus === "confirmada" ? "green" : "red";

        await fetch(`${RESERVATIONS_API}/${reservation.id_reservation}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus })
        });
      });

      reservationsContainer.appendChild(row);
    });
  },

  async saveReservation() {}
};

