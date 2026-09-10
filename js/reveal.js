/**
 * WAB. — Apparitions au défilement et hauteur d'écran mobile
 * Chaque élément marqué .reveal monte en place la première fois
 * qu'il entre dans l'écran. Les éléments d'un même groupe
 * ([data-reveal-group]) se succèdent légèrement en décalé.
 */
(function () {
    'use strict';

    function setViewportUnit() {
        document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
    }

    function showAll(targets) {
        targets.forEach((el) => el.classList.add('is-visible'));
    }

    function initReveal() {
        setViewportUnit();
        window.addEventListener('resize', setViewportUnit, { passive: true });

        const targets = Array.from(document.querySelectorAll('.reveal'));
        if (!targets.length) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Les robots d'indexation qui exécutent le script (Bingbot,
        // Googlebot…) ne font pas défiler la page : sans cette ligne,
        // tout ce qui est sous le premier écran resterait invisible
        // dans leur rendu. Même contenu, sans l'animation d'entrée.
        const crawler = /bot|crawl|spider|slurp|bingpreview|lighthouse|prerender/i.test(navigator.userAgent);
        if (reduceMotion || crawler || !('IntersectionObserver' in window)) {
            showAll(targets);
            return;
        }

        // Le décalage se calcule par groupe : deux cartes voisines
        // s'allument l'une après l'autre, mais une carte isolée en
        // bas de page n'attend jamais.
        const counters = new Map();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const group = el.closest('[data-reveal-group]');
                let delay = 0;

                if (group) {
                    const seen = counters.get(group) || 0;
                    delay = Math.min(seen, 5) * 70;
                    counters.set(group, seen + 1);
                }

                el.style.transitionDelay = delay + 'ms';
                el.classList.add('is-visible');
                observer.unobserve(el);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

        targets.forEach((el) => observer.observe(el));
    }

    document.addEventListener('DOMContentLoaded', initReveal);
})();
