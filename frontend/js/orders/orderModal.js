
export const orderModals = {
    async open(id) {
        const quantity = document.getElementById("quantity");
        const productName = document.getElementById("productName");
        const total = document.getElementById("total");

        try {
            const res = await fetch(API+id);
            const [data] = await res.json();
            quantity.innerText = data.quantity;
            productName.innerText = data.name;
            total.innerText = data.total_price
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