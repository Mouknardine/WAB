/**
 * WAB. — Oiseaux en pixel art
 * Quelques oiseaux traversent le fond de la page en boucle. Ils
 * s'effacent en approchant des textes posés à même le papier, se
 * mettent en pause quand l'onglet passe en arrière-plan, et se
 * figent si le visiteur a demandé à son système de réduire les
 * animations.
 */

import { BODY_COLORS } from './frames.js';
import { createSpriteBank } from './sprites.js';
import { createFlock } from './flock.js';
import { createShyness } from './shyness.js';

const BIRD_COUNT = 4;

/* Taille proportionnée à l'écran : à 7 pixels par point, un oiseau
   fait 224px de large et couvre plus de la moitié d'un téléphone. */
function scaleForWidth(width) {
    if (width < 600) return 4;
    if (width < 1000) return 5;
    return 7;
}

function initBirds() {
    const canvas = document.getElementById('birdCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const sprites = createSpriteBank(scaleForWidth(window.innerWidth));
    const shyness = createShyness();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        sprites.setScale(scaleForWidth(canvas.width));
    }

    resizeCanvas();

    const flock = createFlock(BIRD_COUNT, canvas.width, canvas.height);

    let lastTime = performance.now();
    let needsResize = false;
    let running = false;
    let rafId = null;

    // Réutilisé d'une image à l'autre plutôt que recréé soixante fois
    // par seconde.
    const sky = { width: 0, height: 0, birdWidth: 0, birdHeight: 0 };

    function measureSky() {
        sky.width = canvas.width;
        sky.height = canvas.height;
        sky.birdWidth = sprites.width;
        sky.birdHeight = sprites.height;
        return sky;
    }

    function animate(now) {
        const delta = Math.min(now - lastTime, 100);
        lastTime = now;

        if (needsResize) {
            resizeCanvas();
            needsResize = false;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shyness.frame(window.scrollY, canvas.height);
        flock.advance(delta, measureSky(), shyness);

        for (const bird of flock.birds) {
            sprites.draw(ctx, bird.frameIndex, bird.x, bird.y, bird.color, bird.dir === -1, bird.opacity);
        }

        if (running) rafId = requestAnimationFrame(animate);
    }

    function start() {
        if (running) return;
        running = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(animate);
    }

    function stop() {
        running = false;
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    /* Mouvement réduit : les oiseaux sont posés une fois pour toutes
       dans le haut du ciel et ne bougent plus. Les positions sont
       exprimées sur la largeur réellement disponible, pour qu'aucun
       oiseau ne soit coupé par le bord même sur un écran de 320px. */
    function drawStill() {
        stop();
        resizeCanvas();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shyness.frame(window.scrollY, canvas.height);

        const libre = Math.max(0, canvas.width - sprites.width);
        const perches = canvas.width < sprites.width * 2
            ? [{ fx: 0.5, fy: 0.12, color: BODY_COLORS[0], flipped: false }]
            : [
                { fx: 0.05, fy: 0.13, color: BODY_COLORS[0], flipped: false },
                { fx: 0.60, fy: 0.05, color: BODY_COLORS[3], flipped: true },
                { fx: 1.00, fy: 0.28, color: BODY_COLORS[1], flipped: false },
            ];

        for (const perche of perches) {
            const x = libre * perche.fx;
            const y = canvas.height * perche.fy;
            const visible = shyness.isOpen(x, y, sprites.width, sprites.height);
            sprites.draw(ctx, 0, x, y, perche.color, perche.flipped, visible ? 1 : 0);
        }
    }

    function syncPlayback() {
        if (motionQuery.matches) drawStill();
        else if (document.hidden) stop();
        else start();
    }

    /* Le calque étant fixe, les oiseaux immobiles se retrouveraient
       tôt ou tard sur un texte : en mouvement réduit, la scène est
       redessinée au défilement pour qu'ils s'effacent au bon moment. */
    let stillScheduled = false;
    function redrawStill() {
        if (!motionQuery.matches || stillScheduled) return;
        stillScheduled = true;
        requestAnimationFrame(() => {
            stillScheduled = false;
            drawStill();
        });
    }

    function remeasure() {
        shyness.measure();
        redrawStill();
    }

    function remeasureWhileMoving() {
        shyness.measureWhileMoving();
        redrawStill();
    }

    shyness.measure();
    syncPlayback();

    // La mise en page bouge encore après le premier rendu : la police
    // s'installe, les images arrivent. On remesure quand tout est là.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(remeasure).catch(() => { /* police de secours */ });
    }
    window.addEventListener('load', remeasure);

    motionQuery.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener('scroll', redrawStill, { passive: true });

    window.addEventListener('resize', () => {
        needsResize = true;
        remeasureWhileMoving();
    }, { passive: true });

    // Dépliage d'une carte, apparition au défilement : toute mise en
    // page qui bouge décale les lignes de texte.
    if ('ResizeObserver' in window) {
        new ResizeObserver(remeasureWhileMoving).observe(document.body);
    }
    // La barre flottante est écartée : elle s'anime à chaque
    // défilement et ne déplace aucune ligne de la page.
    const onPageMoves = (event) => {
        if (event.target instanceof Element && event.target.closest('.topbar')) return;
        remeasureWhileMoving();
    };
    for (const name of ['transitionstart', 'transitionend', 'animationstart', 'animationend']) {
        document.addEventListener(name, onPageMoves, true);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBirds);
} else {
    initBirds();
}
