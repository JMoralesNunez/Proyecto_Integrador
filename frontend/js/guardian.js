function getLoginPath() {
    const currentPath = window.location.pathname;
    
    // Adjust the path based on the current location, verify if the location is index.
    if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/')) {
        return 'pages/login.html';
    }
    // verify if the location include pages, it means it is a document in the pages folder.
    else if (currentPath.includes('/pages/')) {
        return 'login.html';
    }
    else {
        return '../pages/login.html';
    }
}

function checkAuth() {
    let isAuth = sessionStorage.getItem("user");
    
    if (isAuth !== "true") {
        window.location.href = getLoginPath();
    }
}

checkAuth();