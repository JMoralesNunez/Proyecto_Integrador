import { orderModals } from "./orderModal.js";
import { ordersLoaders } from "./ordersControl.js";
import { orderHandlers } from "./orderHandlers.js";


document.addEventListener("DOMContentLoaded", ()=>{
    ordersLoaders.orders();

    document.getElementById("searchOrder").addEventListener("input", function(){
    const filter = this.value.toLowerCase();
    const orders = document.querySelectorAll(".order-item");

    orders.forEach(order => {
        const client = order.querySelector(".client-name");
        if (client) {
            const name = client.textContent.toLowerCase();
            order.style.display = name.includes(filter) ? "block" : "none";
        }
    });
});
})

document.getElementById("closeDetailsDialog").addEventListener("click", ()=>{
    orderModals.close()
})

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("orderModal");
  if (modalEl) {
    modalEl.addEventListener("show.bs.modal", () => orderHandlers.openOrderModal());
  }

  const btnCreateOrder = document.getElementById("btnCreateOrder");
  if (btnCreateOrder) btnCreateOrder.addEventListener("click", () => orderHandlers.createOrder());

  const btnAddProduct = document.getElementById("btnAddProduct");
  if (btnAddProduct) btnAddProduct.addEventListener("click", () => orderHandlers.addProductTemp());

  const btnSaveOrder = document.getElementById("btnSaveOrder");
  if (btnSaveOrder) btnSaveOrder.addEventListener("click", () => orderHandlers.saveOrder());

  const btnCancelOrder = document.getElementById("btnCancelOrder");
  if (btnCancelOrder) btnCancelOrder.addEventListener("click", () => orderHandlers.cancelOrder());
});
