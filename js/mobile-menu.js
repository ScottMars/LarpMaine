document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById("menu");
    const drawerMenu = document.getElementById("drawer-menu");
    const drawerOverflow = document.querySelectorAll(".drawer-overflow");
    const drawerClose = document.querySelectorAll(".drawer-close");
    const mobileMenuLinks = document.querySelectorAll("#drawer-menu a");

    // Функция открытия/закрытия меню
    const toggleMenu = () => {
        const isOpened = drawerMenu.getAttribute("data-opened") === "true";
        drawerMenu.setAttribute("data-opened", (!isOpened).toString());
        
        // Блокируем прокрутку body когда меню открыто
        document.body.style.overflow = !isOpened ? 'hidden' : '';
    };

    // Функция закрытия меню
    const closeMenu = (e) => {
        if (e && e.target) {
            const drawer = e.target.closest(".drawer");
            if (drawer) {
                drawer.setAttribute("data-opened", "false");
                document.body.style.overflow = '';
            }
        }
    };

    // Обработчик для кнопки меню
    if (menu) {
        menu.addEventListener("click", toggleMenu);
    }

    // Обработчики для закрытия меню
    drawerOverflow.forEach(el => {
        el.addEventListener("click", closeMenu);
    });

    drawerClose.forEach(el => {
        el.addEventListener("click", closeMenu);
    });

    // Закрываем меню при клике на ссылку
    mobileMenuLinks.forEach(link => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    // Закрываем меню при изменении размера окна на десктопный
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) { // 768px - breakpoint для мобильного меню
            closeMenu();
        }
    });
}); 