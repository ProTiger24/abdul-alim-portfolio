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
// FLOATING BACK-TO-TOP BUTTON (UPDATED: bottom-8 → bottom-6)
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
    toggleButton();
}

// ============================================================
// ACTIVE NAV LINK HIGHLIGHT ON SCROLL
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
// SCROLL PROGRESS BAR
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
// FAQ ডেটাবেস (প্রশ্ন-উত্তর) – সম্পূর্ণ আপডেটেড
// ============================================================
const faqData = [
    // ============================================================
    // 1. WHO – পরিচয় সম্পর্কিত (বিস্তারিত কীওয়ার্ড)
    // ============================================================
    {
        keywords: [
            'who is abdul alim', 'who is abdul', 'who are you', 'who is this',
            'tell me about abdul', 'introduce abdul', 'introduce yourself',
            'can you introduce abdul', 'about abdul', 'abdul alim details',
            'who is this portfolio', 'tell me about yourself',
            // বাংলা
            'কে তুমি', 'আপনি কে', 'নাম', 'পরিচয়', 'আমার সম্পর্কে'
        ],
        answer: "আমি আব্দুল আলিম। আমি বাংলাদেশ ইউনিভার্সিটি অফ বিজনেস অ্যান্ড টেকনোলজি (BUBT)-এ কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগে ৪র্থ বর্ষের শিক্ষার্থী। আমি একজন কম্পিটিটিভ প্রোগ্রামার (Codeforces 1600+), ফুল-স্ট্যাক ও ব্যাকএন্ড ডেভেলপার, এবং স্কেলেবল সফটওয়্যার সিস্টেম তৈরিতে আগ্রহী।"
    },

    // ============================================================
    // 2. WHAT – দক্ষতা, কাজ, প্রজেক্ট ইত্যাদি
    // ============================================================
    {
        keywords: [
            'what does abdul do', 'what can abdul do', 'what do you do',
            'what are your skills', 'what technologies do you know',
            'what projects have you built', 'what is your specialization',
            'what do you specialize in', 'what can you build',
            'what kind of developer are you', 'what is your expertise',
            'what are you good at', 'what skills do you have',
            'what do you know', 'what is your tech stack',
            // বাংলা
            'স্কিল', 'দক্ষতা', 'প্রযুক্তি', 'টেকনোলজি', 'কাজ', 'কি করতে পারেন'
        ],
        answer: "আমার দক্ষতা: C++, Java, Python, HTML5, CSS3, JavaScript, PHP, MySQL, MongoDB, Tailwind CSS, Bootstrap, Spring Boot, Laravel, Node.js, Flutter, Firebase, Git/GitHub, Linux (Ubuntu)। আমি কম্পিটিটিভ প্রোগ্রামিং, ডেটা স্ট্রাকচার ও অ্যালগরিদম, এবং AI-পাওয়ার্ড অ্যাপ্লিকেশনেও বিশেষজ্ঞ।"
    },

    // ============================================================
    // 3. WHICH – কোন প্রযুক্তি/কোন প্রজেক্ট
    // ============================================================
    {
        keywords: [
            'which language', 'which programming language', 'which framework',
            'which backend', 'which database', 'which project is your best',
            'which project is most important', 'which tech do you prefer',
            'which technology are you strongest in', 'which project uses ai',
            'which platform', 'which tools',
            // বাংলা
            'কোন ল্যাঙ্গুয়েজ', 'কোন ফ্রেমওয়ার্ক', 'কোন ডেটাবেস', 'কোন প্রজেক্ট'
        ],
        answer: "আমি প্রধানত Java, Spring Boot, PHP, Laravel, এবং JavaScript নিয়ে কাজ করি। আমার প্রজেক্টগুলোর মধ্যে KormoShathi (AI-ভিত্তিক রিজিউমি স্ক্রিনিং সহ ফুল-স্ট্যাক HR সিস্টেম) সবচেয়ে উল্লেখযোগ্য, কারণ এটি ব্যাকএন্ড ও AI-এর সমন্বয়।"
    },

    // ============================================================
    // 4. WHEN – সময় সম্পর্কিত
    // ============================================================
    {
        keywords: [
            'when did you start', 'when did you join', 'when did you graduate',
            'when did you participate in icpc', 'when did you start programming',
            'when was your internship', 'when did you join bubt',
            'when did you start competitive programming', 'when did you learn',
            'when did you begin', 'when did you complete',
            // বাংলা
            'কখন শুরু', 'কখন যোগ দিয়েছেন', 'কখন অংশগ্রহণ', 'কখন শেষ'
        ],
        answer: "আমি ২০২৩ সালে BUBT-তে CSE পড়া শুরু করি। প্রোগ্রামিং ও কম্পিটিটিভ কোডিং শুরু করি বিশ্ববিদ্যালয়ের প্রথম দিকে। ২০২৩ সালে ICPC Asia Dhaka Regional Preliminary Contest-এ অংশগ্রহণ করি। ২০২৬ সালে CodeAlpha-তে ইন্টার্নশিপ সম্পন্ন করি এবং বর্তমানে EcomFixR-এ Shopify Developer Intern হিসেবে কাজ করছি।"
    },

    // ============================================================
    // 5. WHERE – স্থান সম্পর্কিত
    // ============================================================
    {
        keywords: [
            'where do you study', 'where are you studying', 'where did you work',
            'where did you intern', 'where is bubt', 'where can i find your github',
            'where can i find your linkedin', 'where are you based',
            'where are you from', 'where is your university',
            // বাংলা
            'কোথায় পড়েন', 'কোথায় কাজ করেন', 'কোথায় ইন্টার্ন করেছেন', 'কোথায় BUBT'
        ],
        answer: "আমি বাংলাদেশ ইউনিভার্সিটি অফ বিজনেস অ্যান্ড টেকনোলজি (BUBT)-তে পড়ি, যা মিরপুর-২, ঢাকায় অবস্থিত। আমার GitHub ও LinkedIn প্রোফাইল এই পোর্টফোলিওতে লিংক দেওয়া আছে।"
    },

    // ============================================================
    // 6. WHY – কেন (হায়ারিং ও ক্যারিয়ার সম্পর্কিত)
    // ============================================================
    {
        keywords: [
            'why should i hire you', 'why hire abdul', 'why should we hire you',
            'why are you a good candidate', 'why should we choose you',
            'why backend', 'why software engineering', 'why choose abdul',
            'what makes you different', 'what makes abdul unique',
            'why should we work with you', 'why do you like programming',
            // বাংলা
            'কেন নিয়োগ দেবেন', 'কেন হির', 'কেন আপনার প্রার্থী', 'কেন বেছে নেবেন'
        ],
        answer: "আমি শক্তিশালী অ্যালগরিদমিক সমস্যা সমাধানের দক্ষতা (১০০০+ সমস্যা সমাধান, Codeforces ১৬০০+) এবং বাস্তব প্রজেক্ট ও ইন্টার্নশিপের মাধ্যমে প্র্যাকটিক্যাল সফটওয়্যার ডেভেলপমেন্ট অভিজ্ঞতা একত্রিত করি। আমি দ্রুত শিখি, ব্যাকএন্ড ইঞ্জিনিয়ারিংয়ে আগ্রহী, এবং ক্লিন, মেইনটেইনেবল কোড ডেলিভার করার প্রমাণিত ট্র্যাক রেকর্ড আছে। তত্ত্ব (কম্পিটিটিভ প্রোগ্রামিং) এবং প্রয়োগ (ফুল-স্ট্যাক ডেভেলপমেন্ট)-এর মধ্যে সেতুবন্ধন তৈরি করার ক্ষমতা আমাকে একজন বহুমুখী ও মূল্যবান প্রার্থী করে তোলে।"
    },

    // ============================================================
    // 7. HOW – কীভাবে কাজ করেন / যোগাযোগ
    // ============================================================
    {
        keywords: [
            'how do you solve problems', 'how do you learn', 'how do you build projects',
            'how do you approach development', 'how experienced are you',
            'how can i contact you', 'how do you work', 'how do you develop',
            'how can i reach you', 'how to contact',
            // বাংলা
            'কীভাবে কাজ করেন', 'কীভাবে শিখেন', 'কীভাবে যোগাযোগ করবেন'
        ],
        answer: "আমি ডেভেলপমেন্টের জন্য একটি কাঠামোবদ্ধ প্রক্রিয়া অনুসরণ করি: প্রয়োজনীয়তা বোঝা → আর্কিটেকচার ডিজাইন → ক্লিন কোডে ইমপ্লিমেন্ট করা → পুঙ্খানুপুঙ্খভাবে টেস্ট করা → রিভিউ ও রিফ্যাক্টর। আমি কম্পিটিটিভ প্রোগ্রামিং প্র্যাকটিস, টেকনিক্যাল ডকুমেন্টেশন পড়া, এবং সাইড প্রজেক্ট বানানোর মাধ্যমে দক্ষতা উন্নত করি। আপনি এই পেজের কন্ট্যাক্ট ফর্ম বা ইমেইল/লিংকডইনের মাধ্যমে আমার সাথে যোগাযোগ করতে পারেন।"
    },

    // ============================================================
    // 8. EXPERIENCE – পেশাগত অভিজ্ঞতা
    // ============================================================
    {
        keywords: [
            'tell me about your experience', 'what is your experience',
            'do you have internship experience', 'have you worked before',
            'do you have professional experience', 'work experience',
            'where did you work as an intern', 'internship details',
            'professional background',
            // বাংলা
            'অভিজ্ঞতা', 'ইন্টার্ন', 'কাজের অভিজ্ঞতা', 'চাকরি'
        ],
        answer: "আমার পেশাগত অভিজ্ঞতা:\n🔹 CodeAlpha – সফটওয়্যার ইঞ্জিনিয়ার ইন্টার্ন (জাভা, স্প্রিং বুট, REST API)।\n🔹 EcomFixR – শপিফাই ডেভেলপার ইন্টার্ন (HTML, CSS, JS, Liquid), অবস্থান: মিরপুর DOHS, ঢাকা।"
    },

    // ============================================================
    // 9. TRAINING – প্রশিক্ষণ
    // ============================================================
    {
        keywords: [
            'training', 'certification', 'courses', 'learned',
            'web design training', 'competitive programming training',
            'cps academy', 'jashore it',
            // বাংলা
            'ট্রেইনিং', 'কোর্স', 'সার্টিফিকেট', 'শিখা', 'শেখা'
        ],
        answer: "আমার প্রশিক্ষণ:\n📘 ওয়েব ডিজাইন ও ডেভেলপমেন্ট – জশোর আইটি (২০২১)।\n📘 কম্পিটিটিভ প্রোগ্রামিং – CPS অ্যাকাডেমি (২০২৪-২০২৬), যেখানে অ্যালগরিদম, ডেটা স্ট্রাকচার, এবং কোডফোর্সেস/কোডশেফ/লিটকোডে সমস্যা সমাধান শিখেছি।"
    },

    // ============================================================
    // 10. EDUCATION – শিক্ষাগত যোগ্যতা
    // ============================================================
    {
        keywords: [
            'education', 'study', 'university', 'college', 'school',
            'academic background', 'degree', 'what are you studying',
            'bsc', 'hsc', 'ssc',
            // বাংলা
            'শিক্ষা', 'পড়া', 'পড়াশোনা', 'বিশ্ববিদ্যালয়', 'কলেজ', 'মাদ্রাসা'
        ],
        answer: "আমার শিক্ষা:\n🎓 B.Sc. in CSE – BUBT (২০২৩-বর্তমান, ৪র্থ বর্ষ চলমান)।\n🎓 HSC – জশোর সরকারি এমএম কলেজ (২০২১, বিজ্ঞান)।\n🎓 SSC – আলমডাঙ্গা সিদ্দিকিয়া আলিম মাদ্রাসা (২০১৯, বিজ্ঞান)।"
    },

    // ============================================================
    // 11. COMPETITIVE PROGRAMMING
    // ============================================================
    {
        keywords: [
            'competitive programming', 'codeforces', 'codechef', 'leetcode',
            'how many problems', 'problem solving', 'dsa', 'algorithm',
            'data structures', 'programming contest', 'icpc', 'atcoder', 'vjudge', 'cses',
            'rating', 'solved',
            // বাংলা
            'কম্পিটিটিভ', 'প্রোগ্রামিং', 'কোডফোর্সেস', 'কোডশেফ', 'রেটিং', 'সমস্যা'
        ],
        answer: "কম্পিটিটিভ প্রোগ্রামিং প্রোফাইল:\n🏅 Codeforces – 1600+ রেটিং (স্পেশালিস্ট)।\n🏅 CodeChef – 1650+ গ্লোবাল রেটিং (৩ স্টার)।\n🏅 LeetCode – ২০+ সমস্যা সমাধান (রেটিং ১৪৮০)।\n🏅 vJudge – ৭০+ সমস্যা ও ম্যারাথনে অংশগ্রহণ।\n🏅 CSES – ডেটা স্ট্রাকচার ও অ্যালগরিদম প্র্যাকটিস।\n🏅 AtCoder – নিয়মিত কন্টেস্টে অংশগ্রহণ।"
    },

    // ============================================================
    // 12. ACHIEVEMENTS – অর্জন
    // ============================================================
    {
        keywords: [
            'achievement', 'achievements', 'awards', 'icpc', 'codechef',
            'buet robotics', 'contest', 'winner', 'certificate', 'recognitions',
            'achieved', 'won', 'participated',
            // বাংলা
            'অ্যাচিভমেন্ট', 'পুরস্কার', 'আইসিপিসি', 'বুয়েট', 'রোবোটিক্স', 'সার্টিফিকেট'
        ],
        answer: "আমার অ্যাচিভমেন্ট:\n🏆 আইসিপিসি এশিয়া ঢাকা রিজিওনাল প্রিলিমিনারি (২০২৩) – BUBT-এর প্রতিনিধি হিসেবে অংশগ্রহণ।\n🤖 BUET রোবোটিক্স কার্নিভাল (২০২৬) – আন্তঃবিশ্ববিদ্যালয় রোবোটিক্স প্রতিযোগিতায় অংশগ্রহণ।\n📊 CodeChef DSA রেটিং ১৫১০ – গ্লোবাল র্যাঙ্ক ১৭২৬।\n📧 CodeAlpha-তে সফটওয়্যার ইঞ্জিনিয়ার ইন্টার্নশিপ অফার লেটার প্রাপ্তি।"
    },

    // ============================================================
    // 13. PROJECT-SPECIFIC (KormoShathi)
    // ============================================================
    {
        keywords: [
            'tell me about kormoshathi', 'what is kormoshathi', 'kormoshathi',
            'hr management system', 'employee management', 'kormo shathi',
            'kormoshathi project', 'kormoshathi details', 'kormoshathi features'
        ],
        answer: "🧑‍💼 KormoShathi একটি সম্পূর্ণ PHP-ভিত্তিক HR ম্যানেজমেন্ট সিস্টেম, যা কর্মীদের পরিচালনা, উপস্থিতি, বেতন, ছুটি, নিয়োগ, এবং পারফরম্যান্স ট্র্যাকিং করে। এতে Groq AI (Llama 3.3) ব্যবহার করে AI-ভিত্তিক রিজিউমি স্ক্রিনিং, ইমেইল নোটিফিকেশন (Brevo API), এবং ডকুমেন্ট স্টোরেজ (Cloudinary) রয়েছে। লাইভ: https://hr-sysytem.onrender.com/index.php, রিপো: https://github.com/ProTiger24/KormoShathi.git"
    },

    // ============================================================
    // 14. PROJECT-SPECIFIC (CineGhor)
    // ============================================================
    {
        keywords: [
            'tell me about cineghor', 'what is cineghor', 'cineghor',
            'movie booking project', 'movie ticket app', 'flutter project',
            'cineghor details', 'cineghor project'
        ],
        answer: "🎬 CINEGHOR হলো Flutter ও Firebase-এ তৈরি একটি মুভি টিকেট বুকিং অ্যাপ। এতে ডাইনামিক মুভি ক্যাটালগ, সিট বুকিং, QR কোড টিকেট, bKash টেস্ট API পেমেন্ট, এবং অ্যাডমিন ড্যাশবোর্ড রয়েছে। রিপো: https://github.com/ProTiger24/cineghor.git, ডেমো ভিডিও: https://drive.google.com/file/d/1H67PiLj24p4UJaEOUNwbg5Ej0XX0ZcxV/view"
    },

    // ============================================================
    // 15. PROJECT-SPECIFIC (AI Chatbot – CodeAlpha)
    // ============================================================
    {
        keywords: [
            'tell me about ai chatbot', 'what is ai chatbot', 'ai chatbot',
            'codealpha chatbot', 'chatbot project', 'groq chatbot',
            'ai chatbot details'
        ],
        answer: "🤖 AI Chatbot হলো CodeAlpha ইন্টার্নশিপের অংশ হিসেবে তৈরি একটি স্মার্ট চ্যাটবট, যা Groq API (LLaMA 3.3) ব্যবহার করে রিয়েল-টাইম AI উত্তর দেয়। ব্যাকএন্ড Java 21 + Spark Framework, ফ্রন্টএন্ড HTML/CSS/JS। লাইভ: https://codealpha-tasks-695u.onrender.com/, রিপো: https://github.com/ProTiger24/codeAlpha_tasks.git"
    },

    // ============================================================
    // 16. PROJECT-SPECIFIC (EnglishMaster – Ongoing)
    // ============================================================
    {
        keywords: [
            'tell me about englishmaster', 'what is englishmaster', 'englishmaster',
            'english master', 'englishmaster project'
        ],
        answer: "📚 EnglishMaster একটি চলমান প্রকল্প, যা ইংরেজি শিক্ষার জন্য ইন্টারঅ্যাকটিভ টুল তৈরি করবে। টেক স্ট্যাক: HTML, CSS, Bootstrap, JavaScript, Java Spring Boot, Gemini API, Firebase। স্থিতি: ডেভেলপমেন্ট চলমান।"
    },

    // ============================================================
    // 17. PROJECT-SPECIFIC (Careerverse – Ongoing)
    // ============================================================
    {
        keywords: [
            'tell me about careerverse', 'what is careerverse', 'careerverse',
            'career verse', 'careerverse project'
        ],
        answer: "🚀 Careerverse একটি চলমান প্রকল্প, যা ক্যারিয়ার গাইডেন্স ও চাকরি সংক্রান্ত সেবা প্রদান করবে। টেক স্ট্যাক: HTML, CSS, JavaScript, React, Firebase। স্থিতি: ডেভেলপমেন্ট চলমান।"
    },

    // ============================================================
    // 18. PROJECTS LIST (সাধারণ) – আপডেটেড কীওয়ার্ড
    // ============================================================
    {
        keywords: [
            // ইংরেজি (বিস্তারিত)
            'what projects have you built', 'what projects have you done',
            'tell me about your projects', 'projects list',
            'all projects', 'project overview', 'your projects',
            'which projects', 'which project', 'project names',
            'list of projects', 'projects done', 'done projects',
            'completed projects', 'what are your projects',
            'show me your projects', 'project list',
            // বাংলা
            'প্রজেক্টের তালিকা', 'প্রজেক্টগুলো', 'কোন প্রজেক্ট', 'প্রজেক্টের নাম',
            'কী প্রজেক্ট', 'প্রজেক্ট দেখাও'
        ],
        answer: "আমার সব প্রজেক্ট:\n1. 🧑‍💼 KormoShathi – HR সিস্টেম (PHP, MySQL, Groq AI)\n   লাইভ: https://hr-sysytem.onrender.com/index.php\n2. 🎬 CineGhor – মুভি টিকেট অ্যাপ (Flutter, Firebase)\n   ডেমো: https://drive.google.com/file/d/1H67PiLj24p4UJaEOUNwbg5Ej0XX0ZcxV/view\n3. 🤖 AI Chatbot – AI চ্যাটবট (Java, Spark, Groq API)\n   লাইভ: https://codealpha-tasks-695u.onrender.com/\n4. 📚 EnglishMaster – ইংরেজি শিক্ষা (চলমান)\n5. 🚀 Careerverse – ক্যারিয়ার গাইড (চলমান)\n\nবিস্তারিত জানতে নির্দিষ্ট প্রজেক্টের নাম লিখে জিজ্ঞাসা করুন (যেমন: 'KormoShathi')।"
    },

    // ============================================================
    // 19. RESUME / CV
    // ============================================================
    {
        keywords: [
            'resume', 'cv', 'download resume', 'view resume', 'biodata',
            'সিভি', 'রিজিউমি', 'ডাউনলোড'
        ],
        answer: "আপনি আমার রিজিউমি ডাউনলোড করতে পারেন 'Resume' সেকশন থেকে অথবা এই লিংকে ক্লিক করে: [ডাউনলোড রিজিউমি](img/Alim_s_resume%20(8).pdf)"
    },

    // ============================================================
    // 20. CONTACT – যোগাযোগ
    // ============================================================
    {
        keywords: [
            'contact', 'email', 'linkedin', 'github', 'reach',
            'how to reach', 'get in touch', 'message abdul',
            'যোগাযোগ', 'ইমেইল', 'ফোন', 'লিংকডইন', 'গিটহাব'
        ],
        answer: "আমার সাথে যোগাযোগ:\n📧 ইমেইল: abdulalim528260@gmail.com\n🔗 LinkedIn: linkedin.com/in/abdul-alim-5452a12b1\n🐙 GitHub: github.com/ProTiger24\nআপনি এই পেজের কন্ট্যাক্ট ফর্মও ব্যবহার করতে পারেন।"
    },

    // ============================================================
    // 21. GREETINGS – অভিবাদন
    // ============================================================
    {
        keywords: [
            'hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening',
            'হ্যালো', 'হাই', 'আসসালামু আলাইকুম', 'নমস্কার', 'শুভ সকাল', 'শুভ সন্ধ্যা'
        ],
        answer: "আসসালামু আলাইকুম! 👋 আমি আব্দুল আলিমের ভার্চুয়াল অ্যাসিস্ট্যান্ট। আপনি আমাকে যেকোনো প্রশ্ন করতে পারেন—যেমন: 'কে তুমি?', 'স্কিল', 'প্রজেক্ট', 'অভিজ্ঞতা', 'শিক্ষা', 'অ্যাচিভমেন্ট', 'কম্পিটিটিভ প্রোগ্রামিং', বা 'যোগাযোগ'।"
    }
];

// ============================================================
// উত্তর খোঁজার ফাংশন
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

    return 'দুঃখিত, আমি এই প্রশ্নের উত্তর দিতে পারছি না। আপনি "স্কিল", "প্রজেক্ট", "অভিজ্ঞতা", "শিক্ষা", "অ্যাচিভমেন্ট", "কম্পিটিটিভ প্রোগ্রামিং" বা "যোগাযোগ" লিখে চেষ্টা করুন। অথবা সরাসরি আমার পোর্টফোলিওর বিভিন্ন সেকশন দেখে নিতে পারেন।';
}

// ============================================================
// চ্যাট UI কন্ট্রোল (টাইপিং ইন্ডিকেটর সহ)
// ============================================================
function initChatbot() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatToggle || !chatWindow) return;

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // ১. ইউজারের মেসেজ যোগ করুন
        const userDiv = document.createElement('div');
        userDiv.className = 'flex items-start gap-2 justify-end';
        userDiv.innerHTML = `<div class="bg-cyan-500/20 text-cyan-100 rounded-2xl rounded-tr-none px-4 py-2 max-w-[85%] border border-cyan-500/20">${message}</div>`;
        chatMessages.appendChild(userDiv);

        chatInput.value = '';
        chatSend.disabled = true;
        chatSend.textContent = '...';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // ২. টাইপিং ইন্ডিকেটর যোগ করুন (লিখছি...)
        const typingDiv = document.createElement('div');
        typingDiv.className = 'flex items-start gap-2';
        typingDiv.innerHTML = `
            <div class="bg-[#1e293b] text-gray-200 rounded-2xl rounded-tl-none px-4 py-2 border border-gray-700/50">
                <span class="typing-dots">
                    <span></span><span></span><span></span>
                </span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // ৩. কিছুক্ষণ পর উত্তর দেখান (টাইপিং ইন্ডিকেটর রিমুভ করে)
        setTimeout(() => {
            // টাইপিং ইন্ডিকেটর সরান
            typingDiv.remove();

            const reply = getAnswer(message);
            const botDiv = document.createElement('div');
            botDiv.className = 'flex items-start gap-2';
            botDiv.innerHTML = `<div class="bg-[#1e293b] text-gray-200 rounded-2xl rounded-tl-none px-4 py-2 max-w-[85%] border border-gray-700/50 whitespace-pre-line">${reply}</div>`;
            chatMessages.appendChild(botDiv);

            chatSend.disabled = false;
            chatSend.textContent = 'Send';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 400);
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // বাইরে ক্লিক করলে চ্যাট বন্ধ
    document.addEventListener('click', (e) => {
        if (!chatWindow.classList.contains('hidden')) {
            const isClickInside = chatWindow.contains(e.target) || chatToggle.contains(e.target);
            if (!isClickInside) {
                chatWindow.classList.add('hidden');
            }
        }
    });
}

// ============================================================
// INITIALIZE ALL ON PAGE LOAD
// ============================================================
window.onload = function() {
    typeEffect();
    setTimeout(hideLoader, 2500);

    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initSwiper();
    initBackToTop();
    initActiveNavLink();
    initScrollProgress();
    initChatbot();

    console.log('✅ All components initialized successfully!');
};