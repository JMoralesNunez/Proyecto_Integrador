import { orderModals } from "./orderModal.js";
import { ORDERS_API } from "./url_orders.js";
import { TABLES_API } from "./url_orders.js";



export const ordersLoaders = {
  async orders() {
    let back_color = "";
    const ordersContainer = document.getElementById("ordersContainer");
    ordersContainer.innerHTML = "";
    const res = await fetch(ORDERS_API);
    const orders = await res.json();
    orders.forEach(order => {
      if (order.client_address === null) {
        order.client_address = "Pedido en restaurante";
      }
      if (order.client_name === null || order.phone === null) {
        order.client_name = "Cliente no registrado";
        order.phone = "No registrado";
      }
      if (order.status == "terminada") {
        back_color = "green";
      }
      if (order.status == "cancelada") {
        back_color = "red";
      }
      if (order.status == "en proceso") {
        back_color = "orange";
      }

      const total_price = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(order.total_price);
      order.total_price = total_price;

      const row = document.createElement("div");
      row.className = "card-body order-item card";
      row.innerHTML = `
        <div class="orders-card-header">
          <h4 class="code-title">
            <p>#${order.id_order}</p>
            <span class="code-order-status" style="background-color: ${back_color}; margin-bottom: 0;">
              ${order.status}
            </span>
          </h4>
          <div class="order-price">
            <h4 class="price" style="margin-bottom: 0.5rem;">${order.total_price}</h4>
          </div>
          <div class="order-status-select-row" style="width: 100%; display: flex; justify-content: flex-end;">
            <select class="code-order-status-select">
              <option value="cancelada" ${order.status === "cancelada" ? "selected" : ""}>Cancelada</option>
              <option value="en proceso" ${order.status === "en proceso" ? "selected" : ""}>En proceso</option>
              <option value="terminada" ${order.status === "terminada" ? "selected" : ""}>Terminada</option>
            </select>
          </div>
        </div>
        <div class="orders-card-details">
          <div class="order-client-data">
            <h5>Información del cliente</h5>
            <p class="order-data client-name">${order.client_name}</p>
            <p class="order-data">
              <i class="fa-solid fa-phone"></i> ${order.phone}
            </p>
          </div>
          <div class="order-details">
            <h5>Detalles del pedido</h5>
            <p class="order-data">
              <p class="order-data"><i class="fa-solid fa-map-pin"></i> ${order.client_address}</p>
              <i class="fa-solid fa-calendar-days"></i> ${order.order_date}
            </p>
          </div>
        </div>
      `;

      const actionsCell = row.querySelector(".order-details");
      const detailsBtn = document.createElement("button");
      detailsBtn.className = "order-data btn btn-info orange-btn";
      detailsBtn.innerText = "Detalles";
      detailsBtn.addEventListener("click", () => {
        orderModals.open(order.id_order);
      });
      actionsCell.appendChild(detailsBtn);

      const select = row.querySelector(".code-order-status-select");
      select.addEventListener("change", async e => {
        const newStatus = e.target.value;
        const statusTag = row.querySelector(".code-order-status");
        statusTag.textContent = newStatus;
        if (newStatus === "terminada") statusTag.style.backgroundColor = "green";
        if (newStatus === "cancelada") statusTag.style.backgroundColor = "red";
        if (newStatus === "en proceso") statusTag.style.backgroundColor = "orange";

        await fetch(`${ORDERS_API}${order.id_order}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (order.id_table) {
          let newAvailability = null;
          if (newStatus === "en proceso") {
            newAvailability = "occupied";
          } else if (newStatus === "terminada" || newStatus === "cancelada") {
            newAvailability = "available";
          }
          if (newAvailability) {
            await fetch(`${TABLES_API}${order.id_table}/availability`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ availability: newAvailability })
            });
          }
        }
      });

      ordersContainer.appendChild(row);
    });
  }
};
