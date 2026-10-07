/**
 * WAB. — L'oiseau de la barre de menus
 * Un oiseau du ciel du site dessiné en petit, au centre de la barre :
 * la signature du studio ; d'autres sont posés sur les touches du pied
 * de page. Chacun bat des ailes tant que son hôte (lien, bouton ou
 * élément [data-perch-host]) est survolé ou a le focus.
 *
 *   <canvas data-perch="flap" data-scale="1" data-color="4"></canvas>
 *
 * data-scale : taille du point de dessin.
 * data-color : rang de la couleur dans BODY_COLORS.
 *
 * Sous « réduire les animations », l'oiseau reste immobile.
 */

import { createSpriteBank } from './sprites.js?v=7';
import { BODY_COLORS } from './frames.js?v=10';

const BEAT_MS = 110;

const sprites = createSpriteBank();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setupPerch(canvas) {
    const scale = Number(canvas.dataset.scale) || 4;
    const color = BODY_COLORS[Number(canvas.dataset.color) % BODY_COLORS.length] || BODY_COLORS[0];

    // Surface de dessin et taille affichée identiques : le pixel art
    // reste net.
    canvas.width = sprites.widthAt(scale);
    canvas.height = sprites.heightAt(scale);
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    let rafId = 0;

    function draw(frameIndex) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sprites.draw(ctx, { x: 0, y: 0, scale, dir: 1, frameIndex, color }, 1);
    }

    function land() {
        cancelAnimationFrame(rafId);
        rafId = 0;
        draw(0);
    }

    function flap() {
        if (reducedMotion.matches || rafId) return;
        const start = performance.now();
        // Le premier horodatage peut précéder `start` : jamais de
        // temps négatif, sinon l'image d'ailes demandée n'existe pas.
        const tick = (now) => {
            draw(Math.floor(Math.max(0, now - start) / BEAT_MS) % 2);
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
    }

    land();
    const host = canvas.closest('a, button, [data-perch-host]') || canvas;
    host.addEventListener('pointerenter', flap);
    host.addEventListener('pointerleave', land);
    host.addEventListener('focusin', flap);
    host.addEventListener('focusout', land);
}

document.querySelectorAll('canvas[data-perch]').forEach(setupPerch);
