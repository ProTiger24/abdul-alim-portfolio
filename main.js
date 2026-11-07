// ============================================================
// TYPING EFFECT
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
    if (!typingElement) return;

    if (charIndex < roles[roleIndex].length) {
        typingElement.textContent += roles[roleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 80);
    } else {
        setTimeout(eraseEffect, 2000);
    }
}

function eraseEffect() {
    if (!typingElement) return;

    if (charIndex > 0) {
        typingElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseEffect, 40);
    } else {
        roleIndex++;
        if (roleIndex >= roles.length) roleIndex = 0;
        setTimeout(typeEffect, 300);
    }
}

// ============================================================
// LOADER
// ============================================================

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
}

// ============================================================
// MOBILE MENU
// ============================================================

function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (!menuBtn || !mobileMenu) return;

    const toggleMenu = (forceClose = false) => {
        const isOpen = mobileMenu.style.maxHeight &&
            mobileMenu.style.maxHeight !== '0px';

        if (forceClose || isOpen) {
            mobileMenu.style.maxHeight = '0px';

            if (menuIcon) {
                menuIcon.className = 'fa-solid fa-bars';
            }

        } else {
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';

            if (menuIcon) {
                menuIcon.className = 'fa-solid fa-xmark';
            }
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
// SITE-WIDE 3D SCROLL ANIMATION (FIXED FOOTER)
// ============================================================

function initScrollAnimations() {

    const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const revealTargets = document.querySelectorAll(
        'section, footer, section > div, section .grid > *, section .swiper, .glass, .education-card, .exp-card, .train-card, .scroll-fade-up, .scroll-3d-bottom, .scroll-3d-top, .scroll-3d-left, .scroll-3d-right, .scroll-3d-zoom'
    );

    revealTargets.forEach((el, index) => {

        // FIXED: Removed 'footer' from this closest check so it shows up
        if (el.closest('#loader, nav, #chatWindow')) {
            return;
        }

        if (
            el.matches(
                '.scroll-fade-up, .scroll-3d-bottom, .scroll-3d-top, .scroll-3d-left, .scroll-3d-right, .scroll-3d-zoom'
            )
        ) {
            el.classList.add('legacy-reveal');
        }

        else if (el.matches('section')) {
            el.classList.add('reveal-3d');
        }

        else if (
            el.matches(
                '.glass, .education-card, .exp-card, .train-card'
            )
        ) {
            el.classList.add('reveal-card');
        }

        else if (
            el.matches(
                'section > div, section .grid > *, section .swiper'
            )
        ) {
            el.classList.add('reveal-content');
        }

        if (el.parentElement?.classList.contains('grid')) {
            el.style.setProperty(
                '--reveal-delay',
                `${Math.min(index % 6, 5) * 80}ms`
            );
        }
    });

    const animated = document.querySelectorAll(
        '.reveal-3d, .reveal-card, .reveal-content, .legacy-reveal'
    );

    if (
        reduceMotion ||
        !('IntersectionObserver' in window)
    ) {
        animated.forEach(el => {
            el.classList.add('is-visible', 'visible');
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        'is-visible',
                        'visible'
                    );

                    obs.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -55px 0px'
        }
    );

    animated.forEach(el => observer.observe(el));
}

// ============================================================
// INTERACTIVE 3D CARD TILT
// ============================================================

function init3DCardEffects() {

    const cards = document.querySelectorAll(
        '.education-card, .exp-card, .train-card, #projects .glass, #skills .glass, #resume .glass, #contact .glass'
    );

    const isTouch = window.matchMedia(
        '(hover: none)'
    ).matches;

    const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (isTouch || reduceMotion) {
        return;
    }

    cards.forEach(card => {

        card.classList.add('tilt-card');

        card.addEventListener('pointermove', event => {

            const rect = card.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            const rotateY = (x - 0.5) * 8;
            const rotateX = (0.5 - y) * 8;

            card.style.setProperty(
                '--tilt-x',
                `${rotateX}deg`
            );

            card.style.setProperty(
                '--tilt-y',
                `${rotateY}deg`
            );

            card.style.setProperty(
                '--mouse-x',
                `${x * 100}%`
            );

            card.style.setProperty(
                '--mouse-y',
                `${y * 100}%`
            );

        });

        card.addEventListener('pointerleave', () => {

            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');

            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');

        });

    });
}

// ============================================================
// SECTION MOUSE GLOW EFFECT
// ============================================================

function initSectionGlow() {

    document.querySelectorAll('.section-glow').forEach(section => {

        section.addEventListener('pointermove', event => {

            const rect = section.getBoundingClientRect();

            section.style.setProperty(
                '--mouse-x',
                `${event.clientX - rect.left}px`
            );

            section.style.setProperty(
                '--mouse-y',
                `${event.clientY - rect.top}px`
            );

        });

    });

}

// ============================================================
// SMOOTH SCROLL
// ============================================================

function initSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', function(e) {

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

}

// ============================================================
// SWIPER
// ============================================================

function initSwiper() {

    const swiperElement = document.querySelector('.achievementSwiper');

    if (swiperElement && typeof Swiper !== 'undefined') {

        new Swiper('.achievementSwiper', {
            loop: true,

            autoplay: {
                delay: 10000,
                disableOnInteraction: false
            },

            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },

            effect: 'slide',
            speed: 700,
            navigation: false
        });

    }

}

// ============================================================
// BACK TO TOP
// ============================================================

function initBackToTop() {

    let btn = document.getElementById('back-to-top');

    if (!btn) {

        btn = document.createElement('button');
        btn.id = 'back-to-top';

        btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';

        btn.className = 'fixed bottom-6 right-6 z-50 bg-cyan-500 hover:bg-cyan-600 text-slate-900 w-12 h-12 rounded-full shadow-lg shadow-cyan-500/30 transition-all duration-300 opacity-0 pointer-events-none transform translate-y-4';

        document.body.appendChild(btn);
    }

    const toggleButton = () => {

        if (window.scrollY > 400) {

            btn.classList.remove(
                'opacity-0',
                'pointer-events-none',
                'translate-y-4'
            );

            btn.classList.add(
                'opacity-100',
                'pointer-events-auto',
                'translate-y-0'
            );

        } else {

            btn.classList.add(
                'opacity-0',
                'pointer-events-none',
                'translate-y-4'
            );

            btn.classList.remove(
                'opacity-100',
                'pointer-events-auto',
                'translate-y-0'
            );
        }
    };

    btn.addEventListener('click', () => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    });

    window.addEventListener('scroll', toggleButton);

    toggleButton();
}

// ============================================================
// ACTIVE NAVIGATION LINK
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

            link.classList.remove(
                'text-cyan-400',
                'font-semibold'
            );

            if (link.getAttribute('href') === '#' + current) {

                link.classList.add(
                    'text-cyan-400',
                    'font-semibold'
                );
            }

        });

    };

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

    updateActiveLink();
}

// ============================================================
// SCROLL PROGRESS
// ============================================================

function initScrollProgress() {

    const bar = document.createElement('div');

    bar.id = 'scroll-progress';

    bar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 z-50 transition-all duration-150';

    bar.style.width = '0%';

    document.body.prepend(bar);

    window.addEventListener('scroll', () => {

        const scrollTop = window.scrollY;

        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = docHeight > 0
            ? (scrollTop / docHeight) * 100
            : 0;

        bar.style.width = progress + '%';

    });

}

// ============================================================
// CHATBOT FAQ DATA
// ============================================================

const faqData = [

    {
        keywords: [
            'who is abdul alim', 'who is abdul', 'who are you', 'who is this',
            'tell me about abdul', 'introduce abdul', 'introduce yourself',
            'can you introduce abdul', 'about abdul', 'abdul alim details',
            'who is this portfolio', 'tell me about yourself',
            'কে তুমি', 'আপনি কে', 'নাম', 'পরিচয়', 'আমার সম্পর্কে'
        ],
        answer: "আমি আব্দুল আলিম। আমি বাংলাদেশ ইউনিভার্সিটি অফ বিজনেস অ্যান্ড টেকনোলজি (BUBT)-এ কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগে ৪র্থ বর্ষের শিক্ষার্থী। আমি একজন কম্পিটিটিভ প্রোগ্রামার (Codeforces 1683), ফুল-স্ট্যাক ও ব্যাকএন্ড ডেভেলপার, এবং স্কেলেবল সফটওয়্যার সিস্টেম তৈরিতে আগ্রহী।"
    },

    {
        keywords: [
            'what does abdul do', 'what can abdul do', 'what do you do',
            'what are your skills', 'what technologies do you know',
            'what projects have you built', 'what is your specialization',
            'what do you specialize in', 'what can you build',
            'what kind of developer are you', 'what is your expertise',
            'what are you good at', 'what skills do you have',
            'what do you know', 'what is your tech stack',
            'স্কিল', 'দক্ষতা', 'প্রযুক্তি', 'টেকনোলজি', 'কাজ', 'কি করতে পারেন'
        ],
        answer: "আমার দক্ষতা: C++, Java, Python, HTML5, CSS3, JavaScript, PHP, MySQL, MongoDB, Tailwind CSS, Bootstrap, Spring Boot, Laravel, Node.js, Flutter, Firebase, Git/GitHub, Linux (Ubuntu)। আমি কম্পিটিটিভ প্রোগ্রামিং, ডেটা স্ট্রাকচার ও অ্যালগরিদম, এবং AI-পাওয়ার্ড অ্যাপ্লিকেশনেও বিশেষজ্ঞ।"
    },

    {
        keywords: [
            'experience', 'internship', 'work experience', 'job',
            'অভিজ্ঞতা', 'ইন্টার্ন', 'কাজের অভিজ্ঞতা', 'চাকরি'
        ],
        answer: "আমার পেশাগত অভিজ্ঞতা:\n🔹 Project-Based Backend Developer (Remote, ২০২৩-বর্তমান) – Java Spring Boot ও PHP Laravel।\n🔹 CodeAlpha – সফটওয়্যার ইঞ্জিনিয়ার ইন্টার্ন (Successfully Completed)।\n🔹 EcomFixR – শপিফাই ডেভেলপার ইন্টার্ন (Successfully Completed)।"
    },

    {
        keywords: [
            'education', 'study', 'university', 'college', 'school',
            'academic background', 'degree', 'what are you studying',
            'bsc', 'hsc', 'ssc',
            'শিক্ষা', 'পড়া', 'পড়াশোনা', 'বিশ্ববিদ্যালয়', 'কলেজ', 'মাদ্রাসা'
        ],
        answer: "আমার শিক্ষা:\n🎓 B.Sc. in CSE – BUBT (২০২৩-বর্তমান, ৪র্থ বর্ষ চলমান)।\n🎓 HSC – জশোর সরকারি এমএম কলেজ (২০২১, বিজ্ঞান)।\n🎓 SSC – আলমডাঙ্গা সিদ্দিকিয়া আলিম মাদ্রাসা (২০১৯, বিজ্ঞান)।"
    },

    {
        keywords: [
            'competitive programming', 'codeforces', 'codechef', 'leetcode',
            'how many problems', 'problem solving', 'dsa', 'algorithm',
            'data structures', 'programming contest', 'icpc', 'atcoder', 'vjudge', 'cses',
            'rating', 'solved',
            'কম্পিটিটিভ', 'প্রোগ্রামিং', 'কোডফোর্সেস', 'কোডশেফ', 'রেটিং', 'সমস্যা'
        ],
        answer: "কম্পিটিটিভ প্রোগ্রামিং প্রোফাইল:\n🏅 Codeforces – ১৬৮৩ রেটিং (স্পেশালিস্ট)।\n🏅 CodeChef – ১৬৫০+ গ্লোবাল রেটিং (৩ স্টার)।\n🏅 LeetCode – ২০+ সমস্যা সমাধান।\n🏅 vJudge – ৭০+ সমস্যা ও ম্যারাথনে অংশগ্রহণ।\n🏅 CSES – ডেটা স্ট্রাকচার ও অ্যালগরিদম প্র্যাকটিস।\n🏅 AtCoder – নিয়মিত কন্টেস্টে অংশগ্রহণ।"
    },

    {
        keywords: [
            'achievement', 'achievements', 'awards', 'icpc', 'codechef',
            'buet robotics', 'contest', 'winner', 'certificate', 'recognitions',
            'achieved', 'won', 'participated',
            'অ্যাচিভমেন্ট', 'পুরস্কার', 'আইসিপিসি', 'বুয়েট', 'রোবোটিক্স', 'সার্টিফিকেট'
        ],
        answer: "আমার অ্যাচিভমেন্ট:\n🏆 আইসিপিসি এশিয়া ঢাকা রিজিওনাল প্রিলিমিনারি (২০২৩)।\n🤖 BUET রোবোটিক্স কার্নিভাল (২০২৬)।\n📊 CodeChef DSA রেটিং ১৫১০ – গ্লোবাল র্যাঙ্ক ১৭২৬।\n📧 CodeAlpha-তে সফটওয়্যার ইঞ্জিনিয়ার ইন্টার্নশিপ অফার লেটার প্রাপ্তি।"
    },

    {
        keywords: [
            'kormoshathi', 'kormo shathi', 'hr management system', 'employee management'
        ],
        answer: "🧑‍💼 KormoShathi একটি সম্পূর্ণ PHP-ভিত্তিক HR ম্যানেজমেন্ট সিস্টেম। এতে AI-ভিত্তিক রিজিউমি স্ক্রিনিং, ডাইনামিক মেসেজিং সিস্টেম এবং অ্যাডমিন প্যানেল থেকে এক ক্লিকে সকল কর্মচারীর বেতন বা Salary প্রসেস করার সুবিধা রয়েছে। লাইভ: https://hr-sysytem.onrender.com/index.php"
    },

    {
        keywords: [
            'hotelreserve', 'hotel reservation', 'hotel management', 'hospitality', 'travel management'
        ],
        answer: "🏨 HotelReserve হলো একটি সম্পূর্ণ হসপিটালিটি ও ট্রাভেল ম্যানেজমেন্ট সিস্টেম। এতে রুম/ভেহিকেল/ড্রাইভার বুকিং, ট্রাভেল প্যাকেজ, bKash পেমেন্ট, JWT অথেন্টিকেশন, Google OAuth এবং Chart.js-ভিত্তিক রিয়েল-টাইম অ্যাডমিন ড্যাশবোর্ড রয়েছে। লাইভ: https://hotel-reservation-system-frontend-khaki.vercel.app/"
    },

    {
        keywords: [
            'robotic car', 'smart car', 'autonomous car', 'iot project', 'robotics', 'arduino', 'voice controlled'
        ],
        answer: "🤖 Smart Autonomous & Voice-Controlled Robotic Car হলো Arduino-ভিত্তিক একটি ফোর-হুইল রোবোটিক কার, যাতে স্বয়ংক্রিয় বাধা সনাক্তকরণ (obstacle detection), Bluetooth মোবাইল ভয়েস কন্ট্রোল, এবং GPS রিয়েল-টাইম ট্র্যাকিং রয়েছে। এটি Autonomous Mode এবং Voice Control Mode-এ চলতে পারে।"
    },

    {
        keywords: [
            'englishmaster', 'english master', 'ielts'
        ],
        answer: "📚 EnglishMaster একটি চলমান প্রকল্প (IELTS প্রস্তুতি), যা HTML, CSS, Bootstrap, JavaScript, Java Spring Boot, Gemini API এবং Firebase দিয়ে তৈরি হচ্ছে। গিটহাবে কোডটি পাওয়া যাচ্ছে: https://github.com/ProTiger24/EnglishMaster.git"
    },

    {
        keywords: [
            'careerverse', 'career verse'
        ],
        answer: "🚀 CareerVerse একটি AI-পাওয়ার্ড ক্যারিয়ার গ্রোথ প্ল্যাটফর্ম। টেক স্ট্যাক: React, Tailwind, Firebase, FastAPI, Python, Gemini AI। লাইভ: https://career-verse-three.vercel.app"
    },

    {
        keywords: [
            'projects', 'all projects', 'project list',
            'প্রজেক্টের তালিকা', 'প্রজেক্টগুলো', 'কোন প্রজেক্ট'
        ],
        answer: "আমার সব প্রজেক্ট:\n1. 🧑‍💼 KormoShathi – HR সিস্টেম\n2. 🎬 CineGhor – মুভি টিকেট অ্যাপ\n3. 🏨 HotelReserve – হসপিটালিটি ম্যানেজমেন্ট\n4. 🤖 Smart Autonomous Robotic Car – IoT/রোবোটিক্স\n5. 📚 EnglishMaster – IELTS প্রস্তুতি (চলমান)\n6. 🚀 CareerVerse – AI ক্যারিয়ার প্ল্যাটফর্ম\n\nবিস্তারিত জানতে নির্দিষ্ট প্রজেক্টের নাম লিখে জিজ্ঞাসা করুন।"
    },

    {
        keywords: [
            'resume', 'cv', 'download resume', 'view resume', 'biodata',
            'সিভি', 'রিজিউমি', 'ডাউনলোড'
        ],
        answer: "আপনি আমার রিজিউমি ডাউনলোড করতে পারেন 'Resume' সেকশন থেকে অথবা এই লিংকে ক্লিক করে: [ডাউনলোড রিজিউমি](img/Alim_s_resume%20(12).pdf)"
    },

    {
        keywords: [
            'contact', 'email', 'linkedin', 'github', 'reach',
            'how to reach', 'get in touch', 'message abdul',
            'যোগাযোগ', 'ইমেইল', 'ফোন', 'লিংকডইন', 'গিটহাব', 'whatsapp'
        ],
        answer: "আমার সাথে যোগাযোগ:\n📧 ইমেইল: abdulalim528260@gmail.com\n📞 ফোন/হোয়াটসঅ্যাপ: +880 1957123090\n🔗 LinkedIn: linkedin.com/in/abdul-alim-5452a12b1\n🐙 GitHub: github.com/ProTiger24"
    },

    {
        keywords: [
            'hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening',
            'হ্যালো', 'হাই', 'আসসালামু আলাইকুম', 'নমস্কার', 'শুভ সকাল', 'শুভ সন্ধ্যা'
        ],
        answer: "আসসালামু আলাইকুম! 👋 আমি আব্দুল আলিমের ভার্চুয়াল অ্যাসিস্ট্যান্ট। আপনি আমাকে যেকোনো প্রশ্ন করতে পারেন—যেমন: 'স্কিল', 'প্রজেক্ট', 'HotelReserve', 'Robotic Car', 'অভিজ্ঞতা', 'শিক্ষা', 'অ্যাচিভমেন্ট', বা 'যোগাযোগ'।"
    }

];

// ============================================================
// CHATBOT ANSWER
// ============================================================

function getAnswer(userMessage) {

    const lowerMsg = userMessage.toLowerCase();

    for (const item of faqData) {

        for (const keyword of item.keywords) {

            if (lowerMsg.includes(keyword.toLowerCase())) {
                return item.answer;
            }

        }

    }

    return 'দুঃখিত, আমি এই প্রশ্নের উত্তর দিতে পারছি না। আপনি "স্কিল", "প্রজেক্ট", "HotelReserve", "Robotic Car", "অভিজ্ঞতা", "শিক্ষা", "অ্যাচিভমেন্ট" বা "যোগাযোগ" লিখে চেষ্টা করুন।';
}

// ============================================================
// CHATBOT INITIALIZATION
// ============================================================

function initChatbot() {

    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    const whatsappBtn = document.getElementById('whatsapp-float');

    if (!chatToggle || !chatWindow) return;

    // চ্যাটবক্স খোলা থাকলে WhatsApp বাটন লুকাবে, বন্ধ থাকলে দেখাবে
    function syncWhatsApp() {
        if (!whatsappBtn) return;

        const isChatOpen = !chatWindow.classList.contains('hidden');
        whatsappBtn.classList.toggle('wa-hidden', isChatOpen);
    }

    function openChat() {
        chatWindow.classList.remove('hidden');
        syncWhatsApp();
    }

    function closeChat() {
        chatWindow.classList.add('hidden');
        syncWhatsApp();
    }

    function toggleChat() {
        chatWindow.classList.toggle('hidden');
        syncWhatsApp();
    }

    // পেজ লোডের সময়ও একবার সিঙ্ক করে নিচ্ছি
    syncWhatsApp();

    chatToggle.addEventListener('click', toggleChat);

    if (chatClose) {
        chatClose.addEventListener('click', closeChat);
    }

    function sendMessage() {

        if (!chatInput || !chatSend || !chatMessages) return;

        const message = chatInput.value.trim();

        if (!message) return;

        const userDiv = document.createElement('div');

        userDiv.className = 'flex items-start gap-2 justify-end';

        userDiv.innerHTML = `
            <div class="bg-cyan-500/20 text-cyan-100 rounded-2xl rounded-tr-none px-4 py-2 max-w-[85%] border border-cyan-500/20">
                ${message}
            </div>
        `;

        chatMessages.appendChild(userDiv);

        chatInput.value = '';

        chatSend.disabled = true;
        chatSend.textContent = '...';

        chatMessages.scrollTop = chatMessages.scrollHeight;

        const typingDiv = document.createElement('div');

        typingDiv.className = 'flex items-start gap-2';

        typingDiv.innerHTML = `
            <div class="bg-[#1e293b] text-gray-200 rounded-2xl rounded-tl-none px-4 py-2 border border-gray-700/50">
                <span class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
        `;

        chatMessages.appendChild(typingDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {

            typingDiv.remove();

            const reply = getAnswer(message);

            const botDiv = document.createElement('div');

            botDiv.className = 'flex items-start gap-2';

            botDiv.innerHTML = `
                <div class="bg-[#1e293b] text-gray-200 rounded-2xl rounded-tl-none px-4 py-2 max-w-[85%] border border-gray-700/50 whitespace-pre-line">
                    ${reply}
                </div>
            `;

            chatMessages.appendChild(botDiv);

            chatSend.disabled = false;
            chatSend.textContent = 'Send';

            chatMessages.scrollTop = chatMessages.scrollHeight;

        }, 400);

    }

    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // চ্যাটবক্সের বাইরে ক্লিক করলে বন্ধ হবে (এবং WhatsApp ফিরে আসবে)
    document.addEventListener('click', (e) => {

        if (!chatWindow.classList.contains('hidden')) {

            const isClickInside =
                chatWindow.contains(e.target) ||
                chatToggle.contains(e.target);

            if (!isClickInside) {
                closeChat();
            }
        }

    });

}

// ============================================================
// INITIALIZE ALL FUNCTIONS AFTER PAGE LOAD
// ============================================================

window.addEventListener('load', function() {

    // Typing animation
    typeEffect();

    // Hide loader
    setTimeout(hideLoader, 2500);

    // Mobile navigation
    initMobileMenu();

    // Scroll animation (Now footer will be visible)
    initScrollAnimations();

    // New 3D effects
    init3DCardEffects();
    initSectionGlow();

    // Existing functionality
    initSmoothScroll();
    initSwiper();
    initBackToTop();
    initActiveNavLink();
    initScrollProgress();
    initChatbot();

});