/**
 * WAB. — WeAreBrothers Studio
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Viewport height fix (iOS Safari) ── */
    function setVh() {
        document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
    }
    setVh();
    window.addEventListener('resize', setVh, { passive: true });

    /* ── Theme toggle (dark / light) ── */
    (function initTheme() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;

        const root = document.documentElement;

        function syncAria() {
            toggle.setAttribute('aria-pressed', String(root.classList.contains('dark')));
        }
        syncAria();

        toggle.addEventListener('click', () => {
            const isDark = root.classList.toggle('dark');
            try {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            } catch (e) { /* localStorage indisponible : le choix ne sera pas mémorisé */ }
            syncAria();
        });
    })();

    /* ── GSAP ── */
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        document.querySelectorAll('.reveal, .hero-word, .hero-dot').forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    /* ── DOM refs ── */
    const header      = document.getElementById('header');
    const heroSection  = document.getElementById('hero');
    const menuToggle   = document.getElementById('menuToggle');
    const navOverlay   = document.getElementById('navOverlay');
    const scrollHint   = document.querySelector('.hero-scroll-hint');
    const navLinks     = document.querySelectorAll('[data-nav-link]');

    /* ════════════════════════════════════════════
       HERO ENTRANCE
       ════════════════════════════════════════════ */
    const heroWords = document.querySelectorAll('.hero-word, .hero-dot');
    gsap.timeline({ delay: 0.2 })
        .to(heroWords, {
            y: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.1,
            ease: 'power4.out',
        });

    // Scroll hint: fade in then fade out on scroll
    if (scrollHint) {
        gsap.fromTo(scrollHint,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, delay: 1.5, ease: 'power2.out' }
        );
        gsap.to(scrollHint, {
            opacity: 0,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: '25% top',
                scrub: true,
            },
        });
    }

    /* ════════════════════════════════════════════
       SCROLL REVEALS
       ════════════════════════════════════════════ */
    document.querySelectorAll('.reveal').forEach((el) => {
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
        });
    });

    /* ════════════════════════════════════════════
       NAVIGATION
       ════════════════════════════════════════════ */
    let menuOpen = false;

    function toggleMenu() {
        menuOpen = !menuOpen;
        menuToggle.classList.toggle('active', menuOpen);
        navOverlay.classList.toggle('open', menuOpen);
        header.classList.toggle('nav-open', menuOpen);

        if (menuOpen) {
            document.body.style.overflow = 'hidden';

            gsap.fromTo('.nav-link',
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power4.out', delay: 0.1 }
            );
            gsap.fromTo('.nav-email-btn',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.4 }
            );
        } else {
            document.body.style.overflow = '';
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetEl = document.querySelector(link.getAttribute('href'));
            if (menuOpen) toggleMenu();

            setTimeout(() => {
                if (!targetEl) return;
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        });
    });

    /* ════════════════════════════════════════════
       HEADER SCROLL BEHAVIOR
       ════════════════════════════════════════════ */
    let lastScrollY  = 0;
    let headerHidden = false;
    header.classList.add('hero-visible');

    function onScroll() {
        const scroll     = window.scrollY || window.pageYOffset;
        const heroHeight = window.innerHeight;

        // Hide hero when far past it
        heroSection.style.visibility = scroll > heroHeight * 1.5 ? 'hidden' : 'visible';

        // Header color swap
        if (scroll < heroSection.offsetTop + heroSection.offsetHeight - 80) {
            header.classList.add('hero-visible');
        } else {
            header.classList.remove('hero-visible');
        }

        // Auto-hide header on scroll down
        if (scroll > 100) {
            if (scroll > lastScrollY && !headerHidden) {
                header.classList.add('hide-up');
                headerHidden = true;
            } else if (scroll < lastScrollY && headerHidden) {
                header.classList.remove('hide-up');
                headerHidden = false;
            }
        } else {
            header.classList.remove('hide-up');
            headerHidden = false;
        }

        lastScrollY = scroll;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ════════════════════════════════════════════
       SERVICES — Stagger entrance
       ════════════════════════════════════════════ */
    const serviceRows = document.querySelectorAll('.service-row');
    if (serviceRows.length) {
        gsap.fromTo(serviceRows,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 0.9, stagger: 0.08, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.services-list',
                    start: 'top 82%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }

    /* ════════════════════════════════════════════
       PROJECT CARDS — Image reveal
       ════════════════════════════════════════════ */
    document.querySelectorAll('.project-card').forEach((card) => {
        const img = card.querySelector('.project-image-container');
        if (!img) return;

        gsap.fromTo(img,
            { y: 50, opacity: 0, scale: 0.96 },
            {
                y: 0, opacity: 1, scale: 1,
                duration: 1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 87%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });

    /* ════════════════════════════════════════════
       PIXEL BIRDS
       ════════════════════════════════════════════ */
    (function initBirds() {
        const canvas = document.getElementById('birdCanvas');
        if (!canvas) return;

        canvas.style.position     = 'absolute';
        canvas.style.top          = '0';
        canvas.style.left         = '0';
        canvas.style.width        = '100%';
        canvas.style.height       = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex       = '2';

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const SCALE      = 7;
        const FRAME_MS   = 180;
        const BIRD_COUNT = 4;
        const SPEED_MIN  = 55;
        const SPEED_MAX  = 90;
        const COLS       = 32;
        const ROWS       = 28;

        const BASE_COLORS = [
            '#2EA8E0', // bleu
            '#4CAF50', // vert
            '#F5A623', // orange
            '#E040FB', // violet
            '#F06292', // rose
            '#FF5252', // rouge
            '#FFEB3B', // jaune
        ];

        const COLORS = { 'K': '#000000', 'W': '#FFFFFF', 'Y': '#F5A623' };

        const FRAMES = [
            // FRAME 0 — ailes en haut
            [
                "....K...........................",
                "...KBKKKK.....KKKK..............",
                "...KBBBBBK...KBBBBK.............",
                "....KBBBBBK.KBBBBBBK............",
                "...KBBBBBBBKBBBBBBBBK...........",
                "....KKBBBBBKBBBWWWWBK...........",
                "....KBBBBBBBBBWWWKWWK...........",
                ".....KBBBBBBBBWWWWWWYK..........",
                "......KKBBWWWBBWWWWKK...........",
                ".KKKKKKKKWWWWWWWWKK.............",
                ".KBBBBBBWWWWWWWWWBK.............",
                "..KBBBBBWWWWWWWWBBBK............",
                "...KBBBBBWWWWWBBBBBK............",
                "..KBBBBBKKKKKKBBBBBBKK..........",
                "...KKBBK.....KBBBBBBBBK.........",
                "....KBK.......KBKBBBKK..........",
                ".....K.........KKBKBBK..........",
                ".................K.KK...........",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
            ],
            // FRAME 1 — ailes en bas
            [
                "................................",
                "................................",
                "................................",
                "................................",
                "...............KKKK.............",
                "..............KBBBBK............",
                ".............KBBBBBBK...........",
                "............KBBBBBBBBK..........",
                "...........KKBBBBWWWBK..........",
                "..........KBBBBBWWKWWK..........",
                ".........KBBBBBWWWWWWYK.........",
                ".......KKBBBBBBWWWWWKK..........",
                "..KKKKKKBBWWWBBKWWKK............",
                "..KBBBBBBWWWKBBBKWKK............",
                "...KBBBBBWWKBBBBBBBBK...........",
                "....KBBBBBWKBBBBBBBBK...........",
                "...KBBBBBKKKKBBBBBBBBK..........",
                "....KKBBK...KBBBBBBBBK..........",
                ".....KBK.....KBBBBBBK...........",
                "......K.......KKKBBBBK..........",
                "................KKKKK...........",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
            ],
        ];

        const FRAME_SEQUENCE = [0, 1];

        const BIRD_W = COLS * SCALE;
        const BIRD_H = ROWS * SCALE;

        function drawBird(frameIndex, birdX, birdY, bodyColor, flipped) {
            const frameData = FRAMES[frameIndex];
            ctx.save();
            if (flipped) {
                ctx.translate(Math.floor(birdX) + BIRD_W, Math.floor(birdY));
                ctx.scale(-1, 1);
            } else {
                ctx.translate(Math.floor(birdX), Math.floor(birdY));
            }
            for (let row = 0; row < ROWS; row++) {
                const line = frameData[row];
                for (let col = 0; col < COLS; col++) {
                    const ch = line[col];
                    if (ch === '.' || ch === undefined) continue;
                    ctx.fillStyle = ch === 'B' ? bodyColor : COLORS[ch];
                    ctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
                }
            }
            ctx.restore();
        }

        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        function createBird(index) {
            const dir = index % 2 === 0 ? 1 : -1; // alternance gauche/droite
            return {
                x:          dir === 1
                    ? (canvas.width / BIRD_COUNT) * index + Math.random() * (canvas.width / BIRD_COUNT * 0.6)
                    : canvas.width - (canvas.width / BIRD_COUNT) * (index - 1) - Math.random() * (canvas.width / BIRD_COUNT * 0.6),
                y:          canvas.height * 0.03 + Math.random() * (canvas.height * 0.75),
                speed:      SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
                dir:        dir,
                frameIndex: Math.round(Math.random()),
                frameTimer: Math.random() * FRAME_MS,
                color:      BASE_COLORS[index % BASE_COLORS.length],
            };
        }

        const birds = Array.from({ length: BIRD_COUNT }, (_, i) => createBird(i));

        let lastTime = performance.now();

        function animate(now) {
            requestAnimationFrame(animate);
            const delta = Math.min(now - lastTime, 100);
            lastTime = now;

            if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
                canvas.width  = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const bird of birds) {
                bird.x += bird.speed * bird.dir * (delta / 1000);

                // Reset quand hors écran
                if (bird.dir === 1 && bird.x > canvas.width + 50) {
                    bird.x     = -BIRD_W - Math.random() * 300;
                    bird.y     = canvas.height * 0.03 + Math.random() * (canvas.height * 0.75);
                    bird.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
                    bird.color = BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)];
                } else if (bird.dir === -1 && bird.x < -BIRD_W - 50) {
                    bird.x     = canvas.width + Math.random() * 300;
                    bird.y     = canvas.height * 0.03 + Math.random() * (canvas.height * 0.75);
                    bird.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
                    bird.color = BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)];
                }

                bird.frameTimer += delta;
                if (bird.frameTimer >= FRAME_MS) {
                    bird.frameTimer -= FRAME_MS;
                    bird.frameIndex  = (bird.frameIndex + 1) % FRAME_SEQUENCE.length;
                }

                drawBird(FRAME_SEQUENCE[bird.frameIndex], bird.x, bird.y, bird.color, bird.dir === -1);
            }
        }

        requestAnimationFrame(animate);

        window.addEventListener('resize', () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });
    })();

    /* ════════════════════════════════════════════
       FOOTER WATERMARK PARALLAX
       ════════════════════════════════════════════ */
    const watermark = document.querySelector('.footer-watermark');
    if (watermark) {
        gsap.fromTo(watermark,
            { yPercent: 30 },
            {
                yPercent: -10,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.footer',
                    start: 'top bottom',
                    end: 'bottom bottom',
                    scrub: 0.5,
                },
            }
        );
    }

});
