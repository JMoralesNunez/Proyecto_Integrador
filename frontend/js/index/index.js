import { summaryLoaders } from "./indexControl.js";

document.addEventListener("DOMContentLoaded", ()=>{
    summaryLoaders.ordersNumber()
    summaryLoaders.income()
    summaryLoaders.reservationsNumber()
    summaryLoaders.orders()
    summaryLoaders.reservations()
})