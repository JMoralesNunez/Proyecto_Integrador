import { NUMBER_API, INCOME_API, RESERVATION_API, ORDERS_API, RESERVATIONS_API } from "./url_index.js";



export const summaryLoaders = {
    async ordersNumber() {
        const orderNumber = document.getElementById("orderNumber")
        orderNumber.innerHTML = ""
        const res = await fetch(NUMBER_API);
        const [orderNum] = await res.json()
        orderNumber.innerText = orderNum.count
    },
    async reservationsNumber() {
        const reservationNumber = document.getElementById("reservationNumber")
        reservationNumber.innerHTML = ""
        const res = await fetch(RESERVATION_API);
        const [reservationNum] = await res.json()
        reservationNumber.innerText = reservationNum.total_reservations_today
    },
    async income() {
        const income = document.getElementById("income")
        income.innerHTML = ""
        const res = await fetch(INCOME_API);
        const [revenue] = await res.json()
        income.innerText = revenue.total_revenue_today
    },
    async orders() {
        const ordersContainer = document.getElementById("ordersContainer")
        ordersContainer.innerHTML = ""
        const res = await fetch(ORDERS_API);
        const orders = await res.json();
        orders.forEach(order => {
            const row = document.createElement("div")
            row.className = "order-table-body"
            row.innerHTML = `
        <div class="card mb-3 order-card" style="max-width: 540px">
            <div class="row order-row">
                <div class="col-md-8">
                    <div class="order-card-body">
                        <div class="order-id-status">
                            <h5 class="order-card-title">#${order.id_order}</h5>
                            <span class="order-status" style="background-color: #ffd60a;">${order.status}</span>
                        </div>
                        <p class="order-card-text">${order.client_name}</p>
                        <p class="order-card-text">${order.id_table}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <h5>${order.total_price}</h5>
                    <h6>${order.order_date}</h6>
                </div>
            </div>
        </div>
        `;
            ordersContainer.appendChild(row)
        });
    },
    async reservations() {
        const reservationsContainer = document.getElementById("reservationsContainer");
        reservationsContainer.innerHTML = "";
        const res = await fetch(RESERVATIONS_API);
        const reservations = await res.json();
        reservations.forEach(reservation => {
            const row = document.createElement("div");
            row.className = "reservations-table-body";
            row.innerHTML = `
            <div class="card mb-3 reservations-card-index" style="max-width: 540px">
                <div class="row reservations-row">
                    <div class="col-md-8">
                        <div class="reservations-card-body">
                            <h5 class="reservations-card-title">
                            ${reservation.date_reservation}
                            </h5>
                            <p class="reservations-card-text">${reservation.client_name}</p>
                            <p class="reservations-card-text">
                                <small class="text-body-secondary">${reservation.phone}</small>
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <h5>Mesa #${reservation.table_number}</h5>
                    </div>
                </div>
            </div>
            `;
            reservationsContainer.appendChild(row)
        });
    }
} 
