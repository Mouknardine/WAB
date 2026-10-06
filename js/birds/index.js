/**
 * WAB. — Oiseaux en pixel art
 *
 * Un ciel traverse le fond de tout le site. Sur l'accueil, qui ne
 * défile pas, il est densément peuplé — c'est le décor de la page.
 * Sur les pages de contenu, quelques oiseaux seulement, pour ne pas
 * disputer l'attention au texte : la densité se déclare dans le HTML
 * par `data-birds="dense"`, ou `data-birds="rare"` sur l'accueil
 * WAB OS : deux à quatre oiseaux, des mascottes plutôt qu'un ciel.
 *
 * Les oiseaux s'effacent en approchant des textes posés à même le
 * papier, se mettent en pause quand l'onglet passe en arrière-plan,
 * et se figent si le visiteur a demandé à son système de réduire les
 * animations.
 */

/* ?v=5 sur chaque import, et le même partout où un fichier est
   importé : des visiteurs gardent en cache, pour un mois, d'anciennes
   versions de ces fichiers. Une adresse neuve les en libère. Le
   serveur revalide désormais les scripts à chaque visite (.htaccess) :
   ce numéro n'aura plus à bouger. */
import { FLIGHT_COLORS, VIVID_COLORS } from './frames.js?v=9';
import { createSpriteBank } from './sprites.js?v=7';
import { createFlock, TEXT_DIM } from './flock.js?v=11';
import { createShyness } from './shyness.js?v=5';

/* Échelles de dessin disponibles, de l'oiseau le plus lointain au
   plus proche. Un point de plus, c'est 32 px de largeur en plus. */
const LADDER_SMALL = [2, 3, 4];
const LADDER_LARGE = [2, 3, 4, 5];

/** Part haute de l'écran où vole un ciel « top » (téléphone). */
const TOP_SKY = 0.58;
/** Même seuil que le premier écran de l'accueil (desk-hero.css). */
const NARROW = '(max-width: 899px)';

/* Un oiseau pour tant de pixels carrés d'écran, puis bornes. Deux
   régimes : le décor de l'accueil et le fond des pages de contenu.
   Le second a été relevé le jour où les oiseaux ont cessé de
   s'effacer devant les textes : à trois ou quatre, le ciel des
   pages restait vide la plupart du temps. */
const DENSITY = {
    dense: { area: 27000, min: 20, max: 48 },
    calm: { area: 120000, min: 5, max: 12 },
    rare: { area: 420000, min: 2, max: 3 },
};

function ladderFor(width) {
    return width < 700 ? LADDER_SMALL : LADDER_LARGE;
}

function countFor(width, height, regime) {
    const rule = DENSITY[regime] || DENSITY.calm;
    const raw = Math.round((width * height) / rule.area);
    return Math.min(rule.max, Math.max(rule.min, raw));
}

function initBirds() {
    const canvas = document.getElementById('birdCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const asked = document.body.dataset.birds;
    const regime = asked === 'dense' || asked === 'rare' ? asked : 'calm';
    const sprites = createSpriteBank();
    const shyness = createShyness();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Réutilisé d'une image à l'autre plutôt que recréé soixante fois
    // par seconde.
    const sky = {
        width: 0,
        height: 0,
        widthAt: sprites.widthAt,
        heightAt: sprites.heightAt,
        pointer: null,
    };

    /* Deux montages du calque : fixé à l'écran (toutes les pages), ou
       attaché à une section qu'il suit au défilement (le premier
       écran de l'accueil). Les zones de texte et le curseur sont
       ramenés dans les coordonnées du calque dans les deux cas. */
    const pinned = window.getComputedStyle(canvas).position === 'fixed';
    let inView = true;

    /** Haut du calque dans la page, en px. */
    function canvasTop() {
        return pinned ? window.scrollY : canvas.getBoundingClientRect().top + window.scrollY;
    }

    /** @param {PointerEvent} event */
    function toCanvas(event) {
        if (pinned) return { x: event.clientX, y: event.clientY };
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    /* Le curseur, pour que les oiseaux s'en écartent. Le calque est
       fixé à l'écran : les coordonnées du curseur sont directement
       celles du dessin. Au doigt, seul le moment du toucher compte —
       il n'y a pas de curseur qui survole. */
    const TOUCH_MS = 500;
    let touchTimer = 0;
    window.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        sky.pointer = toCanvas(event);
    }, { passive: true });
    window.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'touch') return;
        sky.pointer = toCanvas(event);
        window.clearTimeout(touchTimer);
        touchTimer = window.setTimeout(() => { sky.pointer = null; }, TOUCH_MS);
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { sky.pointer = null; });
    window.addEventListener('blur', () => { sky.pointer = null; });

    // L'accueil peut demander une volée de toutes les couleurs
    // (data-birds-colors="vives") et, au téléphone, un ciel limité au
    // haut de l'écran (data-birds-sky="top") : le texte y est en bas ;
    // sur ordinateur il est au centre, la volée l'entoure.
    const vivid = document.body.dataset.birdsColors === 'vives';
    const topSky = document.body.dataset.birdsSky === 'top';
    const narrow = window.matchMedia(NARROW);
    const flock = createFlock(1, ladderFor(window.innerWidth), {
        colors: vivid ? VIVID_COLORS : FLIGHT_COLORS,
        skyShare: () => (topSky && narrow.matches ? TOP_SKY : 1),
    });

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        sky.width = canvas.width;
        sky.height = canvas.height;
        flock.setScales(ladderFor(canvas.width));
        flock.setCount(countFor(canvas.width, canvas.height, regime));
    }

    resizeCanvas();

    let lastTime = performance.now();
    let needsResize = false;
    let running = false;
    let rafId = null;

    function animate(now) {
        const delta = Math.min(now - lastTime, 100);
        lastTime = now;

        if (needsResize) {
            resizeCanvas();
            needsResize = false;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shyness.frame(canvasTop(), canvas.height);
        flock.advance(delta, sky, shyness);

        for (const bird of flock.birds) {
            sprites.draw(ctx, bird, bird.opacity);
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

    /* Mouvement réduit : quelques oiseaux sont posés une fois pour
       toutes dans le ciel et n'en bougent plus. Les positions sont
       exprimées en fractions de la place disponible, pour qu'aucun
       oiseau ne soit coupé par le bord même sur un écran de 320 px. */
    const PERCHES = [
        { fx: 0.06, fy: 0.14, scale: 4 },
        { fx: 0.62, fy: 0.08, scale: 3 },
        { fx: 0.94, fy: 0.26, scale: 5 },
        { fx: 0.30, fy: 0.33, scale: 2 },
        { fx: 0.78, fy: 0.48, scale: 3 },
    ];

    function drawStill() {
        stop();
        resizeCanvas();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shyness.frame(canvasTop(), canvas.height);

        const ladder = ladderFor(canvas.width);
        const biggest = ladder[ladder.length - 1];
        const perches = regime === 'dense' ? PERCHES : PERCHES.slice(0, 2);

        perches.forEach((perche, index) => {
            const scale = Math.min(perche.scale, biggest);
            const width = sprites.widthAt(scale);
            const height = sprites.heightAt(scale);
            const bird = {
                x: Math.max(0, canvas.width - width) * perche.fx,
                y: canvas.height * perche.fy,
                scale,
                dir: index % 2 === 0 ? 1 : -1,
                frameIndex: index % 2,
                color: (vivid ? VIVID_COLORS : FLIGHT_COLORS)[index % (vivid ? VIVID_COLORS : FLIGHT_COLORS).length],
            };
            const visible = shyness.isOpen(bird.x, bird.y, width, height);
            sprites.draw(ctx, bird, visible ? 1 : TEXT_DIM);
        });
    }

    function syncPlayback() {
        if (motionQuery.matches) drawStill();
        else if (document.hidden || !inView) stop();
        else start();
    }

    // Attaché à une section, le ciel ne vole que lorsqu'elle est à l'écran.
    if (!pinned && 'IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            syncPlayback();
        }).observe(canvas);
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
