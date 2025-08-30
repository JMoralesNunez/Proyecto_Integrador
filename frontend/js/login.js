const btnLogin = document.getElementById("btnLogin");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");


document.addEventListener("DOMContentLoaded", () => {
    btnLogin.addEventListener("click", async ()=>{
        const email = emailInput.value;
        const password = passwordInput.value;
        
        try {
            const response = await fetch("http://localhost:3001/login"); 
            const admins = await response.json();

            const user = admins.find(
                admin => admin.email_admin === email && admin.password_admin === password
            );

            if (user) {
                alert("¡Login exitoso!");
                sessionStorage.setItem("user", "true");
                window.location = "../index.html";
            } else {
                alert("Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error en el login:", error);
        }
    });
});
