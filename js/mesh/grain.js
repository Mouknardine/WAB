// @ts-check
/**
 * WAB. — Le grain, commun au fond et aux oiseaux
 * Le shader posait son grain sur le fond seul : les oiseaux, dessinés
 * au-dessus, restaient lisses et semblaient collés sur l'image. Le
 * grain passe donc sur son propre calque, au-dessus des oiseaux et
 * sous le contenu, et touche les deux de la même façon.
 *
 * Même bruit que le shader (hash12 de Dave Hoskins), même amplitude.
 * Le calque est fusionné en « plus-lighter » : chaque pixel ajoute
 * sa valeur à ce qui est dessous, exactement comme le shader. Le
 * fond est assombri d'une demi-amplitude pour que la moyenne ne
 * bouge pas (voir index.js).
 */

/**
 * @param {number} x
 * @param {number} y
 * @returns {number} entre 0 et 1
 */
function grainHash(x, y) {
    const fract = (/** @type {number} */ v) => v - Math.floor(v);
    let a = fract(x * 0.1031);
    let b = fract(y * 0.1031);
    let c = fract(x * 0.1031);
    const d = a * (b + 33.33) + b * (c + 33.33) + c * (a + 33.33);
    a += d;
    b += d;
    c += d;
    return fract((a + b) * c);
}

/** Le navigateur sait-il additionner un calque à ce qui est dessous ? */
export function canOverlayGrain() {
    return typeof CSS !== 'undefined' && CSS.supports('mix-blend-mode', 'plus-lighter');
}

/* Le bruit est calculé sur un carré, puis répété sur l'écran : un
   bruit blanc ne laisse voir aucune couture, et un écran Retina de
   27 pouces coûterait sinon quinze millions de pixels à chaque
   redimensionnement. */
const TILE = 256;

/**
 * @param {number} amount amplitude du grain, entre 0 et 1
 * @param {number} seed décalage du motif, celui du shader
 * @returns {HTMLCanvasElement | null}
 */
function paintTile(amount, seed) {
    const tile = document.createElement('canvas');
    tile.width = TILE;
    tile.height = TILE;
    const ctx = tile.getContext('2d');
    if (!ctx) return null;
    const image = ctx.createImageData(TILE, TILE);
    const pixels = image.data;
    for (let row = 0; row < TILE; row += 1) {
        for (let col = 0; col < TILE; col += 1) {
            const i = (row * TILE + col) * 4;
            const noise = grainHash(col + 0.5 + seed * 17, row + 0.5 + seed * 31);
            pixels[i] = 255;
            pixels[i + 1] = 255;
            pixels[i + 2] = 255;
            pixels[i + 3] = Math.round(noise * amount * 255);
        }
    }
    ctx.putImageData(image, 0, 0);
    return tile;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLCanvasElement} tile
 */
function paint(canvas, tile) {
    const ctx = canvas.getContext('2d');
    const pattern = ctx && ctx.createPattern(tile, 'repeat');
    if (!ctx || !pattern) return;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Pose le calque de grain et le redessine quand la fenêtre change
 * de taille. Le motif est fixe : il n'est calculé qu'une fois par
 * taille d'écran.
 * @param {{ amount: number, seed: number, maxRatio: number }} options
 */
export function mountGrain({ amount, seed, maxRatio }) {
    const canvas = document.createElement('canvas');
    canvas.id = 'grainCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    const tile = paintTile(amount, seed);
    if (!tile) return;
    document.body.append(canvas);

    let timer = 0;
    const refresh = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, maxRatio);
        const width = Math.round(canvas.clientWidth * ratio);
        const height = Math.round(canvas.clientHeight * ratio);
        // Calque masqué (fond animé perdu) : rien à dessiner.
        if (!width || !height) return;
        if (canvas.width === width && canvas.height === height) return;
        canvas.width = width;
        canvas.height = height;
        paint(canvas, tile);
    };

    refresh();
    window.addEventListener('resize', () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(refresh, 150);
    }, { passive: true });
}
