/**
 * WAB. — Services : cartes inclinées en 3D
 * D'après la « Tilt Card » de tom_ui (21st.dev, 30.09.2026), effet
 * « gravitate » : la carte penche vers la souris, grossit à peine,
 * et un reflet de lumière suit le curseur (css/service-motion.css).
 * Uniquement avec une souris et sans « réduire les animations ».
 */
(function () {
    'use strict';

    // Angle maximal, en degrés. Les grandes cartes étant deux fois plus
    // larges, le même angle y déplacerait les bords deux fois plus :
    // on le réduit pour qu'elles bougent autant à l'œil.
    const TILT = 7;
    const TILT_WIDE = 4;
    const SCALE = 1.02;
    const PERSPECTIVE = 1000;

    function canTilt() {
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return finePointer && !reduceMotion;
    }

    // Tant que la carte n'est pas entrée à l'écran, son « transform »
    // appartient à l'animation d'apparition (js/reveal.js).
    function isSettled(card) {
        return !card.classList.contains('reveal') || card.classList.contains('is-visible');
    }

    function tiltFor(card, clientX, clientY) {
        const rect = card.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width;
        const py = (clientY - rect.top) / rect.height;
        const limit = card.classList.contains('svc-card--wide') ? TILT_WIDE : TILT;
        const rotateX = (0.5 - py) * limit * 2;
        const rotateY = (px - 0.5) * limit * 2;
        return {
            transform: `perspective(${PERSPECTIVE}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${SCALE})`,
            shineX: `${(px * 100).toFixed(1)}%`,
            shineY: `${(py * 100).toFixed(1)}%`,
        };
    }

    function bindCard(card) {
        let frame = 0;
        let last = null;

        function paint() {
            frame = 0;
            if (!last) return;
            const tilt = tiltFor(card, last.clientX, last.clientY);
            card.style.transform = tilt.transform;
            card.style.setProperty('--shine-x', tilt.shineX);
            card.style.setProperty('--shine-y', tilt.shineY);
        }

        card.addEventListener('pointerenter', (event) => {
            if (event.pointerType !== 'mouse' || !isSettled(card)) return;
            card.classList.add('is-tilting');
        });

        card.addEventListener('pointermove', (event) => {
            if (!card.classList.contains('is-tilting')) return;
            last = event;
            if (!frame) frame = requestAnimationFrame(paint);
        });

        card.addEventListener('pointerleave', () => {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
            last = null;
            card.classList.remove('is-tilting');
            card.style.transform = '';
        });
    }

    function initTilt() {
        if (!canTilt()) return;
        document.querySelectorAll('.svc-card').forEach(bindCard);
    }

    document.addEventListener('DOMContentLoaded', initTilt);
})();
