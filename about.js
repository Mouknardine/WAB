/**
 * WAB. — Page À PROPOS
 * Autonome : navigation, comportement du header, animations
 * d'entrée et au scroll, compteurs, galerie à glisser et
 * horloge locale. L'effet « texte rose au scroll » est géré
 * par fill-text.js (partagé avec l'accueil).
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Hauteur de viewport (iOS Safari) ── */
    function setVh() {
        document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
    }
    setVh();
    window.addEventListener('resize', setVh, { passive: true });

    /* ── Navigation (menu plein écran) ── */
    (function initNav() {
        const menuToggle = document.getElementById('menuToggle');
        const navOverlay = document.getElementById('navOverlay');
        const header     = document.getElementById('header');
        if (!menuToggle || !navOverlay || !header) return;

        let menuOpen = false;

        function closeMenu() {
            menuOpen = false;
            menuToggle.classList.remove('active');
            navOverlay.classList.remove('open');
            header.classList.remove('nav-open');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', () => {
            menuOpen = !menuOpen;
            menuToggle.classList.toggle('active', menuOpen);
            navOverlay.classList.toggle('open', menuOpen);
            header.classList.toggle('nav-open', menuOpen);
            document.body.style.overflow = menuOpen ? 'hidden' : '';
        });

        // Les liens pointent vers d'autres pages/ancres : on ferme puis on laisse naviguer.
        navOverlay.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });
    })();

    /* ── Comportement du header au scroll (auto-masquage) ── */
    (function initHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScrollY  = 0;
        let headerHidden = false;
        let ticking      = false;

        function update() {
            ticking = false;
            const scroll = window.scrollY || window.pageYOffset;

            if (scroll > 100) {
                if (scroll > lastScrollY && !headerHidden) {
                    header.classList.add('hide-up');
                    headerHidden = true;
                } else if (scroll < lastScrollY && headerHidden) {
                    header.classList.remove('hide-up');
                    headerHidden = false;
                }
            } else if (headerHidden) {
                header.classList.remove('hide-up');
                headerHidden = false;
            }

            lastScrollY = scroll;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });
    })();

    /* ── Galerie : glisser à la souris (le tactile scrolle nativement) ── */
    (function initGalleryDrag() {
        const track = document.getElementById('galleryTrack');
        if (!track) return;

        let isDown      = false;
        let startX      = 0;
        let startScroll = 0;

        track.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse') return;
            isDown      = true;
            startX      = e.clientX;
            startScroll = track.scrollLeft;
            track.classList.add('is-dragging');
            track.setPointerCapture(e.pointerId);
        });

        track.addEventListener('pointermove', (e) => {
            if (!isDown) return;
            track.scrollLeft = startScroll - (e.clientX - startX);
        });

        function endDrag() {
            isDown = false;
            track.classList.remove('is-dragging');
        }
        track.addEventListener('pointerup', endDrag);
        track.addEventListener('pointercancel', endDrag);
    })();

    /* ── Horloge locale (Lausanne) ── */
    (function initClock() {
        const el = document.getElementById('localTime');
        if (!el) return;

        function update() {
            try {
                el.textContent = new Intl.DateTimeFormat('fr-CH', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Zurich',
                }).format(new Date());
            } catch (e) { /* fuseau indisponible : on garde le placeholder */ }
        }
        update();
        setInterval(update, 30000);
    })();

    /* ── Animations (GSAP) ── */
    (function initAnimations() {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

        // Sécurité : sans GSAP ou en mode « réduire les animations », on affiche tout.
        if (!hasGsap || reduceMotion) {
            document.querySelectorAll('.reveal, .about-hero__label, .about-hero__meta, .about-hero__figure').forEach((el) => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            document.querySelectorAll('.about-hero__line-inner').forEach((el) => {
                el.style.transform = 'none';
            });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Entrée du hero : label, lignes du titre, meta, photo
        gsap.timeline({ delay: 0.15 })
            .to('.about-hero__label', { opacity: 1, duration: 0.6, ease: 'power2.out' })
            .to('.about-hero__line-inner', {
                y: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out',
            }, '-=0.3')
            .to('.about-hero__meta', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
            .to('.about-hero__figure', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.55');

        // Parallaxe douce sur la photo du hero
        gsap.fromTo('.about-hero__figure img',
            { yPercent: -2.5 },
            {
                yPercent: 2.5,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.about-hero__figure',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.4,
                },
            }
        );

        // FadeUp générique
        gsap.utils.toArray('.reveal').forEach((el) => {
            gsap.to(el, {
                y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            });
        });

        // Compteurs des chiffres
        gsap.utils.toArray('.stat__num[data-count]').forEach((el) => {
            const target = parseInt(el.dataset.count, 10);
            if (Number.isNaN(target)) return;

            const counter = { value: 0 };
            gsap.to(counter, {
                value: target,
                duration: 1.4,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                onUpdate() {
                    el.textContent = String(Math.round(counter.value)).padStart(2, '0');
                },
            });
        });
    })();

});
