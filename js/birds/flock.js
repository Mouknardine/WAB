/**
 * WAB. — La volée
 *
 * Les oiseaux passent à tour de rôle, jamais en bande : deux au plus
 * dans le ciel en même temps, et chacun se repose un moment hors de
 * l'écran avant de revenir. Une page se lit ainsi dans le calme, avec
 * un oiseau qui la traverse de temps à autre.
 *
 * Chaque oiseau porte sa position, sa vitesse, son battement d'ailes
 * et son opacité : celle-ci tombe à zéro quand un texte occupe
 * l'endroit qu'il survole, et remonte dès qu'il l'a dépassé.
 */

import { BODY_COLORS, BODY_BOX } from './frames.js';

const FRAME_MS = 180;      // durée d'un battement d'ailes
const SPEED_MIN = 55;      // px par seconde
const SPEED_MAX = 90;
const MARGIN = 60;         // sortie franche avant la mise au repos
const FADE_MS = 380;       // durée de l'effacement devant un texte

const MAX_IN_FLIGHT = 2;   // jamais plus de deux oiseaux à la fois
const SPACING = 170;       // écart vertical minimal entre deux oiseaux

/* Le repos se compte en traversées : un oiseau reste absent une à
   trois fois plus longtemps qu'il n'a mis à traverser. Le rythme
   reste donc le même sur un grand écran, où la traversée est longue,
   et sur un téléphone, où elle est brève. */
const REST_MIN_RATIO = 0.8;
const REST_MAX_RATIO = 2.2;

const PATIENCE_MS = 900;   // temps caché avant de chercher un couloir
const TRIES = 8;           // hauteurs essayées lors de cette recherche

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function pickColor() {
    return BODY_COLORS[Math.floor(Math.random() * BODY_COLORS.length)];
}

export function createFlock(count) {
    /* Les premiers départs sont échelonnés : le premier oiseau part
       avec la page, les suivants attendent leur tour. */
    const birds = Array.from({ length: count }, (_, index) => ({
        x: 0,
        y: 0,
        speed: 0,
        dir: 1,
        frameIndex: 0,
        frameTimer: Math.random() * FRAME_MS,
        color: BODY_COLORS[index % BODY_COLORS.length],
        opacity: 0,
        hiddenFor: 0,
        airborne: false,
        restFor: index * randomBetween(5000, 11000),
    }));

    function inFlight() {
        return birds.filter((bird) => bird.airborne).length;
    }

    /** Vrai si aucun oiseau en vol ne croise déjà cette hauteur. */
    function isRoomy(bird, y) {
        return birds.every((other) => other === bird
            || !other.airborne
            || Math.abs(other.y - y) > SPACING);
    }

    function box(bird, x, y, sky) {
        // Le dessin est retourné quand l'oiseau va vers la gauche :
        // sa marge vide change de côté.
        const inset = bird.dir === -1
            ? (1 - BODY_BOX.x - BODY_BOX.w) * sky.birdWidth
            : BODY_BOX.x * sky.birdWidth;

        return {
            x: x + inset,
            y: y + BODY_BOX.y * sky.birdHeight,
            w: BODY_BOX.w * sky.birdWidth,
            h: BODY_BOX.h * sky.birdHeight,
        };
    }

    /** Cherche une hauteur dégagée, à l'écart des autres oiseaux. */
    function pickHeight(bird, sky, shyness, x) {
        const ceiling = Math.max(0, sky.height - sky.birdHeight);
        let fallback = Math.random() * ceiling;

        for (let i = 0; i < TRIES; i++) {
            const y = Math.random() * ceiling;
            if (!isRoomy(bird, y)) continue;
            fallback = y;

            const zone = box(bird, x, y, sky);
            if (shyness.isOpen(zone.x, zone.y, zone.w, zone.h)) return y;
        }

        return fallback;
    }

    /** Durée d'une traversée complète, en millisecondes. */
    function crossingTime(sky, speed) {
        const pace = speed || (SPEED_MIN + SPEED_MAX) / 2;
        return (sky.width + sky.birdWidth * 2) / pace * 1000;
    }

    /** Renvoie l'oiseau hors écran pour une ou plusieurs traversées. */
    function sendToRest(bird, sky) {
        bird.airborne = false;
        bird.restFor = crossingTime(sky, bird.speed)
            * randomBetween(REST_MIN_RATIO, REST_MAX_RATIO);
        bird.opacity = 0;
        bird.hiddenFor = 0;
    }

    /** Fait entrer l'oiseau par un bord, à une hauteur tranquille. */
    function launch(bird, sky, shyness) {
        bird.airborne = true;
        bird.restFor = 0;
        bird.dir = Math.random() < 0.5 ? 1 : -1;
        bird.speed = randomBetween(SPEED_MIN, SPEED_MAX);
        bird.color = pickColor();
        bird.opacity = 0;
        bird.hiddenFor = 0;
        bird.x = bird.dir === 1 ? -sky.birdWidth - MARGIN : sky.width + MARGIN;
        bird.y = pickHeight(bird, sky, shyness, bird.x);
    }

    function fade(bird, delta, clear) {
        const step = delta / FADE_MS;
        bird.opacity = clear
            ? Math.min(1, bird.opacity + step)
            : Math.max(0, bird.opacity - step);
        bird.hiddenFor = bird.opacity > 0 ? 0 : bird.hiddenFor + delta;
    }

    /**
     * Un oiseau effacé depuis un moment change de hauteur plutôt que
     * de rester invisible. Comme personne ne le voit à cet instant, le
     * déplacement ne se remarque pas.
     */
    function slipAway(bird, sky, shyness) {
        if (bird.hiddenFor < PATIENCE_MS) return;
        bird.y = pickHeight(bird, sky, shyness, bird.x);
        bird.hiddenFor = 0;
    }

    /**
     * Avance la volée de `delta` millisecondes. `sky` donne les
     * dimensions du calque et du dessin d'un oiseau ; `shyness` dit
     * si un emplacement est lisible et s'il est dégagé.
     */
    function advance(delta, sky, shyness) {
        let flying = inFlight();

        for (const bird of birds) {
            if (!bird.airborne) {
                bird.restFor -= delta;
                if (bird.restFor <= 0 && flying < MAX_IN_FLIGHT) {
                    launch(bird, sky, shyness);
                    flying++;
                } else if (bird.restFor <= 0) {
                    // Le ciel est pris : l'oiseau repart pour un vrai
                    // repos, sinon il se glisserait dans l'écran à la
                    // seconde où un autre en sort et le ciel ne serait
                    // jamais vide.
                    bird.restFor = crossingTime(sky, 0) * randomBetween(0.5, 1.4);
                }
                continue;
            }

            bird.x += bird.speed * bird.dir * (delta / 1000);

            const gone = bird.dir === 1
                ? bird.x > sky.width + MARGIN
                : bird.x < -sky.birdWidth - MARGIN;
            if (gone) {
                sendToRest(bird, sky);
                flying--;
                continue;
            }

            bird.frameTimer += delta;
            if (bird.frameTimer >= FRAME_MS) {
                bird.frameTimer -= FRAME_MS;
                bird.frameIndex = (bird.frameIndex + 1) % 2;
            }

            const zone = box(bird, bird.x, bird.y, sky);
            fade(bird, delta, shyness.canShow(zone.x, zone.y, zone.w, zone.h));
            slipAway(bird, sky, shyness);
        }
    }

    return { birds, advance };
}
