// ============================================================
// TYPING ANIMATION
// ============================================================
const roles = [
    "Competitive Programmer",
    "Full-Stack Web Developer",
    "CSE Student",
    "Shopify Developer"

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

// ============================================================
// LOADING ANIMATION
// ============================================================
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hide');
    }
}

// ============================================================
// MOBILE MENU TOGGLE
// ============================================================
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (!menuBtn || !mobileMenu) return;

    const toggleMenu = (forceClose = false) => {
        const isOpen = mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== '0px';
        if (forceClose || isOpen) {
            mobileMenu.style.maxHeight = '0px';
            menuIcon.className = 'fa-solid fa-bars';
        } else {
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
            menuIcon.className = 'fa-solid fa-xmark';
        }
    };

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });

    document.addEventListener('click', (e) => {
        const nav = document.querySelector('nav');
        if (nav && !nav.contains(e.target)) {
            toggleMenu(true);
        }
    });
}

// ============================================================
// SCROLL ANIMATIONS (Fade Up, Zoom, Slide Left/Right)
// ============================================================
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll(
        '.scroll-fade-up, .scroll-zoom, .scroll-slide-left, .scroll-slide-right'
    );

    const elementInView = (el, offset = 100) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset;
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                el.classList.add('visible');
            }
        });
    };

    // Initial check
    setTimeout(handleScrollAnimation, 400);

    let scrollTimeout = false;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = true;
        requestAnimationFrame(() => {
            handleScrollAnimation();
            scrollTimeout = false;
        });
    });

    window.addEventListener('resize', handleScrollAnimation);
}

// ============================================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================================
// SWIPER CONFIGURATION
// ============================================================
function initSwiper() {
    const swiperElement = document.querySelector('.achievementSwiper');
    if (swiperElement && typeof Swiper !== 'undefined') {
        new Swiper('.achievementSwiper', {
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
}

// ============================================================
// NEW: FLOATING BACK-TO-TOP BUTTON
// ============================================================
function initBackToTop() {
    // Create button if it doesn't exist
    let btn = document.getElementById('back-to-top');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        btn.className = 'fixed bottom-8 right-8 z-50 bg-cyan-500 hover:bg-cyan-600 text-slate-900 w-12 h-12 rounded-full shadow-lg shadow-cyan-500/30 transition-all duration-300 opacity-0 pointer-events-none transform translate-y-4';
        document.body.appendChild(btn);
    }

    const toggleButton = () => {
        const scrollY = window.scrollY;
        if (scrollY > 400) {
            btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            btn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        } else {
            btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
            btn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        }
    };

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleButton);
    toggleButton(); // initial check
}

// ============================================================
// NEW: ACTIVE NAV LINK HIGHLIGHT ON SCROLL
// ============================================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 120) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-cyan-400', 'font-semibold');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('text-cyan-400', 'font-semibold');
            }
        });
    };

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    updateActiveLink(); // initial
}

// ============================================================
// NEW: SCROLL PROGRESS BAR (optional)
// ============================================================
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 z-50 transition-all duration-150';
    bar.style.width = '0%';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
    });
}

// ============================================================
// INITIALIZE ALL ON PAGE LOAD
// ============================================================
window.onload = function() {
    // Start typing effect
    typeEffect();

    // Hide loader after 2.5s
    setTimeout(hideLoader, 2500);

    // Initialize components
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initSwiper();
    initBackToTop();
    initActiveNavLink();
    initScrollProgress();

    console.log('✅ All components initialized successfully!');
};