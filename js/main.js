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
}); 