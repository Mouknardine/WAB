/* ============================================
   Hero 3D (essai) — le catalogue des objets.
   Le procédé d'agentcard : chaque objet est une image détourée posée sur
   un plan, dans un décor fixe ; c'est la caméra qui tourne. Vu de
   profil, un objet devient un trait.
   Pour remplacer un objet par un rendu Endless Tools : déposer le PNG ou
   le WebP détouré dans assets/hero-lab/ et changer `src` ci-dessous.
   ============================================ */

import {
    DoubleSide,
    MeshBasicMaterial,
    PlaneGeometry,
    SRGBColorSpace,
    TextureLoader,
} from '../vendor/three-hero.js';

const DIR = 'assets/hero-lab/';

/* h : hauteur moyenne (le texte fait une unité de haut) ;
   w : poids dans le tirage (part des exemplaires). */
export const SPRITES = [
    { src: 'frog.webp', h: 1.35, w: 3 },
    { src: 'cat.webp', h: 1, w: 3 },
    { src: 'psyduck.webp', h: 1, w: 2 },
    { src: 'queen.webp', h: 1.2, w: 3 },
    { src: 'phone.webp', h: 1.2, w: 3 },
    { src: 'cloud.webp', h: 0.75, w: 3 },
    { src: 'google.webp', h: 0.7, w: 3 },
    { src: 'folder.webp', h: 0.65, w: 3 },
    { src: 'swiss.webp', h: 0.7, w: 3 },
    { src: 'desktop.webp', h: 0.75, w: 2 },
    { src: 'cursor-a.webp', h: 0.75, w: 2 },
    { src: 'cursor-b.webp', h: 0.65, w: 2 },
];

/* Charge les images ; chaque type garde un plan et un matériau partagés
   par tous ses exemplaires. Les bords passent par l'alpha-to-coverage :
   nets, sans tri des transparences. */
export async function loadSprites(renderer) {
    const loader = new TextureLoader();
    const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const kinds = await Promise.all(SPRITES.map((def) => new Promise((resolve) => {
        loader.load(DIR + def.src, (tex) => {
            tex.colorSpace = SRGBColorSpace;
            tex.anisotropy = aniso;
            const ratio = tex.image.width / tex.image.height;
            resolve({
                def,
                geometry: new PlaneGeometry(ratio, 1),
                material: new MeshBasicMaterial({
                    map: tex,
                    side: DoubleSide,
                    alphaToCoverage: true,
                    alphaTest: 0.04,
                    toneMapped: false,
                }),
            });
        }, undefined, () => resolve(null));
    })));
    return kinds.filter(Boolean);
}
