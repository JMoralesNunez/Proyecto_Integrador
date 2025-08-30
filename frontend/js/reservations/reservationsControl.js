import { RESERVATIONS_API, CLIENTS_API } from "./url_res.js";
let currentClientId = null


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
  async saveReservation() {
    const date = document.getElementById("date").value;
    const hour = document.getElementById("hour").value;
    const tableSelect = document.getElementById("orderTable").value;
    await this.createClient()
    console.log(hour);
    try {
      const res = await fetch(RESERVATIONS_API, {
        "method": 'POST',
        "headers": {
          'Content-Type': 'application/json'
        },
        "body": JSON.stringify({
          "date_reservation": date,
          "hour_reservation": hour,
          "id_client": currentClientId,
          "id_table": tableSelect,
          "status": "confirmada"
        })
      });
      const data = await res.json();
      currentClientId = null
    } catch (error) {
      console.error('Error on POST:', error);
    }
    const modalEl = document.getElementById("add-reservation");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  },
  async createClient() {
    const clientName = document.getElementById("clientName").value;
    const clientPhone = document.getElementById("clientPhone").value;
    try {
      const existingClients = await this.getClientIds()
      const clientId = await this.newClientId(existingClients)

      const res = await fetch(CLIENTS_API, {
        "method": 'POST',
        "headers": {
          'Content-Type': 'application/json'
        },
        "body": JSON.stringify({
          "id_client": clientId,
          "full_name": clientName,
          "phone": clientPhone
        })
      });
      const data = await res.json();
      currentClientId = clientId
    } catch (error) {
      console.error('Error on POST:', error);
    }
  },
  async loadTables() {
    try {
      const res = await fetch("http://localhost:3001/rest_tables");
      const tables = await res.json();

      const tableSelect = document.getElementById("orderTable");
      tableSelect.innerHTML = '<option value=""> Sin mesa </option>';

      tables.forEach(table => {
        const opt = document.createElement("option");
        opt.value = table.id_table;
        opt.textContent = `Mesa ${table.id_table} (Cap: ${table.capacity}) - ${table.availability}`;
        tableSelect.appendChild(opt);
      });
    } catch (error) {
      console.error("Error al cargar mesas:", error);
      alert("No se pudieron cargar las mesas.");
    }
  },
  async getClientIds() {
    try {
      const res = await fetch(CLIENTS_API);
      const data = await res.json();
      return data.map(client => client.id_client);
    } catch (error) {
      console.error("Error fetching client IDs:", error);
      return [];
    }
  },
  idGenerator() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  },
  async newClientId(existingId) {
    let newId;
    do {
      newId = this.idGenerator();
    } while (existingId.includes(newId));
    return newId;
  }
};

