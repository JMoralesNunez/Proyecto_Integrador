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
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Has ingresado correctamente',
                    icon: 'success',
                    showConfirmButton: false,
                    iconColor: '#e2711d',
                    timer: 2000,
                    timerProgressBar: true
                }).then((result) => {
                sessionStorage.setItem("user", "true");
                window.location = "../index.html";
                });

            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Credenciales incorrectas',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo',
                    confirmButtonColor: '#dc3545'
                });
            }
        } catch (error) {
            console.error("Error en el login:", error);
        }
    });
});
