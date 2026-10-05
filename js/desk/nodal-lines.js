// @ts-check
/**
 * WAB. — Le fond des cartes : dessin et cycle de vie
 * Chaque <canvas data-nodal> reçoit les lignes nodales (nodal-field.js)
 * dessinées en caractères mono, de la couleur CSS du canvas.
 *
 * Performance d'abord : l'animation ne tourne que si la carte est à
 * l'écran et l'onglet visible. Sous « réduire les animations », une
 * seule image fixe, sans réaction au pointeur.
 */

import { RAMP, ALPHA_BUCKETS, SOURCES, createEmitters, nodeStrength } from './nodal-field.js?v=1';

const CELL = 12; // px, taille du caractère
const POINTER_TAU = 0.5; // s, apparition / effacement de la source du pointeur
const POINTER_PHASE = Math.PI;
const DT_MAX = 0.05;

/** @typedef {{ draw: (t: number) => void, resize: () => void }} Painter */

/** @param {HTMLCanvasElement} canvas @param {CanvasRenderingContext2D} ctx @returns {Painter & { emitters: ReturnType<typeof createEmitters> }} */
function createPainter(canvas, ctx) {
    const emitters = createEmitters(SOURCES.length + 1);
    /** @type {number[][]} */
    const buckets = Array.from({ length: ALPHA_BUCKETS }, () => []);
    let cellW = CELL;
    let cols = 0;
    let rows = 0;
    let chars = new Uint8Array(0);
    let color = '';

    const resize = () => {
        const { width, height } = canvas.getBoundingClientRect();
        if (width < 2 || height < 2) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        const style = getComputedStyle(canvas);
        color = style.color;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = `${CELL}px ${style.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        cellW = Math.max(4, ctx.measureText('MMMMMMMMMM').width / 10);
        cols = Math.ceil(width / cellW);
        rows = Math.ceil(height / CELL);
        chars = new Uint8Array(cols * rows);
        SOURCES.forEach((source, i) => {
            emitters.x[i] = source.nx * width;
            emitters.y[i] = source.ny * height;
            emitters.amp[i] = source.amp;
        });
    };

    /** @param {number} t */
    const draw = (t) => {
        if (!cols) return;
        ctx.clearRect(0, 0, cols * cellW, rows * CELL);
        buckets.forEach((list) => { list.length = 0; });

        for (let i = 0, gy = 0; gy < rows; gy++) {
            for (let gx = 0; gx < cols; gx++, i++) {
                const v = nodeStrength(emitters, gx * cellW + cellW / 2, gy * CELL + CELL / 2, t);
                const ci = Math.floor(v * (RAMP.length - 1));
                chars[i] = ci;
                if (ci) buckets[Math.min(ALPHA_BUCKETS - 1, Math.floor(v * ALPHA_BUCKETS))]?.push(i);
            }
        }

        ctx.fillStyle = color;
        buckets.forEach((list, b) => {
            ctx.globalAlpha = 0.14 + (b / (ALPHA_BUCKETS - 1)) * 0.86;
            for (const idx of list) {
                const gx = idx % cols;
                const gy = (idx - gx) / cols;
                ctx.fillText(RAMP[chars[idx] ?? 0] ?? ' ', gx * cellW + cellW / 2, gy * CELL + CELL / 2);
            }
        });
        ctx.globalAlpha = 1;
    };

    return { draw, resize, emitters };
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {boolean} reduced
 */
function mount(canvas, reduced) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const painter = createPainter(canvas, ctx);
    const { emitters } = painter;
    const base = SOURCES.length;
    const host = canvas.parentElement ?? canvas;
    const pointer = { x: 0, y: 0, inside: false, amp: 0 };
    let raf = 0;
    let last = 0;
    let t = 0;
    let onScreen = false;

    /** @param {number} time */
    const setPhases = (time) => {
        SOURCES.forEach((source, i) => { emitters.phase[i] = source.phi + source.drift * time; });
    };

    const drawStatic = () => {
        emitters.count = base;
        setPhases(0);
        painter.draw(0);
    };

    /** @param {number} now */
    const frame = (now) => {
        const dt = last ? Math.min(DT_MAX, (now - last) / 1000) : 1 / 60;
        last = now;
        t += dt;
        setPhases(t);
        pointer.amp += ((pointer.inside ? 1 : 0) - pointer.amp) * Math.min(1, dt / POINTER_TAU);
        emitters.count = base;
        if (pointer.amp > 0.001) {
            emitters.x[base] = pointer.x;
            emitters.y[base] = pointer.y;
            emitters.amp[base] = pointer.amp;
            emitters.phase[base] = POINTER_PHASE;
            emitters.count = base + 1;
        }
        painter.draw(t);
        raf = requestAnimationFrame(frame);
    };

    const sync = () => {
        cancelAnimationFrame(raf);
        last = 0;
        if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    };

    painter.resize();
    if (reduced) {
        drawStatic();
        new ResizeObserver(() => { painter.resize(); drawStatic(); }).observe(canvas);
        return;
    }

    new ResizeObserver(() => painter.resize()).observe(canvas);
    new IntersectionObserver(([entry]) => {
        onScreen = entry?.isIntersecting ?? false;
        sync();
    }).observe(canvas);
    document.addEventListener('visibilitychange', sync);

    host.addEventListener('pointermove', (event) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.inside = true;
    });
    host.addEventListener('pointerleave', () => { pointer.inside = false; });
}

export function initNodalLines() {
    const canvases = Array.from(document.querySelectorAll('canvas[data-nodal]'));
    if (!canvases.length || !('IntersectionObserver' in window) || !('ResizeObserver' in window)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // La police mono doit être chargée : la largeur des cases en dépend.
    document.fonts.ready.then(() => {
        canvases.forEach((canvas) => {
            if (canvas instanceof HTMLCanvasElement) mount(canvas, reduced);
        });
    }).catch(() => {
        // Police indisponible : les cartes restent sur leur bleu uni.
    });
}
