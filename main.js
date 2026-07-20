// TYPING ANIMATION

const roles = [
    "Competitive Programmer",
    "Full-Stack Web Developer",
    "CSE Student"
];
let roleIndex = 0;
let charIndex = 0;
const typingElement = document.getElementById("typing");

function typeEffect() {
    if (charIndex < roles[roleIndex].length) {
        typingElement.textContent += roles[roleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 80);
    } else {
        setTimeout(eraseEffect, 2000);
    }
}

function eraseEffect() {
    if (charIndex > 0) {
        typingElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseEffect, 40);
    } else {
        roleIndex++;
        if (roleIndex >= roles.length) {
            roleIndex = 0;
        }
        setTimeout(typeEffect, 300);
    }
}

window.onload = function () {

    typeEffect();


    //  LOADING ANIMATION

    const loader = document.getElementById('loader');
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hide');
        }
    }, 2500);


    //  MOBILE MENU TOGGLE

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== '0px';
            if (isOpen) {
                mobileMenu.style.maxHeight = '0px';
                menuIcon.className = 'fa-solid fa-bars';
            } else {
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
                menuIcon.className = 'fa-solid fa-xmark';
            }
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.style.maxHeight = '0px';
                menuIcon.className = 'fa-solid fa-bars';
            });
        });

        document.addEventListener('click', function (e) {
            const nav = document.querySelector('nav');
            if (nav && !nav.contains(e.target)) {
                mobileMenu.style.maxHeight = '0px';
                menuIcon.className = 'fa-solid fa-bars';
            }
        });
    }


    //  SCROLL ANIMATIONS (Fade Up, Zoom, Slide Left, Slide Right)

    const scrollElements = document.querySelectorAll(
        '.scroll-fade-up, .scroll-zoom, .scroll-slide-left, .scroll-slide-right'
    );

    const elementInView = (el, offset = 0) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset
        );
    };

    const displayScrollElement = (el) => {
        el.classList.add('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            }
        });
    };

    setTimeout(handleScrollAnimation, 400);

    let scrollTimeout = false;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) return;
        scrollTimeout = true;
        requestAnimationFrame(() => {
            handleScrollAnimation();
            scrollTimeout = false;
        });
    });

    window.addEventListener('resize', handleScrollAnimation);


    // NOTE: Contact form submission is now handled entirely by the
    // Formspree AJAX library (@formspree/ajax) via data-fs-* attributes
    // and the formspree("initForm", ...) call at the bottom of index.html.
    // No custom fetch/submit code is needed here — that is what was
    // causing the page reload before (the old code looked for a
    // form[action*="formspree"] selector that never matched anything).


    // SMOOTH SCROLL FOR NAV LINKS

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // SWIPER CONFIGURATION 

    const swiperElement = document.querySelector('.achievementSwiper');
    if (swiperElement && typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.achievementSwiper', {
            loop: true,
            autoplay: {
                delay: 10000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            effect: 'slide',
            speed: 700,
            navigation: false,
        });
    }

    console.log('✅ All phases loaded successfully!');
};