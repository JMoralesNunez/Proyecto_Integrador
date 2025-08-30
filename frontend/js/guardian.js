let isAuth = sessionStorage.getItem("user");

if (isAuth != "true") {    
    window.location = "../pages/login.html";
}