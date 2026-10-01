/**
 * WAB. — Barre de navigation
 * La barre reste collée en haut, sur ordinateur comme sur téléphone :
 * c'est le CSS qui la fixe, le script ne s'occupe que du menu. En
 * petit écran, un panneau se déroule sous la barre ; l'ouverture
 * elle-même est animée en CSS.
 */
(function () {
    'use strict';

    function initTopbar() {
        const bar = document.getElementById('topbarBar');
        const toggle = document.getElementById('menuToggle');
        const panel = document.getElementById('topbarPanel');
        const scrim = document.getElementById('topbarScrim');
        if (!bar || !toggle || !panel || !scrim) return;

        let open = false;

        function setMenu(next) {
            open = next;
            bar.classList.toggle('is-open', open);
            scrim.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        }

        setMenu(false);

        toggle.addEventListener('click', () => setMenu(!open));
        scrim.addEventListener('click', () => setMenu(false));

        panel.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setMenu(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && open) {
                setMenu(false);
                toggle.focus();
            }
        });

        // Le menu n'a plus de raison d'être une fois la barre passée en
        // mode bureau : on le referme pour éviter que le défilement du
        // corps reste verrouillé après un pivot de l'écran.
        const wide = window.matchMedia('(min-width: 900px)');
        const closeIfWide = (event) => {
            if (event.matches && open) setMenu(false);
        };
        if (typeof wide.addEventListener === 'function') {
            wide.addEventListener('change', closeIfWide);
        }
    }

    /* La plaque s'épaissit dès que la page quitte son tout premier
       écran (nav.css, .is-scrolled) : transparente sur le ciel au
       repos, lisible par-dessus le contenu ensuite. Un seul calcul par
       image, quel que soit le nombre d'évènements de défilement. */
    function initScrolled() {
        const topbar = document.getElementById('topbar');
        if (!topbar) return;

        const THRESHOLD = 10;
        let pending = false;

        const update = () => {
            pending = false;
            topbar.classList.toggle('is-scrolled', window.scrollY > THRESHOLD);
        };

        window.addEventListener('scroll', () => {
            if (pending) return;
            pending = true;
            window.requestAnimationFrame(update);
        }, { passive: true });
        update();
    }

    document.addEventListener('DOMContentLoaded', initTopbar);
    document.addEventListener('DOMContentLoaded', initScrolled);
})();
