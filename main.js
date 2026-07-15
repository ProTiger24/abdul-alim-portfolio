
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


    // CONTACT FORM - Formspree

    const contactForm = document.querySelector('form[action*="formspree"]');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function (e) {
            formStatus.textContent = '⏳ Sending...';
            formStatus.style.color = '#60a5fa';
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
        if (formStatus) {
            formStatus.textContent = '✅ Message sent successfully!';
            formStatus.style.color = '#34d399';
        }
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }


    // PHASE 9: FOOTER

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