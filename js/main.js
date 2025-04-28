document.addEventListener('DOMContentLoaded', () => {
    // Добавляем анимацию при прокрутке к элементам
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами, которые будем анимировать
    document.querySelectorAll('.feature-card, .voting-section h2, .voting-description, .card-container, .diagram-item').forEach(el => {
        el.classList.add('to-animate');
        observer.observe(el);
    });

    // Добавляем подсветку активной вкладки в меню
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Добавляем эффект параллакса для фона
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        document.body.style.backgroundPosition = `center ${scrollPosition * 0.05}px`;
    });

    // Мобильное меню
    const menuButton = document.querySelector('.mobile-menu-button');
    const navbarItems = document.querySelector('.navbar-items');
    
    menuButton?.addEventListener('click', function() {
        navbarItems.classList.toggle('active');
        
        // Анимация кнопки меню
        const spans = menuButton.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
        
        if (navbarItems.classList.contains('active')) {
            spans[0].style.transform = 'translateY(9px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Закрытие меню при клике вне меню
    document.addEventListener('click', function(e) {
        if (!menuButton.contains(e.target) && !navbarItems.contains(e.target) && navbarItems.classList.contains('active')) {
            navbarItems.classList.remove('active');
            
            const spans = menuButton.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Обработка клика на пункты меню на мобильных устройствах
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navbarItems.classList.remove('active');
                
                const spans = menuButton.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
}); 