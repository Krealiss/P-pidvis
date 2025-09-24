document.addEventListener('DOMContentLoaded', function () {
    // Якщо GSAP не підключений — даємо попередження і не падаємо
    if (typeof gsap === 'undefined') {
        console.warn('GSAP не знайдено. Підключіть GSAP та ScrollTrigger щоб працювали анімації.');
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const scroller = document.querySelector('.scroll-container');
    const scrollerSelector = scroller ? '.scroll-container' : undefined;
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;

    // Невеликі допоміжні функції
    function getScrollTop() {
        if (scroller) return scroller.scrollTop || 0;
        return window.pageYOffset || document.documentElement.scrollTop || 0;
    }
    function onScrollAttach(handler) {
        if (scroller) scroller.addEventListener('scroll', handler, { passive: true });
        else window.addEventListener('scroll', handler, { passive: true });
    }

    // Налаштування ScrollTrigger за замовчуванням (якщо є кастомний scroller)
    if (scroller) {
        ScrollTrigger.defaults({ scroller: scrollerSelector });
    }

    /* =======================
       GSAP: HERO та in-view анімації
       ======================= */
    // HERO (завантаження)
    gsap.from("header .logo", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" });
    gsap.from("header nav a", { y: -30, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out", delay: 0.3 });
    gsap.from("header .contact-button, header .lang-switch", { y: -30, opacity: 0, duration: 0.6, delay: 0.8, ease: "power2.out" });
    gsap.from(".hero h2", { x: -50, opacity: 0, duration: 1, ease: "power3.out", delay: 1 });
    gsap.from(".hero p, .hero .features", { x: -30, opacity: 0, duration: 0.8, delay: 1.3, ease: "power2.out" });
    gsap.fromTo(".hero .btn", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.2, delay: 1.5, stagger: 0.2, ease: "power2.out" });
    gsap.from(".hero .product-image", { x: 80, opacity: 0, duration: 1, delay: 1.2, ease: "power3.out" });

    // Використовуємо ScrollTrigger.batch для групових анімацій — більш продуктивно
    // Заголовки секцій
    ScrollTrigger.batch("section h2", {
        scroller: scroller ? scrollerSelector : undefined,
        start: "top 80%",
        onEnter: batch => gsap.fromTo(batch, { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "power3.out" }),
        once: true
    });

    // Картки
    ScrollTrigger.batch(".card", {
        scroller: scroller ? scrollerSelector : undefined,
        start: "top 85%",
        onEnter: batch => gsap.fromTo(batch, { y: 40, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.7, ease: "power2.out" }),
        once: true
    });

    // Картинки
    ScrollTrigger.batch("section img", {
        scroller: scroller ? scrollerSelector : undefined,
        start: "top 90%",
        onEnter: batch => gsap.fromTo(batch, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.08, duration: 0.9, ease: "power2.out" }),
        once: true
    });

    // FAQ items (вхідна анімація)
    ScrollTrigger.batch(".faq-item", {
        scroller: scroller ? scrollerSelector : undefined,
        start: "top 85%",
        onEnter: batch => gsap.fromTo(batch, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: "power2.out" }),
        once: true
    });

    /* =======================
       Smooth scrolling (враховуємо headerHeight)
       ======================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const id = href.slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                if (scroller) {
                    // у випадку кастомного контейнера — скролимо його до offsetTop з врахуванням header
                    scroller.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' });
                } else {
                    // для нативного вікна: обчислюємо абсолютну позицію з врахуванням header
                    const top = window.pageYOffset + target.getBoundingClientRect().top - headerHeight;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    /* =======================
       Slider (автопрокрутка + visibility)
       ======================= */
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slider img');
    const btnLeft = document.querySelector('.slide-btn.left');
    const btnRight = document.querySelector('.slide-btn.right');
    let index = 0;
    let autoSlideInterval = null;

    if (slider) slider.style.transition = 'transform 0.5s ease';

    function showSlide(i) {
        if (!slider || slides.length === 0) return;
        index = (i + slides.length) % slides.length;
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    if (btnLeft) btnLeft.addEventListener('click', () => showSlide(index - 1));
    if (btnRight) btnRight.addEventListener('click', () => showSlide(index + 1));

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => showSlide(index + 1), 7000);
    }
    function stopAutoSlide() { if (autoSlideInterval) clearInterval(autoSlideInterval); autoSlideInterval = null; }

    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        startAutoSlide();
    }

    // Зупиняти автоплей коли вкладка неактивна
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopAutoSlide();
        else startAutoSlide();
    });

    showSlide(index);

    /* =======================
       Переклади (через data-translate, з fallback'ом)
       ======================= */
    const translations = {
        uk: {
            nav_about: "Про товар",
            nav_advantages: "Переваги",
            nav_gallery: "Галерея",
            nav_contact: "Контакти",
            hero_title: "Прямий підвіс для гіпсокартону",
            hero_subtitle: "Надійність. Якість. Доставка по всій Україні.",
            btn_order: "Замовити зараз",
            btn_more: "Дізнатися більше",
        },
        en: {
            nav_about: "About",
            nav_advantages: "Advantages",
            nav_gallery: "Gallery",
            nav_contact: "Contact",
            hero_title: "Straight Suspension for Drywall",
            hero_subtitle: "Reliability. Quality. Delivery all over Ukraine.",
            btn_order: "Order Now",
            btn_more: "Learn More",
        }
    };

    window.setLang = function (lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // backward-compatible fallback для hero (якщо HTML не має data-translate)
        const heroTitle = document.querySelector(".hero h2");
        const heroSubtitle = document.querySelector(".hero p");
        const heroBtns = document.querySelectorAll(".hero .btn");
        if (heroTitle && translations[lang] && translations[lang].hero_title) heroTitle.textContent = translations[lang].hero_title;
        if (heroSubtitle && translations[lang] && translations[lang].hero_subtitle) heroSubtitle.textContent = translations[lang].hero_subtitle;
        if (heroBtns[0] && translations[lang] && translations[lang].btn_order) heroBtns[0].textContent = translations[lang].btn_order;
        if (heroBtns[1] && translations[lang] && translations[lang].btn_more) heroBtns[1].textContent = translations[lang].btn_more;
    };

    /* =======================
       Кнопки скролу (сховати при швидкому скролі)
       ======================= */
    let lastScrollTop = 0;
    let hideTimeout;
    const buttons = document.querySelectorAll('.scroll-down');

    onScrollAttach(() => {
        clearTimeout(hideTimeout);
        let currentScroll = getScrollTop();
        if (Math.abs(currentScroll - lastScrollTop) > 20) {
            buttons.forEach(btn => btn.classList.add('hidden'));
        }
        hideTimeout = setTimeout(() => {
            buttons.forEach(btn => btn.classList.remove('hidden'));
        }, 1000);
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    /* =======================
       Кнопка "наверх"
       ======================= */
    const toTopBtn = document.querySelector('.to-top');
    onScrollAttach(() => {
        if (!toTopBtn) return;
        if (getScrollTop() > 300) toTopBtn.classList.add('show');
        else toTopBtn.classList.remove('show');
    });
    if (toTopBtn) {
        toTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =======================
       Бургер-меню (спрощено)
       ======================= */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    let navLinks = [];

    if (burger && nav) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.classList.toggle('menu-open'); // зручніше для CSS
            nav.classList.toggle('active');              // backward-compat
            burger.classList.toggle('active');           // backward-compat
        });

        navLinks = Array.from(document.querySelectorAll('#nav a'));
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('menu-open');
                nav.classList.remove('active');
                burger.classList.remove('active');
            });
        });

        document.addEventListener('click', (event) => {
            if (!nav.contains(event.target) && !burger.contains(event.target)) {
                document.body.classList.remove('menu-open');
                nav.classList.remove('active');
                burger.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.body.classList.remove('menu-open');
                nav.classList.remove('active');
                burger.classList.remove('active');
            }
        });
    } else {
        // якщо нав або бургер відсутні, все одно пробуємо знайти посилання для трекінгу
        navLinks = Array.from(document.querySelectorAll('#nav a'));
    }

    /* =======================
   Трекінг секцій через ScrollTrigger (підсвітка пункту меню)
   ======================= */
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const section = document.querySelector(href);
        if (!section) return;

        ScrollTrigger.create({
            trigger: section,
            scroller: scroller ? scrollerSelector : undefined,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
                navLinks.forEach(l => l.classList.remove('active-section'));
                link.classList.add('active-section');
            },
            onEnterBack: () => {
                navLinks.forEach(l => l.classList.remove('active-section'));
                link.classList.add('active-section');
            },
            onLeave: () => link.classList.remove('active-section'),
            onLeaveBack: () => link.classList.remove('active-section')
        });
    });


    /* =======================
       FAQ акордеон — GSAP анімація відкриття
       ======================= */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // Налаштування початкового стилю відповіді (тільки якщо є)
        if (answer) {
            // переконуємось, що overflow hidden для анімації
            answer.style.overflow = 'hidden';
            // якщо FAQ повинен бути закритий за замовчуванням, ставимо height 0
            if (!item.classList.contains('active')) {
                answer.style.height = '0px';
                answer.style.opacity = '0';
                answer.style.display = 'none';
            }
        }

        if (question) question.addEventListener('click', () => {
            // закриваємо інші
            faqItems.forEach(i => {
                if (i !== item) {
                    i.classList.remove('active');
                    const a = i.querySelector('.faq-answer');
                    if (a) {
                        gsap.killTweensOf(a);
                        gsap.to(a, { height: 0, opacity: 0, duration: 0.3, onComplete: () => a.style.display = 'none' });
                    }
                }
            });

            const isActive = item.classList.toggle('active');

            if (answer) {
                gsap.killTweensOf(answer);
                if (isActive) {
                    // open
                    answer.style.display = 'block';
                    const naturalHeight = answer.scrollHeight;
                    gsap.fromTo(answer, { height: 0, opacity: 0 }, { height: naturalHeight, opacity: 1, duration: 0.35, ease: "power2.out", onComplete: () => answer.style.height = 'auto' });
                } else {
                    // close
                    gsap.to(answer, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => answer.style.display = 'none' });
                }
            }
        });
    });

    /* =======================
       Refresh ScrollTrigger після load/resize (щоб врахувати зображення)
       ======================= */
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

}); // end DOMContentLoaded