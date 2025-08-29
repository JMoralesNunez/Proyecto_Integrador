import { reservationLoaders } from "./reservationsControl.js"

document.addEventListener("DOMContentLoaded", ()=>{
    reservationLoaders.reservations();

    document.getElementById("searchReservation").addEventListener("input", function(){
    const filter = this.value.toLowerCase();
    const reservations = document.querySelectorAll(".reservations-card-body");

    reservations.forEach(reservation => {
        const client = reservation.querySelector(".client-name");
        if (client) {
            const name = client.textContent.toLowerCase();
            reservation.style.display = name.includes(filter) ? "block" : "none";
        }
    });
});
})

document.getElementById("openReservationModal").addEventListener("click", ()=>{
    reservationLoaders.loadTables()
})

document.getElementById("createReservation").addEventListener("click", ()=>{
    reservationLoaders.saveReservation()
})