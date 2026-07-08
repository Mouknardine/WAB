/**
 * WAB. — Effet « texte qui se remplit » au scroll
 * Chaque élément marqué [data-fill-text] est découpé en mots ;
 * les mots passent du gris clair au noir au fil du scroll,
 * en avant comme en arrière (lié à la position de scroll).
 * Sans GSAP ou en mode « réduire les animations », le texte
 * reste simplement dans sa couleur normale.
 */
(function () {
    'use strict';

    function splitIntoWords(el) {
        const text = (el.textContent || '').trim().replace(/\s+/g, ' ');
        if (!text) return [];

        // Le texte original reste lisible par les lecteurs d'écran
        el.setAttribute('aria-label', text);
        el.textContent = '';

        const fragment = document.createDocumentFragment();
        text.split(' ').forEach((word) => {
            const span = document.createElement('span');
            span.className = 'fill-word';
            span.textContent = word;
            span.setAttribute('aria-hidden', 'true');
            fragment.appendChild(span);
            fragment.appendChild(document.createTextNode(' '));
        });
        el.appendChild(fragment);

        return Array.from(el.querySelectorAll('.fill-word'));
    }

    function init() {
        const targets = document.querySelectorAll('[data-fill-text]');
        if (!targets.length) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
        if (reduceMotion || !hasGsap) return;

        gsap.registerPlugin(ScrollTrigger);

        const rootStyles = getComputedStyle(document.documentElement);
        // Assez foncé pour rester lisible sur le verre dépoli rose
        const fromColor = (rootStyles.getPropertyValue('--gray-900') || '#8d8d8d').trim();
        const toColor = (rootStyles.getPropertyValue('--text') || '#202020').trim();

        targets.forEach((el) => {
            const words = splitIntoWords(el);
            if (!words.length) return;

            gsap.fromTo(words,
                { color: fromColor },
                {
                    color: toColor,
                    ease: 'none',
                    stagger: 0.35,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        end: 'top 32%',
                        scrub: 0.4,
                    },
                }
            );
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
