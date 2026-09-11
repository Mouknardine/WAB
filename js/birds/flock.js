/**
 * WAB. — La volée
 * Position, vitesse et battement d'ailes de chaque oiseau. Quand un
 * oiseau sort de l'écran, il repart de l'autre bord avec une nouvelle
 * hauteur, une nouvelle allure et une nouvelle couleur. Son opacité
 * suit la place disponible : elle tombe à zéro quand un texte occupe
 * l'endroit qu'il survole, et remonte dès qu'il l'a dépassé.
 */

import { BODY_COLORS, BODY_BOX } from './frames.js';

const FRAME_MS = 180;    // durée d'un battement d'ailes
const SPEED_MIN = 55;    // px par seconde
const SPEED_MAX = 90;
const MARGIN = 50;       // sortie franche avant réapparition
const FADE_MS = 380;     // durée de l'effacement devant un texte
const PATIENCE_MS = 900; // temps caché avant de chercher un couloir libre
const TRIES = 8;         // hauteurs essayées lors de cette recherche

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

export function createFlock(count, width, height) {
    function newFlight(bird, skyHeight) {
        bird.y = skyHeight * 0.03 + Math.random() * (skyHeight * 0.75);
        bird.speed = randomBetween(SPEED_MIN, SPEED_MAX);
        bird.color = BODY_COLORS[Math.floor(Math.random() * BODY_COLORS.length)];
        return bird;
    }

    function createBird(index) {
        const dir = index % 2 === 0 ? 1 : -1; // alternance gauche/droite
        const lane = width / count;
        return newFlight({
            x: dir === 1
                ? lane * index + Math.random() * (lane * 0.6)
                : width - lane * (index - 1) - Math.random() * (lane * 0.6),
            y: 0,
            speed: 0,
            dir: dir,
            frameIndex: Math.round(Math.random()),
            frameTimer: Math.random() * FRAME_MS,
            color: BODY_COLORS[index % BODY_COLORS.length],
            opacity: 0,   // les oiseaux entrent en douceur
            hiddenFor: 0, // durée passée effacé, en ms
        }, height);
    }

    const birds = Array.from({ length: count }, (_, i) => createBird(i));

    function fade(bird, delta, clear) {
        const step = delta / FADE_MS;
        bird.opacity = clear
            ? Math.min(1, bird.opacity + step)
            : Math.max(0, bird.opacity - step);
        bird.hiddenFor = bird.opacity > 0 ? 0 : bird.hiddenFor + delta;
    }

    /**
     * Un oiseau effacé depuis un moment cherche une hauteur dégagée
     * et s'y installe. Comme il est invisible à cet instant, le
     * déplacement ne se voit pas : il réapparaît simplement là où la
     * page lui laisse de la place.
     */
    function findClearLane(bird, sky, box, shyness) {
        if (bird.hiddenFor < PATIENCE_MS) return;

        const ceiling = Math.max(0, sky.height - sky.birdHeight);
        for (let i = 0; i < TRIES; i++) {
            const y = Math.random() * ceiling;
            if (shyness.isOpen(box.x, y + box.dy, box.w, box.h)) {
                bird.y = y;
                bird.hiddenFor = 0;
                return;
            }
        }

        // Aucun couloir libre pour l'instant : on réessaiera plus tard.
        bird.hiddenFor = 0;
    }

    /**
     * Avance la volée de `delta` millisecondes. `sky` donne les
     * dimensions du calque et du dessin d'un oiseau ; `shyness` dit
     * si un rectangle est lisible et s'il est dégagé.
     */
    function advance(delta, sky, shyness) {
        for (const bird of birds) {
            bird.x += bird.speed * bird.dir * (delta / 1000);

            if (bird.dir === 1 && bird.x > sky.width + MARGIN) {
                bird.x = -sky.birdWidth - Math.random() * 300;
                newFlight(bird, sky.height);
            } else if (bird.dir === -1 && bird.x < -sky.birdWidth - MARGIN) {
                bird.x = sky.width + Math.random() * 300;
                newFlight(bird, sky.height);
            }

            bird.frameTimer += delta;
            if (bird.frameTimer >= FRAME_MS) {
                bird.frameTimer -= FRAME_MS;
                bird.frameIndex = (bird.frameIndex + 1) % 2;
            }

            // Le dessin est retourné quand l'oiseau va vers la
            // gauche : sa marge vide change de côté.
            const inset = bird.dir === -1
                ? (1 - BODY_BOX.x - BODY_BOX.w) * sky.birdWidth
                : BODY_BOX.x * sky.birdWidth;

            const box = {
                x: bird.x + inset,
                dy: BODY_BOX.y * sky.birdHeight,
                w: BODY_BOX.w * sky.birdWidth,
                h: BODY_BOX.h * sky.birdHeight,
            };

            fade(bird, delta, shyness.canShow(box.x, bird.y + box.dy, box.w, box.h));
            findClearLane(bird, sky, box, shyness);
        }
    }

    return { birds, advance };
}
