export const menuController = {
    async load(){
        const menuContainer = document.getElementById("menuContainer");
        menuContainer.innerHTML = "";
        const res = await fetch();
        const items = await res.json();
        items.forEach(item => {
            const row = document.createElement("article");
            row.className = "content_item";
            row.innerHTML = `
                <h2 class="item_name">Bandeja Paisa</h2>
                <p class="item_description"><strong>$25.000</strong></p>
                <div id="menuActions">
                </div>
            `;
            const actionsCell = row.querySelector(".menuActions");
            const deleteBtn = document.createElement("button")
            deleteBtn.className = "btn deleteBtn";
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can" style="color: red;"></i>';
            deleteBtn.addEventListener("click", ()=>{
                this.erase(item.id)
            });
            const editBtn = document.createElement("button")
            editBtn.className = "btn editBtn"
            editBtn.innerHTML = '<i class="fa-solid fa-pen" style="color: black;"></i>'
            editBtn.addEventListener("click", ()=>{
                this.edit(item.id)
            });
            actionsCell.appendChild(deleteBtn, editBtn);
            menuContainer.appendChild(row);
        });
    }
}