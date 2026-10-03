// @ts-check
/**
 * WAB OS — la nuée autour de la lettre
 * Quand la lettre arrive à l'écran, une nuée d'oiseaux entre ensemble
 * par les deux côtés et vient se poser : de part et d'autre de la
 * lettre sur ordinateur, sur le haut de sa fenêtre au téléphone. Une
 * seule arrivée par visite ; ensuite, chacun bat des ailes de temps
 * en temps, seulement tant que la section est à l'écran.
 *
 * Décor pur (canevas aria-hidden, aucun clic intercepté). Sous
 * « réduire les animations », les oiseaux sont déjà posés.
 */

import { createSpriteBank } from '../birds/sprites.js?v=7';
import { BODY_COLORS } from '../birds/frames.js?v=8';

const FLY_MS = 1500;
const STAGGER_MS = 380;
const BEAT_MS = 110;
const WIDE = 1180;

/**
 * @typedef {{ sx: number, sy: number, tx: number, ty: number, delay: number,
 *   dir: 1 | -1, color: string, scale: number, nextFlap: number }} Bird
 */

const sprites = createSpriteBank();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** @param {number} t */
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/** @param {number} min @param {number} max */
const rand = (min, max) => min + Math.random() * (max - min);

/**
 * Places de pose, en coordonnées du canevas.
 * @param {DOMRect} zone @param {DOMRect} letter @param {number} w @param {number} h
 * @returns {Array<{ x: number, y: number }>}
 */
function landingSpots(zone, letter, w, h) {
    const left = letter.left - zone.left;
    const right = letter.right - zone.left;
    const top = letter.top - zone.top;
    const spots = [];
    const perched = 4;
    // Sur le haut de la fenêtre, de part et d'autre du badge centré.
    const span = (right - left) * 0.4;
    for (let i = 0; i < perched; i++) {
        const half = Math.floor(perched / 2);
        const onLeft = i < half;
        const slot = onLeft ? i : i - half;
        const count = onLeft ? half : perched - half;
        const from = onLeft ? left + 16 : right - 16 - span;
        const x = from + ((span - w) * (slot + rand(0.2, 0.8))) / count;
        spots.push({ x, y: top - h + 2 });
    }
    if (zone.width < WIDE) return spots;
    const sideW = Math.min(left - 60, 360);
    for (let i = 0; i < 14; i++) {
        const onLeft = i % 2 === 0;
        const x = onLeft ? left - 40 - w - rand(0, sideW - w) : right + 40 + rand(0, sideW - w);
        const y = 40 + ((zone.height - 160) * (Math.floor(i / 2) + rand(0.1, 0.9))) / 7;
        spots.push({ x, y });
    }
    return spots;
}

/** @param {HTMLCanvasElement} canvas @param {HTMLElement} section @param {HTMLElement} letter */
function createFlight(canvas, section, letter) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    /** @type {Bird[]} */
    let birds = [];
    let start = 0;
    let rafId = 0;
    let visible = false;

    function layout() {
        const zone = section.getBoundingClientRect();
        canvas.width = Math.round(zone.width);
        canvas.height = Math.round(zone.height);
        if (!ctx) return;
        ctx.imageSmoothingEnabled = false;
        const scale = zone.width >= WIDE ? 3 : 2;
        const w = sprites.widthAt(scale);
        const h = sprites.heightAt(scale);
        const spots = landingSpots(zone, letter.getBoundingClientRect(), w, h);
        birds = spots.map((spot, i) => {
            const fromLeft = spot.x + w / 2 < zone.width / 2;
            return {
                sx: fromLeft ? -w - rand(40, 220) : zone.width + rand(40, 220),
                sy: spot.y - rand(120, 320),
                tx: Math.round(spot.x),
                ty: Math.round(spot.y),
                delay: (i / spots.length) * STAGGER_MS + rand(0, 120),
                dir: fromLeft ? 1 : -1,
                // Posés en groupe : bleu Klein et bleu ciel en alternance,
                // pour que l'accent ne fasse pas bloc (frames.js).
                color: BODY_COLORS[i % 2 === 0 ? 0 : 2],
                scale,
                nextFlap: rand(2500, 7000),
            };
        });
    }

    /** @param {number} now */
    function frame(now) {
        if (!ctx) return;
        const t = now - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const bird of birds) {
            const p = Math.min(1, Math.max(0, (t - bird.delay) / FLY_MS));
            const k = easeOut(p);
            // Un léger arc : l'oiseau plonge avant de se poser.
            const arc = Math.sin(k * Math.PI) * 40;
            const x = bird.sx + (bird.tx - bird.sx) * k;
            const y = bird.sy + (bird.ty - bird.sy) * k + arc;
            const flapping = p < 1 || (t > bird.nextFlap && t < bird.nextFlap + 440);
            if (p >= 1 && t >= bird.nextFlap + 440) bird.nextFlap = t + rand(3000, 8000);
            const frameIndex = flapping ? Math.floor(t / BEAT_MS) % 2 : 0;
            sprites.draw(ctx, { x, y, scale: bird.scale, dir: bird.dir, frameIndex, color: bird.color }, 1);
        }
        rafId = visible ? requestAnimationFrame(frame) : 0;
    }

    function landNow() {
        start = -1e9;
        frame(0);
    }

    return {
        layout,
        landNow,
        /** @param {boolean} isVisible */
        setVisible(isVisible) {
            visible = isVisible;
            if (visible && !rafId && !reducedMotion.matches) rafId = requestAnimationFrame(frame);
        },
        launch() {
            layout();
            if (reducedMotion.matches) return landNow();
            start = performance.now();
        },
    };
}

export function initArrival() {
    const section = document.querySelector('.letter-wrap');
    const letter = section?.querySelector('.letter');
    if (!(section instanceof HTMLElement) || !(letter instanceof HTMLElement)) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'arrival';
    canvas.setAttribute('aria-hidden', 'true');
    section.prepend(canvas);

    const flight = createFlight(canvas, section, letter);
    if (!flight || !('IntersectionObserver' in window)) return;

    let launched = false;
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !launched && entry.intersectionRatio >= 0.35) {
            launched = true;
            flight.launch();
        }
        flight.setVisible(entry.isIntersecting && launched);
    }, { threshold: [0, 0.35] });
    observer.observe(section);

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
        if (!launched) return;
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            flight.layout();
            flight.landNow();
        }, 200);
    });
}
