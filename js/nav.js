/**
 * WAB. — Barre flottante et tiroir de navigation
 * Le tiroir n'existe qu'en petit écran ; sur grand écran les liens
 * sont déjà visibles dans la pilule. La barre se rétracte quand on
 * descend et revient dès qu'on remonte.
 */
(function () {
    'use strict';

    function initTopbar() {
        const topbar = document.getElementById('topbar');
        const burger = document.getElementById('menuToggle');
        const drawer = document.getElementById('mobileMenu');
        const scrim = document.getElementById('drawerScrim');
        if (!topbar) return;

        /* ── Tiroir ── */
        if (burger && drawer && scrim) {
            let open = false;

            function setDrawer(next) {
                open = next;
                burger.setAttribute('aria-expanded', String(open));
                drawer.classList.toggle('is-open', open);
                scrim.classList.toggle('is-open', open);
                drawer.setAttribute('aria-hidden', String(!open));
                document.body.style.overflow = open ? 'hidden' : '';
            }

            setDrawer(false);

            burger.addEventListener('click', () => setDrawer(!open));
            scrim.addEventListener('click', () => setDrawer(false));

            drawer.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => setDrawer(false));
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && open) {
                    setDrawer(false);
                    burger.focus();
                }
            });

            // Le tiroir n'a plus de raison d'être une fois la barre
            // passée en mode bureau : on le referme pour éviter que
            // le scroll du corps reste verrouillé après un pivot.
            const wide = window.matchMedia('(min-width: 900px)');
            const closeIfWide = (event) => {
                if (event.matches && open) setDrawer(false);
            };
            if (typeof wide.addEventListener === 'function') {
                wide.addEventListener('change', closeIfWide);
            }
        }

        /* ── Rétractation au défilement ── */
        let lastY = window.scrollY || 0;
        let tucked = false;
        let ticking = false;

        function update() {
            ticking = false;
            const y = window.scrollY || window.pageYOffset || 0;
            const drawerOpen = drawer ? drawer.classList.contains('is-open') : false;

            if (drawerOpen || y < 120) {
                if (tucked) {
                    topbar.classList.remove('is-tucked');
                    tucked = false;
                }
            } else if (y > lastY + 4 && !tucked) {
                topbar.classList.add('is-tucked');
                tucked = true;
            } else if (y < lastY - 4 && tucked) {
                topbar.classList.remove('is-tucked');
                tucked = false;
            }

            lastY = y;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', initTopbar);
})();
