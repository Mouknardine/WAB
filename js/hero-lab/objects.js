/* ============================================
   Hero 3D (essai) — le catalogue des objets et leurs fabriques.
   Ici, deux familles (les objets en relief sont dans models.js) :
   — les personnages, en images détourées posées sur des plans (le procédé
     d'agentcard : vus de profil, ils deviennent un trait) ;
   — les fenêtres du studio, en vraie 3D, avec les captures des sites.
   Pour remplacer un objet par un rendu Endless Tools : déposer le PNG
   ou le WebP détouré dans assets/hero-lab/ et changer `src` ci-dessous.
   ============================================ */

import {
    CanvasTexture,
    DoubleSide,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshPhysicalMaterial,
    PlaneGeometry,
    RoundedBoxGeometry,
    SRGBColorSpace,
    TextureLoader,
} from '../vendor/three-hero.js';

const DIR = 'assets/hero-lab/';

/* h : hauteur à l'échelle 1 (le texte fait une unité de haut) ;
   n : nombre d'exemplaires dans l'orbite sur grand écran. */
export const SPRITES = [
    { src: 'frog.webp', h: 1.7, n: 3 },
    { src: 'cat.webp', h: 1.3, n: 2 },
    { src: 'psyduck.webp', h: 1.3, n: 3 },
];

/* Les fenêtres : vraies captures du travail, nom du site dans la barre. */
export const WINDOWS = [
    { src: 'assets/images/shot-zinema-800.webp', label: 'zinema.ch' },
    { src: 'assets/images/shot-amarte-800.webp', label: 'amarte.ch' },
    { src: 'assets/images/shot-dj-800.webp', label: 'lazizze.com' },
    { src: 'assets/images/shot-alliani-800.webp', label: 'maison-alliani.com' },
    { src: 'assets/images/shot-central-800.webp', label: 'lepetitcentral.ch' },
    { src: DIR + 'desktop.webp', label: 'bureau.png' },
];

const loader = new TextureLoader();

/* Les matériaux pleins ne sont transparents que le temps d'apparaître :
   la scène les repasse en opaques ensuite (tri et profondeur corrects). */
function solid(material) {
    material.userData.solid = true;
    return material;
}

function loadTexture(url, renderer) {
    return new Promise((resolve) => {
        loader.load(url, (tex) => {
            tex.colorSpace = SRGBColorSpace;
            tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
            resolve(tex);
        }, undefined, () => resolve(null));
    });
}

/* Une image détourée sur un plan. Le matériau commence transparent :
   la scène le fait apparaître à l'arrivée. */
export async function makeSprite(def, renderer) {
    const tex = await loadTexture(DIR + def.src, renderer);
    if (!tex) return null;
    const ratio = tex.image.width / tex.image.height;
    const geo = new PlaneGeometry(def.h * ratio, def.h);
    return (count) => Array.from({ length: count }, () => new Mesh(geo, new MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        alphaTest: 0.02,
        depthWrite: false,
        side: DoubleSide,
        toneMapped: false,
    })));
}

/* Les bleus des fenêtres du site, en sRGB pour le canvas. */
const KLEIN_TINT = '#ccdbff';
const KLEIN_INK = '#1520b8';

/* Une fenêtre du studio : barre bleu clair, nom du site en Sligoil,
   capture dessous ; posée sur une plaque blanche à bords arrondis. */
export async function makeWindow(def, renderer) {
    const tex = await loadTexture(def.src, renderer);
    if (!tex) return null;
    const img = tex.image;
    const W = 800;
    const BAR = 44;
    const H = Math.round(W * img.height / img.width) + BAR;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = KLEIN_TINT; g.fillRect(0, 0, W, BAR);
    g.fillStyle = KLEIN_INK;
    g.font = '500 20px Sligoil, ui-monospace, monospace';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(def.label, W / 2, BAR / 2 + 1);
    g.textAlign = 'left'; g.fillText('↳', 18, BAR / 2 + 1);
    g.textAlign = 'right'; g.fillText('[*]', W - 18, BAR / 2 + 1);
    g.drawImage(img, 0, BAR, W, H - BAR);
    const screen = new CanvasTexture(c);
    screen.colorSpace = SRGBColorSpace;
    screen.anisotropy = tex.anisotropy;
    tex.dispose();

    const w = 1.5;
    const h = w * H / W;
    const slab = new RoundedBoxGeometry(w + 0.08, h + 0.08, 0.07, 4, 0.045);
    const face = new PlaneGeometry(w, h);
    const body = new MeshPhysicalMaterial({ color: 0xf3f4f8, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25, transparent: true, opacity: 0 });
    return (count) => Array.from({ length: count }, () => {
        const group = new Group();
        const shell = new Mesh(slab, solid(body.clone()));
        const glass = new Mesh(face, solid(new MeshBasicMaterial({ map: screen, toneMapped: false, transparent: true, opacity: 0 })));
        glass.position.z = 0.0365;
        group.add(shell, glass);
        return group;
    });
}
