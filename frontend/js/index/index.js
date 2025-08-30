import { summaryLoaders } from "./indexControl.js";

document.addEventListener("DOMContentLoaded", ()=>{
    summaryLoaders.ordersNumber()
    summaryLoaders.income()
    summaryLoaders.reservationsNumber()
    summaryLoaders.orders()
    summaryLoaders.reservations()
})

document.getElementById("logoutBtn").addEventListener("click", ()=>{
    sessionStorage.clear()
    window.location.href = "/frontend/pages/login.html"
    
})