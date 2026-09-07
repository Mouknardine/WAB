/**
 * WAB. — Cartes dépliantes
 * Le script ne fait que basculer une classe et l'état annoncé aux
 * lecteurs d'écran ; l'ouverture elle-même est animée en CSS.
 * Plusieurs cartes peuvent rester ouvertes en même temps.
 */
(function () {
    'use strict';

    function initAccordion() {
        const toggles = document.querySelectorAll('.service__toggle');
        if (!toggles.length) return;

        toggles.forEach((toggle) => {
            const card = toggle.closest('.service');
            if (!card) return;

            toggle.addEventListener('click', () => {
                const open = !card.classList.contains('is-open');
                card.classList.toggle('is-open', open);
                toggle.setAttribute('aria-expanded', String(open));
            });
        });
    }

    document.addEventListener('DOMContentLoaded', initAccordion);
})();
