/**
 * WAB. — La volée
 *
 * Un ciel peuplé. Les oiseaux entrent par les quatre bords, filent
 * ou planent, montent et descendent, puis ressortent et reviennent
 * presque aussitôt. Trois choses les distinguent les uns des autres
 * et donnent la profondeur de l'ensemble :
 *
 *  — la taille. Un oiseau peint à deux points par carré est loin,
 *    un oiseau peint à six est proche.
 *  — la vitesse. Elle suit la taille : le proche traverse l'écran en
 *    quelques secondes, le lointain prend son temps.
 *  — l'opacité. Le lointain est plus pâle, comme derrière un voile
 *    d'air.
 *
 * Devant un texte posé à même le papier, l'oiseau ne disparaît pas :
 * il se voile, le temps de le franchir, puis reprend sa couleur. La
 * ligne reste lisible et le ciel ne se vide jamais.
 */

import { BODY_COLORS, BODY_BOX } from './frames.js?v=5';

/* Deux marges, et la sortie est la plus large des deux. L'oiseau
   naît juste derrière le bord, puis n'est mis au repos qu'une fois
   nettement plus loin : sans cet écart, un oiseau qui apparaît pile
   sur la limite de sortie serait renvoyé au repos à l'image
   suivante, sans jamais avoir été vu. Les deux restent courtes — la
   largeur de l'oiseau s'y ajoute déjà, et sur un téléphone une marge
   de deux cents pixels reviendrait à garder la moitié de la volée
   hors du cadre en permanence. */
const ENTRY_MARGIN = 24;
const EXIT_MARGIN = 80;
const FADE_MS = 300;       // durée du voile devant un texte

/* Part de son opacité que l'oiseau conserve derrière un texte. À
   zéro, il s'effaçait complètement et le ciel se dépeuplait dès
   qu'une page contenait des lignes ; à cette valeur il reste
   visible sans jamais gêner la lecture. */
export const TEXT_DIM = 0.3;

/* Vitesse de croisière avant l'effet de profondeur, en px/s. L'écart
   est volontairement large : c'est lui qui fait qu'aucun oiseau ne
   semble suivre le précédent. */
const SPEED_MIN = 55;
const SPEED_MAX = 250;

/* Battement d'ailes : rapide quand l'oiseau file, lent quand il
   plane. Exprimé en millisecondes par image. */
const BEAT_FAST = 85;
const BEAT_SLOW = 230;

/* Inclinaison d'une trajectoire entrée par le côté, en radians —
   un peu plus de trente degrés de part et d'autre de l'horizontale. */
const TILT_SIDE = 0.55;

/* Entrées par le haut ou par le bas : une descente ou une montée
   franche, entre quarante et soixante-cinq degrés. */
const TILT_VERTICAL_MIN = 0.7;
const TILT_VERTICAL_MAX = 1.15;

/** Part des entrées qui se font par un côté plutôt que par le haut. */
const SIDE_ENTRY_SHARE = 0.76;

/* Ondulation du vol : l'oiseau monte et redescend légèrement le long
   de sa route, sans quoi la trajectoire serait une droite parfaite. */
const BOB_MIN = 5;
const BOB_MAX = 26;
const BOB_PERIOD_MIN = 1300;
const BOB_PERIOD_MAX = 3600;

/* Repos hors champ. Court : le ciel doit rester habité. */
const REST_MIN = 150;
const REST_MAX = 2800;

const TRIES = 5;           // hauteurs essayées au moment du départ

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function pickColor() {
    return BODY_COLORS[Math.floor(Math.random() * BODY_COLORS.length)];
}

/**
 * Tire une taille dans l'échelle fournie, en penchant vers les
 * petites : un ciel où les gros oiseaux sont rares se lit mieux
 * qu'un ciel uniforme.
 */
function pickScaleIndex(levels) {
    const skewed = Math.random() ** 2.1;
    return Math.min(levels - 1, Math.floor(skewed * levels));
}

/**
 * @param {number} count   nombre d'oiseaux dans le ciel
 * @param {number[]} scales échelle des tailles, de la plus lointaine
 *                          à la plus proche
 */
export function createFlock(count, scales) {
    let ladder = scales;
    const birds = [];

    function makeBird(index) {
        return {
            x: 0,
            y: 0,          // position dessinée, ondulation comprise
            routeY: 0,     // hauteur de la route, sans l'ondulation
            vx: 0,
            vy: 0,
            scale: ladder[0],
            width: 0,
            height: 0,
            alpha: 1,      // opacité maximale, fixée par la profondeur
            dir: 1,
            frameIndex: index % 2,
            frameTimer: Math.random() * BEAT_SLOW,
            beatMs: BEAT_SLOW,
            bobAmp: 0,
            bobPeriod: BOB_PERIOD_MAX,
            bobPhase: Math.random() * Math.PI * 2,
            elapsed: 0,
            color: BODY_COLORS[index % BODY_COLORS.length],
            opacity: 0,
            airborne: false,
            // Les départs sont échelonnés : la volée se remplit en
            // quelques secondes au lieu d'apparaître d'un bloc.
            restFor: index * randomBetween(60, 320),
        };
    }

    function setCount(next) {
        while (birds.length < next) birds.push(makeBird(birds.length));
        if (birds.length > next) birds.length = next;
    }

    function setScales(next) {
        ladder = next;
    }

    setCount(count);

    /** Rectangle réellement occupé par le dessin de l'oiseau. */
    function box(bird) {
        const inset = bird.dir === -1
            ? (1 - BODY_BOX.x - BODY_BOX.w) * bird.width
            : BODY_BOX.x * bird.width;

        return {
            x: bird.x + inset,
            y: bird.y + BODY_BOX.y * bird.height,
            w: BODY_BOX.w * bird.width,
            h: BODY_BOX.h * bird.height,
        };
    }

    /** Cherche une hauteur de route dégagée pour une entrée latérale. */
    function pickRoute(bird, sky, shyness) {
        const ceiling = Math.max(1, sky.height - bird.height);
        let fallback = Math.random() * ceiling;

        for (let i = 0; i < TRIES; i++) {
            const y = Math.random() * ceiling;
            fallback = y;
            if (shyness.isOpen(bird.x, y, bird.width, bird.height)) return y;
        }

        return fallback;
    }

    /** Renvoie l'oiseau hors champ pour un court repos. */
    function sendToRest(bird) {
        bird.airborne = false;
        bird.restFor = randomBetween(REST_MIN, REST_MAX);
        bird.opacity = 0;
    }

    /** Fait entrer l'oiseau par un bord, avec sa taille et son allure. */
    function launch(bird, sky, shyness) {
        const index = pickScaleIndex(ladder.length);
        const depth = ladder.length === 1 ? 1 : index / (ladder.length - 1);

        bird.airborne = true;
        bird.restFor = 0;
        bird.scale = ladder[index];
        bird.width = sky.widthAt(bird.scale);
        bird.height = sky.heightAt(bird.scale);
        bird.alpha = 0.5 + 0.5 * depth;
        bird.color = pickColor();
        bird.opacity = 0;
        bird.elapsed = 0;
        bird.bobPhase = Math.random() * Math.PI * 2;
        bird.bobAmp = randomBetween(BOB_MIN, BOB_MAX) * (0.4 + 0.6 * depth);
        bird.bobPeriod = randomBetween(BOB_PERIOD_MIN, BOB_PERIOD_MAX);
        bird.dir = Math.random() < 0.5 ? 1 : -1;

        // Le proche va vite, le lointain plane : c'est cet écart qui
        // creuse la profondeur bien plus que la taille seule.
        const speed = randomBetween(SPEED_MIN, SPEED_MAX) * (0.35 + 0.65 * depth);
        bird.beatMs = BEAT_SLOW - (BEAT_SLOW - BEAT_FAST)
            * Math.min(1, (speed - SPEED_MIN) / (SPEED_MAX - SPEED_MIN));

        let tilt;
        if (Math.random() < SIDE_ENTRY_SHARE) {
            bird.x = bird.dir === 1 ? -bird.width - ENTRY_MARGIN : sky.width + ENTRY_MARGIN;
            bird.routeY = pickRoute(bird, sky, shyness);
            tilt = randomBetween(-TILT_SIDE, TILT_SIDE);
        } else {
            const fromTop = Math.random() < 0.5;
            bird.x = Math.random() * Math.max(1, sky.width - bird.width);
            bird.routeY = fromTop ? -bird.height - ENTRY_MARGIN : sky.height + ENTRY_MARGIN;
            tilt = (fromTop ? 1 : -1) * randomBetween(TILT_VERTICAL_MIN, TILT_VERTICAL_MAX);
        }

        bird.vx = Math.cos(tilt) * speed * bird.dir;
        bird.vy = Math.sin(tilt) * speed;
        bird.y = bird.routeY;
    }

    /**
     * Rapproche l'opacité de sa cible : la pleine couleur en ciel
     * dégagé, le voile devant un texte. La même fonction sert à
     * l'entrée en scène, où l'oiseau part de zéro.
     */
    function fade(bird, delta, clear) {
        const target = clear ? bird.alpha : bird.alpha * TEXT_DIM;
        const step = (delta / FADE_MS) * bird.alpha;
        bird.opacity = bird.opacity < target
            ? Math.min(target, bird.opacity + step)
            : Math.max(target, bird.opacity - step);
    }

    function isGone(bird, sky) {
        return bird.x > sky.width + EXIT_MARGIN
            || bird.x < -bird.width - EXIT_MARGIN
            || bird.y > sky.height + EXIT_MARGIN
            || bird.y < -bird.height - EXIT_MARGIN;
    }

    /**
     * Avance la volée de `delta` millisecondes. `sky` donne les
     * dimensions du calque et la taille d'un oiseau à une échelle
     * donnée ; `shyness` dit si un emplacement est lisible.
     */
    function advance(delta, sky, shyness) {
        const seconds = delta / 1000;

        for (const bird of birds) {
            if (!bird.airborne) {
                bird.restFor -= delta;
                if (bird.restFor <= 0) launch(bird, sky, shyness);
                continue;
            }

            bird.elapsed += delta;
            bird.x += bird.vx * seconds;
            bird.routeY += bird.vy * seconds;
            bird.y = bird.routeY
                + Math.sin(bird.bobPhase + bird.elapsed / bird.bobPeriod * Math.PI * 2) * bird.bobAmp;

            if (isGone(bird, sky)) {
                sendToRest(bird);
                continue;
            }

            bird.frameTimer += delta;
            if (bird.frameTimer >= bird.beatMs) {
                bird.frameTimer -= bird.beatMs;
                bird.frameIndex = (bird.frameIndex + 1) % 2;
            }

            const zone = box(bird);
            fade(bird, delta, shyness.canShow(zone.x, zone.y, zone.w, zone.h));
        }
    }

    return { birds, advance, setCount, setScales };
}
