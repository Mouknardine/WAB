/**
 * Pluie d'objets dans un seul canvas superposé (billets, cœurs…) : ils
 * partent d'au-dessus de l'écran, sur toute la largeur, et tombent en
 * flottant (balancement, rotation et retournement propres à chacun).
 * Les images ne se chargent qu'à la première pluie. Une pluie par
 * canvas : chaque pluie efface sa toile à chaque image.
 */

const DPR_MAX = 2;

/**
 * @typedef {Object} ReglagePluie
 * @property {string[]} fichiers  images détourées (PNG transparents)
 * @property {[number, number]} nombre  nombre d'objets par pluie (min, max)
 * @property {number} coteMax  plus grand côté affiché sur grand écran, en px
 */

/** @type {ReglagePluie} */
export const PLUIE_BILLETS = {
    fichiers: ['00', '03', '05', '07', '08', '13', '14'].map((n) => `/instrument/assets/billets/billet-${n}.png`),
    nombre: [40, 80],
    coteMax: 140,
};

/**
 * @typedef {Object} Billet
 * @property {HTMLImageElement} img
 * @property {number} x @property {number} y @property {number} vy
 * @property {number} cote  plus grand côté affiché, en px
 * @property {number} balance @property {number} frequence @property {number} phase
 * @property {number} angle @property {number} vitesseAngle
 * @property {number} retournement
 */

/** @param {number} min @param {number} max */
const entre = (min, max) => min + Math.random() * (max - min);

/**
 * @param {string[]} fichiers
 * @returns {Promise<HTMLImageElement[]>} les images chargées (les absentes sont ignorées)
 */
function chargerImages(fichiers) {
    return Promise.all(fichiers.map((src) => new Promise((resoudre) => {
        const img = new Image();
        img.onload = () => resoudre(img);
        img.onerror = () => resoudre(null);
        img.src = src;
    }))).then((liste) => liste.filter((img) => img instanceof HTMLImageElement));
}

/**
 * @param {HTMLCanvasElement} toile
 * @param {ReglagePluie} reglage
 * @returns {() => Promise<void>} lance une pluie
 */
export function creerPluie(toile, reglage) {
    const ctx = toile.getContext('2d');
    /** @type {Promise<HTMLImageElement[]> | null} */
    let images = null;
    /** @type {Billet[]} */
    let billets = [];
    let boucle = 0;
    let avant = 0;

    // Le calque des billets épouse la zone de jeu (tout l'écran au bureau,
    // la bande du milieu sur téléphone) : ses dimensions font foi.
    const largeurZone = () => toile.clientWidth || window.innerWidth;
    const hauteurZone = () => toile.clientHeight || window.innerHeight;

    function dimensionner() {
        const dpr = Math.min(DPR_MAX, window.devicePixelRatio || 1);
        toile.width = Math.round(largeurZone() * dpr);
        toile.height = Math.round(hauteurZone() * dpr);
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /** @param {HTMLImageElement[]} liste @returns {Billet} */
    function nouveauBillet(liste) {
        const hauteur = hauteurZone();
        const img = liste[Math.floor(Math.random() * liste.length)];
        const natif = Math.max(img.naturalWidth, img.naturalHeight);
        // Jusqu'à coteMax sur grand écran, plus petit sur téléphone (16 % de la largeur au plus)
        const plafond = Math.min(reglage.coteMax, largeurZone() * 0.16);
        return {
            img,
            x: entre(-20, largeurZone() + 20),
            y: -entre(40, hauteur * 0.35),
            vy: hauteur / entre(2.5, 4),
            cote: Math.min(plafond, Math.max(plafond * 0.43, natif * entre(0.9, 1.5))),
            balance: entre(15, 55),
            frequence: entre(0.8, 1.8),
            phase: entre(0, Math.PI * 2),
            angle: entre(-Math.PI, Math.PI),
            vitesseAngle: entre(-2.2, 2.2),
            retournement: entre(1.5, 4),
        };
    }

    /** @param {number} maintenant */
    function tourner(maintenant) {
        if (!ctx) return;
        const dt = Math.min(0.05, (maintenant - avant) / 1000);
        avant = maintenant;
        ctx.clearRect(0, 0, largeurZone(), hauteurZone());
        const t = maintenant / 1000;
        billets = billets.filter((b) => b.y < hauteurZone() + b.cote);
        for (const b of billets) {
            b.y += b.vy * dt;
            b.angle += b.vitesseAngle * dt;
            const x = b.x + Math.sin(t * b.frequence + b.phase) * b.balance;
            const echelle = b.cote / Math.max(b.img.naturalWidth, b.img.naturalHeight);
            const l = b.img.naturalWidth * echelle;
            const h = b.img.naturalHeight * echelle;
            ctx.save();
            ctx.translate(x, b.y);
            ctx.rotate(b.angle);
            ctx.scale(Math.cos(t * b.retournement + b.phase) || 0.05, 1);
            ctx.drawImage(b.img, -l / 2, -h / 2, l, h);
            ctx.restore();
        }
        boucle = billets.length ? requestAnimationFrame(tourner) : 0;
        if (!boucle) ctx.clearRect(0, 0, largeurZone(), hauteurZone());
    }

    return async () => {
        if (!ctx) return;
        images ??= chargerImages(reglage.fichiers);
        const liste = await images;
        if (!liste.length) return;
        if (!boucle) dimensionner();
        const nombre = Math.round(entre(reglage.nombre[0], reglage.nombre[1]));
        for (let i = 0; i < nombre; i += 1) billets.push(nouveauBillet(liste));
        if (!boucle) {
            avant = performance.now();
            boucle = requestAnimationFrame(tourner);
        }
    };
}
