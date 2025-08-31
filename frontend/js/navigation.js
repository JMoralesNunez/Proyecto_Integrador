
document.addEventListener('DOMContentLoaded', function() {
    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();

        if (path.includes('index.html') || path.endsWith('/') || page === '') {
            return 'dashboard';
        } else if (page === 'reservations.html') {
            return 'reservations';
        } else if (page === 'orders.html') {
            return 'orders';
        } else if (page === 'menu.html') {
            return 'menu';
        }
        return 'dashboard';
    }

    function setActiveMenuButton() {
        const currentPage = getCurrentPage();

        const sidebarButtons = document.querySelectorAll('aside .menu .btn');
        sidebarButtons.forEach(btn => btn.classList.remove('active'));

        const sidebarLinks = {
            'dashboard': 'a[href*="index.html"]',
            'reservations': 'a[href*="reservations.html"]', 
            'orders': 'a[href*="orders.html"]',
            'menu': 'a[href*="menu.html"]'
        };
        
        if (sidebarLinks[currentPage]) {
            const activeButton = document.querySelector(`aside .menu ${sidebarLinks[currentPage]}`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }

    function setActiveMobileButton() {
        const currentPage = getCurrentPage();

        const mobileButtons = document.querySelectorAll('.mobile-nav-item');
        mobileButtons.forEach(btn => btn.classList.remove('active'));

        const mobileNavIds = {
            'dashboard': 'nav-dashboard',
            'reservations': 'nav-reservations',
            'orders': 'nav-orders',
            'menu': 'nav-menu'
        };
        
        if (mobileNavIds[currentPage]) {
            const activeButton = document.getElementById(mobileNavIds[currentPage]);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }

    setActiveMenuButton();
    setActiveMobileButton();

    const sidebarButtons = document.querySelectorAll('aside .menu .btn');
    sidebarButtons.forEach(button => {
        button.addEventListener('click', function(e) {

            setTimeout(() => {
                sidebarButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            }, 50);
        });
    });

    const mobileButtons = document.querySelectorAll('.mobile-nav-item');
    mobileButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.id !== 'nav-logout') {
                setTimeout(() => {
                    mobileButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }, 50);
            }
        });
    });

    const mobileLogoutBtn = document.getElementById('nav-logout');
    const sidebarLogoutBtn = document.getElementById('logoutBtn');
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', function() {
           
            if (sidebarLogoutBtn) {
                sidebarLogoutBtn.click();
            }
        });
    }

 
    function handleResize() {
        const width = window.innerWidth;
        const body = document.body;
        
        if (width <= 991) {

            body.classList.add('mobile-nav-active');
        } else {
            
            body.classList.remove('mobile-nav-active');
        }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        const touchElements = document.querySelectorAll('.btn, .mobile-nav-item, .stats-card');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
});

const touchStyles = `
    .touch-device .btn,
    .touch-device .mobile-nav-item {
        -webkit-tap-highlight-color: transparent;
        user-select: none;
    }
    
    .touch-device .mobile-nav-item:active {
        background-color: rgba(255, 126, 0, 0.2);
    }
    
    .touch-device .menu .btn:active {
        background-color: var(--orange-background);
        color: var(--white);
    }
`;

if ('ontouchstart' in window) {
    const style = document.createElement('style');
    style.textContent = touchStyles;
    document.head.appendChild(style);
}