/**
 * WAB. — Oiseaux posés
 * Un oiseau du ciel du site, posé dans la page plutôt que dans le
 * fond : sur la case libre des réalisations, sur la page 404.
 *
 *   <canvas class="perch" data-perch data-scale="4" data-color="4"></canvas>
 *
 * data-scale : taille du point de dessin (2 à 6).
 * data-color : rang de la couleur dans BODY_COLORS.
 * data-perch="flap" : bat des ailes tant que le lien parent est survolé.
 * data-perch="fly"  : au clic, s'envole, puis revient se poser.
 *   Dans une carte marquée data-perch-host (accueil), il s'envole aussi
 *   quand la souris entre dans la carte.
 *
 * Partout, un événement « perch:fly » envoyé au canevas le fait
 * s'envoler (accueil : la fenêtre sur laquelle il est posé bouge).
 * setupPerch est exportée pour les fenêtres créées après le chargement.
 *
 * Sous « réduire les animations », l'oiseau reste posé, immobile.
 */

import { createSpriteBank } from './sprites.js?v=6';
import { BODY_COLORS } from './frames.js?v=7';

const BEAT_MS = 110;
const FLY_MS = 900;
const RETURN_DELAY_MS = 700;

const sprites = createSpriteBank();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function setupPerch(canvas) {
    if (canvas.dataset.perchReady) return;
    canvas.dataset.perchReady = 'true';
    const scale = Number(canvas.dataset.scale) || 4;
    const color = BODY_COLORS[Number(canvas.dataset.color) % BODY_COLORS.length] || BODY_COLORS[0];
    const width = sprites.widthAt(scale);
    const height = sprites.heightAt(scale);

    // Surface de dessin et taille affichée identiques : le pixel art
    // reste net. Le vol a besoin d'air au-dessus : on double la hauteur
    // pour les oiseaux qui s'envolent, et deux largeurs
    // d'oiseau suffisent : le cadre tient sur un écran de 320 px.
    const flies = canvas.dataset.perch === 'fly';
    canvas.width = flies ? width * 2 : width;
    canvas.height = flies ? height * 2 : height;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    // Posé au centre de son cadre ; celui qui s'envole se pose au bord
    // gauche, aligné sur le texte, et garde l'air libre à sa droite.
    const rest = { x: flies ? 0 : (canvas.width - width) / 2, y: canvas.height - height };
    let rafId = 0;

    function draw(x, y, frameIndex, dir = 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sprites.draw(ctx, { x, y, scale, dir, frameIndex, color }, 1);
    }

    function stop() {
        cancelAnimationFrame(rafId);
        rafId = 0;
    }

    function land() {
        stop();
        draw(rest.x, rest.y, 0);
    }

    function flap() {
        if (reducedMotion.matches || rafId) return;
        const start = performance.now();
        // Le premier horodatage peut précéder `start` : jamais de
        // temps négatif, sinon l'image d'ailes demandée n'existe pas.
        const tick = (now) => {
            draw(rest.x, rest.y, Math.floor(Math.max(0, now - start) / BEAT_MS) % 2);
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
    }

    /* L'envol : l'oiseau part vers le haut à droite et sort du cadre,
       attend un instant, puis revient de la gauche se reposer. */
    function flyAway() {
        if (reducedMotion.matches || rafId) return;
        const start = performance.now();
        const total = FLY_MS * 2 + RETURN_DELAY_MS;

        const tick = (now) => {
            const elapsed = Math.max(0, now - start);
            const frameIndex = Math.floor(elapsed / (BEAT_MS * 0.7)) % 2;

            if (elapsed < FLY_MS) {
                const t = elapsed / FLY_MS;
                draw(rest.x + t * t * canvas.width, rest.y - t * canvas.height, frameIndex);
            } else if (elapsed < FLY_MS + RETURN_DELAY_MS) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else if (elapsed < total) {
                const t = (elapsed - FLY_MS - RETURN_DELAY_MS) / FLY_MS;
                const ease = 1 - (1 - t) ** 3;
                draw(-width + ease * (rest.x + width), rest.y - (1 - ease) * canvas.height * 0.8, frameIndex);
            } else {
                land();
                return;
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
    }

    land();

    if (canvas.dataset.perch === 'flap') {
        const host = canvas.closest('a, button') || canvas;
        host.addEventListener('pointerenter', flap);
        host.addEventListener('pointerleave', land);
        host.addEventListener('focusin', flap);
        host.addEventListener('focusout', land);
    }

    if (flies) {
        const host = canvas.closest('button') || canvas;
        host.addEventListener('click', flyAway);
        canvas.addEventListener('perch:fly', flyAway);
    }

    // data-perch-host sur une carte : l'oiseau s'envole quand la souris
    // entre dans la carte (accueil). Au doigt, pas de survol : il reste
    // posé. Sous « réduire les animations », flyAway ne fait rien.
    const card = flies ? canvas.closest('[data-perch-host]') : null;
    if (card && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        card.addEventListener('pointerenter', flyAway);
    }
}

document.querySelectorAll('canvas[data-perch]').forEach(setupPerch);
