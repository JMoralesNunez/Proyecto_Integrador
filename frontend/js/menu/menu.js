import { menuController } from "./menuControl.js";
import { menuModal } from "./menuModals.js";


document.addEventListener("DOMContentLoaded", ()=>{
    menuController.load()
})

document.getElementById("addProduct").addEventListener("click", (e)=>{
    e.preventDefault()
    menuModal.open()
});

document.getElementById("closeMenuDialog").addEventListener("click", ()=>{
    menuModal.close()
});

document.getElementById("saveMenuChanges").addEventListener("click", ()=>{
    menuController.save()
});