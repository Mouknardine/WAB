/**
 * WAB. — Barre flottante
 * La barre reste visible en permanence, sur ordinateur comme sur
 * téléphone : c'est le CSS qui la fixe, le script ne s'occupe que du
 * menu. En petit écran, la pilule se prolonge pour l'accueillir ;
 * l'ouverture elle-même est animée en CSS.
 */
(function () {
    'use strict';

    function initTopbar() {
        const pill = document.getElementById('topbarPill');
        const burger = document.getElementById('menuToggle');
        const panel = document.getElementById('topbarPanel');
        const scrim = document.getElementById('topbarScrim');
        if (!pill || !burger || !panel || !scrim) return;

        let open = false;

        function setMenu(next) {
            open = next;
            pill.classList.toggle('is-open', open);
            scrim.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        }

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

    document.addEventListener('DOMContentLoaded', initTopbar);
})();
