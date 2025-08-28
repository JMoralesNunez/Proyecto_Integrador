import { setProductId } from "./global.js"
import { PRODUCT_API } from "./url_menu.js"

export const menuModal = {
    async open(id = null){
        const productName = document.getElementById('productName')
        const productPrice = document.getElementById('productPrice')
        if (id) {
            //Edit mode
            try {
                const res = await fetch(PRODUCT_API + id)
                const item = await res.json()
                setProductId(id)
                document.getElementById("modalTitle").textContent = "Editar producto"
                productName.value = item.name_product;
                productPrice.value = item.price;
            } catch (error) {
                console.log(error);
            }
        } else {
            //Add mode
            setProductId(null)
            document.getElementById("modalTitle").textContent = "Añadir producto"
            productName.value = ""
            productPrice.value = ""
        }
        const menuDialog = document.getElementById("menuDialog");
        menuDialog.showModal()
    },
    close(){
        const menuDialog = document.getElementById("menuDialog");
        menuDialog.close()
    }
}