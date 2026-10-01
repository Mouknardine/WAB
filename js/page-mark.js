// @ts-check
/**
 * WAB. — Repères au-dessus des titres de page
 * Compte les éléments de la page (projets, savoir-faire, associés)
 * pour que le chiffre affiché suive le contenu quand on en ajoute :
 * personne n'aura à penser à le mettre à jour. Sans script, le
 * chiffre écrit dans le HTML reste affiché.
 */
(function () {
    'use strict';

    function fillCounts() {
        document.querySelectorAll('[data-count]').forEach((slot) => {
            const selector = slot.getAttribute('data-count');
            if (!selector) return;
            try {
                const total = document.querySelectorAll(selector).length;
                if (total > 0) slot.textContent = String(total).padStart(2, '0');
            } catch (error) {
                // Sélecteur invalide : on garde le chiffre écrit à la main.
            }
        });
    }

    document.addEventListener('DOMContentLoaded', fillCounts);
})();
