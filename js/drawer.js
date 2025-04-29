(()=>{
    const menu = document.getElementById("menu");
    const drawer_overflow = document.querySelectorAll(".drawer-overflow");
    const drawer_close = document.querySelectorAll(".drawer-close");


    const drawer_menu = document.getElementById("drawer-menu");

    const handleClick = (e) => {
        drawer_menu.setAttribute("data-opened", drawer_menu.getAttribute("data-opened") == "true" ? "false" : "true");
        
    }

    const handleClose = (e) => {
        e.target.closest(".drawer").setAttribute("data-opened", "false");
    }

    drawer_overflow.forEach(el=>{
        el.addEventListener("click", handleClose);
    });

    drawer_close.forEach(el=>{
        el.addEventListener("click", handleClose);
    });

    menu.addEventListener("click", handleClick);
})();