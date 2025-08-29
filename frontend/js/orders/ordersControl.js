import { orderModals } from "./orderModal.js";
import { ORDERS_API } from "./url_orders.js";



export const ordersLoaders = {
    async orders() {
        const ordersContainer = document.getElementById("ordersContainer");
        ordersContainer.innerHTML = "";
        const res = await fetch(ORDERS_API);
        const orders = await res.json();
        orders.forEach(order => {
            if (order.client_address === null) {
                order.client_address = "Pedido en restaurante"
            }
            if (order.client_name === null || order.phone === null) {
                order.client_name = "Cliente no registrado"
                order.phone = "No registrado"
            }
            const total_price = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(order.total_price);
            order.total_price = total_price

            const row = document.createElement("div")
            row.className = "card-body order-item card"
            row.innerHTML = `
            <div class="orders-card-header">
                <h4 class="code-title">
                    <p>#${order.id_order}</p>
                    <p
                    class="code-order-status"
                    style="background-color: #a7c957"
                    >
                    ${order.status}
                    </p>
                </h4>
                <div class="order-price">
                    <h4 class="price">${order.total_price}</h4>
                </div>
                </div>
                <div class="orders-card-details">
                    <div class="order-client-data">
                        <h5>Información del cliente</h5>
                        <p class="order-data">${order.client_name}</p>
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
                orderModals.open(order.id_order)
            });
            actionsCell.appendChild(detailsBtn);
            ordersContainer.appendChild(row);
        });
    }
}