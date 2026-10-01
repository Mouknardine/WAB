// @ts-check
/**
 * WAB. — Liens de la barre : lettres qui basculent
 * Au survol, chaque lettre glisse vers le haut et sa copie remonte
 * d'en dessous, dans un ordre tiré au hasard à chaque passage (d'après
 * le Random Letter Swap de 21st.dev). Le script ne fait que découper
 * le mot et distribuer les délais ; le mouvement est en CSS.
 *
 * Le mot entier reste lu tel quel par les lecteurs d'écran : les
 * lettres découpées leur sont masquées.
 */
(function () {
    'use strict';

    /** Écart entre deux lettres, en secondes. */
    const STAGGER = 0.025;

    /**
     * Mélange de Fisher-Yates : renvoie une copie dans le désordre.
     * @template T
     * @param {T[]} items
     * @returns {T[]}
     */
    function shuffled(items) {
        const copy = items.slice();
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    /**
     * @param {string} char
     * @returns {HTMLSpanElement}
     */
    function buildChar(char) {
        const span = document.createElement('span');
        span.className = 'swap__char';
        // Une espace seule s'effacerait dans un inline-block.
        const shown = char === ' ' ? ' ' : char;
        span.textContent = shown;
        span.dataset.char = shown;
        return span;
    }

    /**
     * @param {HTMLElement} link
     */
    function splitLink(link) {
        const label = link.textContent?.trim() ?? '';
        if (!label) return;

        const hidden = document.createElement('span');
        hidden.className = 'sr-only';
        hidden.textContent = label;

        const word = document.createElement('span');
        word.className = 'swap';
        word.setAttribute('aria-hidden', 'true');
        const chars = Array.from(label, buildChar);
        word.append(...chars);

        link.replaceChildren(hidden, word);

        const reshuffle = () => {
            shuffled(chars).forEach((char, rank) => {
                char.style.setProperty('--swap-delay', `${(rank * STAGGER).toFixed(3)}s`);
            });
        };

        reshuffle();
        link.addEventListener('pointerenter', reshuffle);
        link.addEventListener('focus', reshuffle);
    }

    function initLetterSwap() {
        document.querySelectorAll('.topbar__link').forEach((link) => {
            if (link instanceof HTMLElement) splitLink(link);
        });
    }

    document.addEventListener('DOMContentLoaded', initLetterSwap);
})();
