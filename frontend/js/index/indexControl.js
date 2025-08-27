

export const summaryLoaders = {
    async ordersNumber() {
        const orderNumber = document.getElementById("orderNumber")
        orderNumber.innerHTML = ""
        const res = await fetch();
        const orderNum = await res.json()
        orderNumber.innerHTML = orderNum
    },
    async reservationsNumber() {
        const reservationNumber = document.getElementById("reservationNumber")
        reservationNumber.innerHTML = ""
        const res = await fetch();
        const reservationNum = await res.json()
        reservationNumber.innerHTML = reservationNum
    },
    async income() {
        const income = document.getElementById("income")
        income.innerHTML = ""
        const res = await fetch();
        const revenue = await res.json()
        income.innerHTML = revenue
    },
    async orders() {
        const ordersContainer = document.getElementById("ordersContainer")
        ordersContainer.innerHTML = ""
        const res = await fetch();
        const orders = await res.json();
        orders.forEach(order => {
            const row = document.createElement("div")
            row.className = "order-table-body"
            row.innerHTML = `
            <div class="card mb-3 order-card" style="max-width: 540px">
                <div class="row order-row">
                    <div class="col-md-8">
                        <div class="order-card-body">
                            <h5 class="order-card-title">
                            ${order}
                            </h5>
                            <p class="order-status" style="background-color: #ffd60a;">${order}</p>
                            <p class="order-card-text">${order}</p>
                            <p class="order-card-text">
                            <small class="text-body-secondary">${order}</small>
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <h5>${order}</h5>
                        <h6>${order}</h6>
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
        const res = await fetch();
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
                            ${reservation}
                            <p class="reservations-people">${reservation} Personas</p>
                            </h5>
                            <p class="reservations-card-text">${reservation}</p>
                            <p class="reservations-card-text">
                                <small class="text-body-secondary">Mesa ${reservation}</small>
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <h5>${reservation}</h5>
                        <h6>${reservation}</h6>
                    </div>
                </div>
            </div>
            `;
            reservationsContainer.appendChild(row)
        });
    }
} 