document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollTrigger);

    const scroller = document.querySelector('.scroll-container');

    function getScrollTop() {
        if (scroller) return scroller.scrollTop || 0;
        return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    function onScrollAttach(handler) {
        if (scroller) scroller.addEventListener('scroll', handler, { passive: true });
        else window.addEventListener('scroll', handler, { passive: true });
    }

    // === GSAP HERO анімація ===
    gsap.from("header .logo", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" });
    gsap.from("header nav a", { y: -30, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out", delay: 0.3 });
    gsap.from("header .contact-button, header .lang-switch", { y: -30, opacity: 0, duration: 0.6, delay: 0.8, ease: "power2.out" });
    gsap.from(".hero h2", { x: -50, opacity: 0, duration: 1, ease: "power3.out", delay: 1 });
    gsap.from(".hero p, .hero .features", { x: -30, opacity: 0, duration: 0.8, delay: 1.3, ease: "power2.out" });
    gsap.fromTo(".hero .btn", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.2, delay: 1.5, stagger: 0.2, ease: "power2.out" });
    gsap.from(".hero .product-image", { x: 80, opacity: 0, duration: 1, delay: 1.2, ease: "power3.out" });

    // === Анімації скролу ===
    gsap.utils.toArray("section h2").forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, scroller: ".scroll-container", start: "top 80%" },
            y: 60, opacity: 0, duration: 1, ease: "power3.out"
        });
    });

    gsap.utils.toArray(".card").forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, scroller: ".scroll-container", start: "top 85%" },
            y: 40, opacity: 0, scale: 0.95, duration: 0.7, delay: i * 0.1, ease: "power2.out"
        });
    });

    gsap.utils.toArray("section img").forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, scroller: ".scroll-container", start: "top 90%" },
            opacity: 0, scale: 0.9, duration: 1, ease: "power2.out"
        });
    });

    gsap.utils.toArray(".faq-item").forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, scroller: ".scroll-container", start: "top 85%" },
            y: 30, opacity: 0, duration: 0.6, delay: i * 0.15, ease: "power2.out"
        });
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                if (scroller) scroller.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Слайдер
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slider img');
    const btnLeft = document.querySelector('.slide-btn.left');
    const btnRight = document.querySelector('.slide-btn.right');
    let index = 0;
    let autoSlideInterval;

    if (slider) slider.style.transition = 'transform 0.5s ease';

    function showSlide(i) {
        if (!slider || slides.length === 0) return;
        index = (i + slides.length) % slides.length;
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    if (btnLeft) btnLeft.addEventListener('click', () => showSlide(index - 1));
    if (btnRight) btnRight.addEventListener('click', () => showSlide(index + 1));

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => showSlide(index + 1), 7000);
    }
    function stopAutoSlide() { clearInterval(autoSlideInterval); }

    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        startAutoSlide();
    }
    showSlide(index);

    // Міжнародалізація
    const translations = { /* залишаємо як у тебе */ };

    window.setLang = function (lang) { /* залишаємо як у тебе */ };

    // Кнопки скролу
    let lastScrollTop = 0;
    let timeout;
    const buttons = document.querySelectorAll('.scroll-down');
    onScrollAttach(() => {
        clearTimeout(timeout);
        let currentScroll = getScrollTop();
        if (Math.abs(currentScroll - lastScrollTop) > 20) {
            buttons.forEach(btn => btn.classList.add('hidden'));
        }
        timeout = setTimeout(() => {
            buttons.forEach(btn => btn.classList.remove('hidden'));
        }, 1000);
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    // Кнопка "наверх"
    const toTopBtn = document.querySelector('.to-top');
    onScrollAttach(() => {
        if (toTopBtn) {
            if (getScrollTop() > 300) toTopBtn.classList.add('show');
            else toTopBtn.classList.remove('show');
        }
    });
    if (toTopBtn) {
        toTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
            else document.getElementById('top').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Бургер-меню
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    let navLinks = [];
    if (burger && nav) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            burger.classList.toggle('active');
        });
        navLinks = document.querySelectorAll('#nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                burger.classList.remove('active');
            });
        });
        document.addEventListener('click', (event) => {
            if (!nav.contains(event.target) && !burger.contains(event.target)) {
                nav.classList.remove('active');
                burger.classList.remove('active');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                nav.classList.remove('active');
                burger.classList.remove('active');
            }
        });
    }

    // === НОВИЙ трекінг секцій (через scroller) ===
    const sectionIds = Array.from(navLinks).map(link => link.getAttribute('href').replace('#', ''));

    function onScrollActiveSection() {
        if (!scroller) return;
        const scrollTop = scroller.scrollTop;
        const containerHeight = scroller.clientHeight;
        let currentSection = null;
        sectionIds.forEach(id => {
            const section = document.getElementById(id);
            if (!section) return;
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const middle = scrollTop + containerHeight / 2;
            if (middle >= sectionTop && middle <= sectionBottom) {
                currentSection = id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active-section', link.getAttribute('href') === '#' + currentSection);
        });
    }

    onScrollAttach(onScrollActiveSection);
    onScrollActiveSection();
});

// FAQ
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            faqItems.forEach(i => { if (i !== item) i.classList.remove('active'); });
            item.classList.toggle('active');
        });
    });
});
