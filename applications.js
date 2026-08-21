/**
 * WAB. — Page APPLICATIONS SUR MESURE
 * Autonome : navigation, comportement du header, animations d'entrée
 * et au scroll. L'horloge locale vient de nav-clock.js (partagé).
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

    /* ── Animations (GSAP) ── */
    (function initAnimations() {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

        // Sécurité : sans GSAP ou en mode « réduire les animations », on affiche tout.
        if (!hasGsap || reduceMotion) {
            document.querySelectorAll('.reveal, .app-hero__label, .app-hero__intro, .app-hero__meta').forEach((el) => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            document.querySelectorAll('.app-hero__line-inner').forEach((el) => {
                el.style.transform = 'none';
            });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Entrée du hero : label, lignes du titre, intro, meta
        gsap.timeline({ delay: 0.15 })
            .to('.app-hero__label', { opacity: 1, duration: 0.6, ease: 'power2.out' })
            .to('.app-hero__line-inner', {
                y: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out',
            }, '-=0.3')
            .to('.app-hero__intro', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
            .to('.app-hero__meta', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.4');

        // Parallaxe douce des captures : elles glissent un peu moins vite
        // que la page, ce qui décolle la composition sans distraire.
        gsap.utils.toArray('.app-figure').forEach((el) => {
            gsap.fromTo(el, { y: 22 }, {
                y: -22, ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            });
        });

        // FadeUp générique
        gsap.utils.toArray('.reveal').forEach((el) => {
            gsap.to(el, {
                y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            });
        });
    })();

});
