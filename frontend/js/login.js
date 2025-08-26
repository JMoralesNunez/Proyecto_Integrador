async function auth() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if (email && password) {
        const res = await fetch(API_URL)
        const data = await res.json();
        const user = data.find(u => u.email === email && u.password === password);
        if (user) {
                sessionStorage.setItem("auth", "true")                
                window.location = "../../home.html"
        } else {
            alert("Credenciales no permitidas")
        }
    } else {
        alert("Rellena los campos")
    }
}
const logBtn = document.querySelector(".btn").addEventListener("click", auth)