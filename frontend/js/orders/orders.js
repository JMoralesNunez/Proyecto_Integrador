import { orderModals } from "./orderModal.js";
import { ordersLoaders } from "./ordersControl.js";


document.addEventListener("DOMContentLoaded", ()=>{
    ordersLoaders.orders()
})

document.getElementById("closeDetailsDialog").addEventListener("click", ()=>{
    orderModals.close()
})