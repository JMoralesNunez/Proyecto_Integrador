import { orderModals } from "./orderModal";



export const ordersLoaders = {
    async orders(){
        const ordersContainer = document.getElementById("ordersContainer");
        ordersContainer.innerHTML = "";
        const res = await fetch();
        const orders = await res.json();
        orders.forEach(order => {
            const row = document.createElement("div")
            row.className = "orders-card-body card-body"
            row.innerHTML = `
            <div class="orders-card-header">
                <h4 class="code-title">
                    <p>${order}</p>
                    <p
                    class="code-order-status"
                    style="background-color: #a7c957"
                    >
                    ${order}
                    </p>
                </h4>
                <div class="order-price">
                    <h4 class="price">${order}</h4>
                </div>
                </div>
                <div class="orders-card-details">
                    <div class="order-client-data">
                        <h5>Información del cliente</h5>
                        <p class="order-data">${order}</p>
                        <p class="order-data">
                        <i class="fa-solid fa-phone"></i> ${order}
                        </p>
                    </div>
                <div class="order-details">
                    <h5>Detalles del pedido</h5>
                    <p class="order-data">
                    <i class="fa-solid fa-calendar-days"></i> ${order}
                    </p>
                </div>
            </div>
            `;
            const actionsCell = row.querySelector(".order-details");
            const detailsBtn = document.createElement("button");
            detailsBtn.className = "order-data btn btn-info orange-btn";
            detailsBtn.innerText = "Detalles";
            detailsBtn.addEventListener("click", ()=>{
                orderModals.open(order.id)
            });
            actionsCell.appendChild(detailsBtn);
            ordersContainer.appendChild(row);
        });
    }
}