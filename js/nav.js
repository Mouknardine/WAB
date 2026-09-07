/**
 * WAB. — Barre flottante
 * En petit écran, la pilule se prolonge pour contenir le menu : le
 * script se limite à basculer une classe et l'état annoncé aux
 * lecteurs d'écran, l'ouverture elle-même est animée en CSS.
 * La barre se rétracte quand on descend et revient dès qu'on remonte.
 */
(function () {
    'use strict';

    function initTopbar() {
        const topbar = document.getElementById('topbar');
        const pill = document.getElementById('topbarPill');
        const burger = document.getElementById('menuToggle');
        const panel = document.getElementById('topbarPanel');
        const scrim = document.getElementById('topbarScrim');
        if (!topbar) return;

        let open = false;

        function setMenu(next) {
            if (!pill || !burger || !scrim) return;
            open = next;
            pill.classList.toggle('is-open', open);
            scrim.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        }

        if (pill && burger && panel && scrim) {
            setMenu(false);

            burger.addEventListener('click', () => setMenu(!open));
            scrim.addEventListener('click', () => setMenu(false));

            panel.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => setMenu(false));
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && open) {
                    setMenu(false);
                    burger.focus();
                }
            });

            // Le menu n'a plus de raison d'être une fois la barre passée
            // en mode bureau : on le referme pour éviter que le scroll
            // du corps reste verrouillé après un pivot de l'écran.
            const wide = window.matchMedia('(min-width: 900px)');
            const closeIfWide = (event) => {
                if (event.matches && open) setMenu(false);
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

            if (open || y < 120) {
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
