import { ORDERS_API } from "./url_orders.js";



export const orderModals = {
    async open(id) {
        const quantity = document.getElementById("quantity");
        const productName = document.getElementById("productName");
        const total = document.getElementById("total");

        try {
            const res = await fetch(ORDERS_API+id);
            const [data] = await res.json();
            quantity.innerText = data.total_cantidad;
            productName.innerText = data.name_product;
            total.innerText = data.total_cantidad
        } catch (error) {
            console.log(error);
        }
        const detailsModal = document.getElementById("detailsModal");
        detailsModal.showModal()
    },
    close(){
        const detailsModal = document.getElementById("detailsModal");
        detailsModal.close()
    }
}