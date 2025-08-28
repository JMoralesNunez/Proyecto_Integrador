import { ORDERS_API } from "./url_orders.js";

export const orderModals = {
    async open(id) {
        const detailsTable = document.getElementById("detailsTable");
        detailsTable.innerHTML = ""
        try {
            const res = await fetch(`${ORDERS_API}${id}/items`);
            const details = await res.json();
            details.forEach(detail => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <th>${detail.quantity}</th>
                    <td>${detail.name_product}</td>
                    <td>${detail.total_producto}</td>
                `;
                detailsTable.appendChild(row)
            });
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