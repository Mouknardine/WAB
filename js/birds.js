/**
 * WAB. — Oiseaux en pixel art du hero
 * Quatre oiseaux traversent le ciel rose en boucle. L'animation
 * se met en pause dès que le hero quitte l'écran ou que l'onglet
 * passe en arrière-plan, et se fige si le visiteur a demandé à
 * son système de réduire les animations.
 */
(function () {
    'use strict';

    function initBirds() {
        const canvas = document.getElementById('birdCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.imageSmoothingEnabled = false;

        /* Taille proportionnee a l'ecran : a 7 pixels par point, un
           oiseau fait 224px de large et couvre plus de la moitie d'un
           telephone. Tolerable quand il ne volait que dans le hero,
           beaucoup trop lourd maintenant qu'il traverse le texte. */
        function scaleForWidth(width) {
            if (width < 600) return 4;
            if (width < 1000) return 5;
            return 7;
        }

        let SCALE = scaleForWidth(window.innerWidth);
        const FRAME_MS = 180;
        const BIRD_COUNT = 4;
        const SPEED_MIN = 55;
        const SPEED_MAX = 90;
        const COLS = 32;
        const ROWS = 28;

        const BASE_COLORS = [
            '#2EA8E0', // bleu
            '#4CAF50', // vert
            '#F5A623', // orange
            '#E040FB', // violet
            '#F06292', // rose
            '#FF5252', // rouge
            '#FFEB3B', // jaune
        ];

        const COLORS = { K: '#000000', W: '#FFFFFF', Y: '#F5A623' };

        const FRAMES = [
            // FRAME 0 — ailes en haut
            [
                "....K...........................",
                "...KBKKKK.....KKKK..............",
                "...KBBBBBK...KBBBBK.............",
                "....KBBBBBK.KBBBBBBK............",
                "...KBBBBBBBKBBBBBBBBK...........",
                "....KKBBBBBKBBBWWWWBK...........",
                "....KBBBBBBBBBWWWKWWK...........",
                ".....KBBBBBBBBWWWWWWYK..........",
                "......KKBBWWWBBWWWWKK...........",
                ".KKKKKKKKWWWWWWWWKK.............",
                ".KBBBBBBWWWWWWWWWBK.............",
                "..KBBBBBWWWWWWWWBBBK............",
                "...KBBBBBWWWWWBBBBBK............",
                "..KBBBBBKKKKKKBBBBBBKK..........",
                "...KKBBK.....KBBBBBBBBK.........",
                "....KBK.......KBKBBBKK..........",
                ".....K.........KKBKBBK..........",
                ".................K.KK...........",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
            ],
            // FRAME 1 — ailes en bas
            [
                "................................",
                "................................",
                "................................",
                "................................",
                "...............KKKK.............",
                "..............KBBBBK............",
                ".............KBBBBBBK...........",
                "............KBBBBBBBBK..........",
                "...........KKBBBBWWWBK..........",
                "..........KBBBBBWWKWWK..........",
                ".........KBBBBBWWWWWWYK.........",
                ".......KKBBBBBBWWWWWKK..........",
                "..KKKKKKBBWWWBBKWWKK............",
                "..KBBBBBBWWWKBBBKWKK............",
                "...KBBBBBWWKBBBBBBBBK...........",
                "....KBBBBBWKBBBBBBBBK...........",
                "...KBBBBBKKKKBBBBBBBBK..........",
                "....KKBBK...KBBBBBBBBK..........",
                ".....KBK.....KBBBBBBK...........",
                "......K.......KKKBBBBK..........",
                "................KKKKK...........",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
            ],
        ];

        const FRAME_SEQUENCE = [0, 1];
        let BIRD_W = COLS * SCALE;
        let BIRD_H = ROWS * SCALE;

        /* Chaque combinaison image x couleur est peinte une seule fois
           dans un canevas hors ecran, puis recopiee d'un bloc. Sans ce
           cache, les quatre oiseaux redessineraient environ 1500 petits
           rectangles a chaque image : negligeable tant que l'animation
           se limitait au hero, mais elle tourne desormais en continu
           derriere toute la page. */
        const sprites = new Map();

        function spriteFor(frameIndex, bodyColor) {
            const key = frameIndex + '|' + bodyColor;
            const cached = sprites.get(key);
            if (cached) return cached;

            const sprite = document.createElement('canvas');
            sprite.width = BIRD_W;
            sprite.height = BIRD_H;

            const sctx = sprite.getContext('2d');
            const frameData = FRAMES[frameIndex];
            for (let row = 0; row < ROWS; row++) {
                const line = frameData[row];
                for (let col = 0; col < COLS; col++) {
                    const ch = line[col];
                    if (ch === '.' || ch === undefined) continue;
                    sctx.fillStyle = ch === 'B' ? bodyColor : COLORS[ch];
                    sctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
                }
            }

            sprites.set(key, sprite);
            return sprite;
        }

        function drawBird(frameIndex, birdX, birdY, bodyColor, flipped) {
            ctx.save();
            if (flipped) {
                ctx.translate(Math.floor(birdX) + BIRD_W, Math.floor(birdY));
                ctx.scale(-1, 1);
            } else {
                ctx.translate(Math.floor(birdX), Math.floor(birdY));
            }
            ctx.drawImage(spriteFor(frameIndex, bodyColor), 0, 0);
            ctx.restore();
        }

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const next = scaleForWidth(canvas.width);
            if (next !== SCALE) {
                SCALE = next;
                BIRD_W = COLS * SCALE;
                BIRD_H = ROWS * SCALE;
                sprites.clear();
            }
        }

        resizeCanvas();

        function createBird(index) {
            const dir = index % 2 === 0 ? 1 : -1; // alternance gauche/droite
            const lane = canvas.width / BIRD_COUNT;
            return {
                x: dir === 1
                    ? lane * index + Math.random() * (lane * 0.6)
                    : canvas.width - lane * (index - 1) - Math.random() * (lane * 0.6),
                y: canvas.height * 0.03 + Math.random() * (canvas.height * 0.75),
                speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
                dir: dir,
                frameIndex: Math.round(Math.random()),
                frameTimer: Math.random() * FRAME_MS,
                color: BASE_COLORS[index % BASE_COLORS.length],
            };
        }

        const birds = Array.from({ length: BIRD_COUNT }, (_, i) => createBird(i));

        let lastTime = performance.now();
        let needsResize = false;
        let running = false;
        let rafId = null;

        function respawn(bird) {
            bird.y = canvas.height * 0.03 + Math.random() * (canvas.height * 0.75);
            bird.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
            bird.color = BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)];
        }

        function animate(now) {
            const delta = Math.min(now - lastTime, 100);
            lastTime = now;

            if (needsResize) {
                resizeCanvas();
                needsResize = false;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const bird of birds) {
                bird.x += bird.speed * bird.dir * (delta / 1000);

                if (bird.dir === 1 && bird.x > canvas.width + 50) {
                    bird.x = -BIRD_W - Math.random() * 300;
                    respawn(bird);
                } else if (bird.dir === -1 && bird.x < -BIRD_W - 50) {
                    bird.x = canvas.width + Math.random() * 300;
                    respawn(bird);
                }

                bird.frameTimer += delta;
                if (bird.frameTimer >= FRAME_MS) {
                    bird.frameTimer -= FRAME_MS;
                    bird.frameIndex = (bird.frameIndex + 1) % FRAME_SEQUENCE.length;
                }

                drawBird(FRAME_SEQUENCE[bird.frameIndex], bird.x, bird.y, bird.color, bird.dir === -1);
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

        function syncPlayback() {
            if (document.hidden) stop();
            else start();
        }

        /* Mouvement réduit : les oiseaux sont dessinés une seule fois,
           dans le haut du ciel, et ne bougent plus. La scène garde sa
           personnalité sans imposer d'animation continue à quelqu'un
           qui a demandé à son système de les limiter. */
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        function drawStill() {
            stop();
            resizeCanvas();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Les positions sont exprimées sur la largeur réellement
            // disponible (largeur du canvas moins celle d'un oiseau) :
            // aucun oiseau n'est coupé par le bord, même sur un écran
            // de 320px. Sous deux largeurs d'oiseau, on n'en garde qu'un.
            const libre = Math.max(0, canvas.width - BIRD_W);
            const perches = canvas.width < BIRD_W * 2
                ? [{ fx: 0.5, fy: 0.12, color: BASE_COLORS[0], flipped: false }]
                : [
                    { fx: 0.05, fy: 0.13, color: BASE_COLORS[0], flipped: false },
                    { fx: 0.60, fy: 0.05, color: BASE_COLORS[3], flipped: true },
                    { fx: 1.00, fy: 0.28, color: BASE_COLORS[1], flipped: false },
                ];

            for (const perche of perches) {
                drawBird(0, libre * perche.fx, canvas.height * perche.fy, perche.color, perche.flipped);
            }
        }

        function applyMotionPreference() {
            if (motionQuery.matches) drawStill();
            else syncPlayback();
        }

        applyMotionPreference();

        if (typeof motionQuery.addEventListener === 'function') {
            motionQuery.addEventListener('change', applyMotionPreference);
        }

        document.addEventListener('visibilitychange', () => {
            if (!motionQuery.matches) syncPlayback();
        });

        window.addEventListener('resize', () => {
            if (motionQuery.matches) drawStill();
            else needsResize = true;
        }, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', initBirds);
})();
