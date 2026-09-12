/**
 * WAB. — Bascule des réalisations
 * Trois boutons, une grille : tout, les sites internet, les
 * applications. Le filtre n'existe que si le script tourne — sans
 * lui, la grille reste complète et les boutons sont masqués par le
 * CSS, plutôt qu'affichés sans effet.
 */
(function () {
    'use strict';

    function initFilter() {
        const bar = document.querySelector('[data-filter-bar]');
        const grid = document.querySelector('[data-filter-grid]');
        if (!bar || !grid) return;

        const buttons = Array.from(bar.querySelectorAll('[data-filter]'));
        const pieces = Array.from(grid.querySelectorAll('[data-kind]'));
        const status = document.querySelector('[data-filter-status]');
        if (!buttons.length || !pieces.length) return;

        function apply(kind) {
            let shown = 0;

            for (const piece of pieces) {
                const keep = kind === 'all' || piece.dataset.kind === kind;
                piece.hidden = !keep;
                if (keep) shown++;
            }

            for (const button of buttons) {
                button.setAttribute('aria-pressed', String(button.dataset.filter === kind));
            }

            // Annoncé aux lecteurs d'écran : sans cette ligne, un
            // clic sur la bascule ne produirait aucun retour audible.
            if (status) {
                status.textContent = shown > 1
                    ? shown + ' projets affichés'
                    : shown + ' projet affiché';
            }
        }

        bar.addEventListener('click', (event) => {
            const button = event.target.closest('[data-filter]');
            if (!button) return;
            apply(button.dataset.filter);
        });

        apply('all');
    }

    document.addEventListener('DOMContentLoaded', initFilter);
})();
