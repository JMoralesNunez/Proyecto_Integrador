import { DETAILS_API } from "./url_orders.js";

export const orderModals = {
    async open(id) {
        const detailsTable = document.getElementById("detailsTable");
        try {
            const res = await fetch(DETAILS_API+id);
            const details = await res.json();
            details.forEach(detail => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <th>${detail.quantity}</th>
                    <td>${detail.product_name}</td>
                    <td>${detail.total}</td>
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