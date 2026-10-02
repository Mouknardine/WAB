// @ts-check
/**
 * WAB. — Services : tuiles inclinées en 3D
 * D'après la « Tilt Card » de tom_ui (21st.dev, 30.09.2026), effet
 * « gravitate » : la tuile penche vers la souris, grossit à peine,
 * et un reflet de lumière suit le curseur (css/service-motion.css).
 * Uniquement avec une souris et sans « réduire les animations ».
 */
(function () {
    'use strict';

    // Angle maximal, en degrés. Plus la tuile est grande, plus le même
    // angle déplacerait ses bords : on le réduit pour qu'elles bougent
    // toutes autant à l'œil.
    const TILT = 7;
    const TILT_LARGE = 3;
    const LARGE_WIDTH = 480;
    const SCALE = 1.015;
    const PERSPECTIVE = 1000;

    /** @returns {boolean} */
    function canTilt() {
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return finePointer && !reduceMotion;
    }

    /**
     * Tant que la tuile n'est pas entrée à l'écran, son « transform »
     * appartient à l'animation d'apparition (js/reveal.js).
     * @param {HTMLElement} card
     * @returns {boolean}
     */
    function isSettled(card) {
        return !card.classList.contains('reveal') || card.classList.contains('is-visible');
    }

    /**
     * @param {HTMLElement} card
     * @param {number} clientX
     * @param {number} clientY
     * @returns {{ transform: string, shineX: string, shineY: string }}
     */
    function tiltFor(card, clientX, clientY) {
        const rect = card.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width;
        const py = (clientY - rect.top) / rect.height;
        const limit = rect.width > LARGE_WIDTH ? TILT_LARGE : TILT;
        const rotateX = (0.5 - py) * limit * 2;
        const rotateY = (px - 0.5) * limit * 2;
        return {
            transform: `perspective(${PERSPECTIVE}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${SCALE})`,
            shineX: `${(px * 100).toFixed(1)}%`,
            shineY: `${(py * 100).toFixed(1)}%`,
        };
    }

    /** @param {HTMLElement} card */
    function bindCard(card) {
        let frame = 0;
        /** @type {PointerEvent | null} */
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
        document.querySelectorAll('.sv-tile').forEach((card) => {
            if (card instanceof HTMLElement) bindCard(card);
        });
    }

    document.addEventListener('DOMContentLoaded', initTilt);
})();
