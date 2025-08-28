import { getProductId, setProductId } from "./global.js";
import { menuModal } from "./menuModals.js";
import { PRODUCT_API } from "./url_menu.js";


export const menuController = {
    async load() {
        const menuContainer = document.getElementById("menuContainer");
        menuContainer.innerHTML = "";
        const res = await fetch(PRODUCT_API);
        const items = await res.json();
        items.forEach(item => {
            const row = document.createElement("article");
            row.className = "content_item";
            row.innerHTML = `
                <h2 class="item_name">${item.name_product}</h2>
                <p class="item_description"><strong>${item.price}</strong></p>
                <div id="menuActions">
                </div>
            `;
            const actionsCell = row.querySelector("#menuActions");
            const deleteBtn = document.createElement("button")
            deleteBtn.className = "btn deleteBtn";
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can" style="color: red;"></i>';
            deleteBtn.addEventListener("click", () => {
                this.erase(item.id_product)
            });
            const editBtn = document.createElement("button")
            editBtn.className = "btn editBtn"
            editBtn.innerHTML = '<i class="fa-solid fa-pen" style="color: black;"></i>'
            editBtn.addEventListener("click", () => {
                menuModal.open(item.id_product)
            });
            actionsCell.append(deleteBtn, editBtn);
            menuContainer.appendChild(row);
        });
    },
    async save() {
        const productName = document.getElementById("productName").value;
        const productPrice = document.getElementById("productPrice").value;

        if (getProductId()) {
            //Edit mode
            try {
                const res = await fetch(`${PRODUCT_API}${getClientId()}`, {
                    "method": 'PUT',
                    "headers": {
                        'Content-Type': 'application/json'
                    },
                    "body": JSON.stringify({
                        "name_product": productName,
                        "price": productPrice
                    })
                });
                const data = await res.json();
            } catch (error) {
                console.error('Error on PUT:', error);
            }
        } else {
            //Create mode
            setProductId(null)
            try {
                const res = await fetch(PRODUCT_API, {
                    "method": 'POST',
                    "headers": {
                        'Content-Type': 'application/json'
                    },
                    "body": JSON.stringify({
                        "name_product": productName,
                        "price": productPrice
                    })
                });
                const data = await res.json();
            } catch (error) {
                console.error('Error on POST:', error);
            }
        }
        this.load();
        menuModal.close()
        setProductId(null)
    },
    async erase(id){
        try {
            const res = await fetch(`${PRODUCT_API}${id}`, {
                "method": 'DELETE'
            });
            if (res.ok) {
                console.log('DELETE: Item deleted');
            } else {
                console.error('DELETE failed');
            }
        } catch (error) {
            console.error('Error on DELETE:', error);
        }
        this.load();
    }
}