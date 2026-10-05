/* ============================================
   Hero 3D (essai) — les objets en vrai relief, construits dans la scène.
   Ils partagent la lumière du titre : c'est ce qui les fait tenir ensemble.
   Deux matières seulement : plastique laqué et fourrure (le nuage).
   Les contours viennent des SVG de assets/hero-lab/svg/ (ceux préparés
   pour Endless Tools) ; la reine est tournée, le téléphone dessiné ici.
   Chaque fabrique rend un modèle ; la scène le clone (géométries et
   matériaux partagés entre les exemplaires).
   ============================================ */

import {
    Box3,
    CanvasTexture,
    DataTexture,
    ExtrudeGeometry,
    Group,
    LatheGeometry,
    Mesh,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    NearestFilter,
    RepeatWrapping,
    SRGBColorSpace,
    SVGLoader,
    Shape,
    ShapeGeometry,
    SphereGeometry,
    Vector2,
    Vector3,
} from '../vendor/three-hero.js';

const SVG_DIR = 'assets/hero-lab/svg/';

/* ── Matières ── */

function lacquer(color, extra = {}) {
    return new MeshPhysicalMaterial({
        color,
        roughness: 0.24,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        ...extra,
    });
}

/* Paillettes : un fond grené et des points de lumière, en répétition. */
function glitter(base, spark) {
    const S = 256;
    const make = (paint) => {
        const c = document.createElement('canvas');
        c.width = c.height = S;
        paint(c.getContext('2d'));
        const t = new CanvasTexture(c);
        t.wrapS = t.wrapT = RepeatWrapping;
        t.repeat.set(1 / 110, 1 / 110);
        return t;
    };
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const map = make((g) => {
        g.fillStyle = base;
        g.fillRect(0, 0, S, S);
        for (let i = 0; i < 5000; i++) {
            const v = rnd();
            g.fillStyle = v < 0.5 ? `rgba(0,0,0,${0.35 * rnd()})` : `rgba(255,255,255,${0.4 * rnd()})`;
            g.fillRect(rnd() * S, rnd() * S, 3, 3);
        }
    });
    map.colorSpace = SRGBColorSpace;
    const glow = make((g) => {
        g.fillStyle = '#000';
        g.fillRect(0, 0, S, S);
        g.fillStyle = spark;
        for (let i = 0; i < 260; i++) {
            const d = rnd() < 0.8 ? 3 : 5;
            g.fillRect(rnd() * S, rnd() * S, d, d);
        }
    });
    glow.colorSpace = SRGBColorSpace;
    return new MeshPhysicalMaterial({
        map,
        emissive: 0xffffff,
        emissiveMap: glow,
        emissiveIntensity: 1.6,
        roughness: 0.38,
        metalness: 0.5,
        clearcoat: 0.7,
        clearcoatRoughness: 0.2,
    });
}

/* Fourrure en coques : la même forme répétée en couches de plus en plus
   gonflées ; chaque couche ne garde que les poils assez longs (bruit). */
let furNoise = null;
function furLayers(geometry, { color, layers = 22, length = 0.07 }) {
    if (!furNoise) {
        const N = 256;
        const data = new Uint8Array(N * N * 4);
        for (let i = 0; i < N * N; i++) {
            const v = Math.floor(Math.pow(Math.random(), 0.8) * 255);
            data.set([v, v, v, 255], i * 4);
        }
        furNoise = new DataTexture(data, N, N);
        furNoise.wrapS = furNoise.wrapT = RepeatWrapping;
        furNoise.magFilter = furNoise.minFilter = NearestFilter;
        furNoise.needsUpdate = true;
    }
    const group = new Group();
    for (let i = 0; i < layers; i++) {
        const h = i / (layers - 1);
        const m = new MeshStandardMaterial({ color, roughness: 1, metalness: 0 });
        m.onBeforeCompile = (shader) => {
            shader.uniforms.uH = { value: h };
            shader.uniforms.uLen = { value: length };
            shader.uniforms.uNoise = { value: furNoise };
            shader.vertexShader = shader.vertexShader
                .replace('#include <common>', '#include <common>\nuniform float uH;\nuniform float uLen;\nvarying vec3 vFur;')
                .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += normalize(objectNormal) * uH * uLen;\ntransformed.y -= uH * uH * uLen * 0.35;\nvFur = position;');
            shader.fragmentShader = shader.fragmentShader
                .replace('#include <common>', '#include <common>\nuniform float uH;\nuniform sampler2D uNoise;\nvarying vec3 vFur;')
                .replace('#include <color_fragment>', [
                    '#include <color_fragment>',
                    'float strand = texture2D(uNoise, vFur.xy * 0.75 + vFur.z * 0.31).r;',
                    'if (uH > 0.0 && strand < uH * 0.92 + 0.04) discard;',
                    'diffuseColor.rgb *= mix(0.52, 1.08, uH);',
                ].join('\n'));
        };
        m.customProgramCacheKey = () => 'wab-fur';
        group.add(new Mesh(geometry, m));
    }
    return group;
}

/* ── Géométrie ── */

/* Lisse les normales d'une extrusion (non indexée) : les sommets confondus
   prennent la moyenne de leurs normales, l'objet paraît gonflé. */
function smooth(geo) {
    const pos = geo.attributes.position;
    const nor = geo.attributes.normal;
    const sums = new Map();
    const key = (i) => `${Math.round(pos.getX(i) * 1e3)},${Math.round(pos.getY(i) * 1e3)},${Math.round(pos.getZ(i) * 1e3)}`;
    for (let i = 0; i < pos.count; i++) {
        const k = key(i);
        const s = sums.get(k) || [0, 0, 0];
        s[0] += nor.getX(i); s[1] += nor.getY(i); s[2] += nor.getZ(i);
        sums.set(k, s);
    }
    for (let i = 0; i < pos.count; i++) {
        const s = sums.get(key(i));
        const l = Math.hypot(s[0], s[1], s[2]) || 1;
        nor.setXYZ(i, s[0] / l, s[1] / l, s[2] / l);
    }
    nor.needsUpdate = true;
    return geo;
}

/* Une forme en coussin : peu d'épaisseur, un grand chanfrein arrondi. */
function cushion(shapes, { depth, bevel, size, seg = 8, curve = 20 }) {
    return smooth(new ExtrudeGeometry(shapes, {
        depth,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: size,
        bevelSegments: seg,
        curveSegments: curve,
    }));
}

/* Des unités SVG (y vers le bas) aux unités de la scène, centré sur le
   cadre du SVG. Retourner y et z ensemble garde les faces à l'endroit. */
function fromSvg(geo, view, height, dx = 0, dy = 0) {
    const k = height / view.h;
    geo.translate(dx - view.w / 2, dy - view.h / 2, 0);
    geo.scale(k, -k, -k);
    return geo;
}

/* Pose une pièce devant une autre : sa face arrière touche la face avant. */
function stackOn(front, back, overlap = 0.3) {
    back.computeBoundingBox();
    front.computeBoundingBox();
    const b = back.boundingBox;
    const f = front.boundingBox;
    front.translate(0, 0, b.max.z - f.min.z - (f.max.z - f.min.z) * overlap);
    return front;
}

function centered(group) {
    const c = new Box3().setFromObject(group).getCenter(new Vector3());
    for (const child of group.children) child.position.sub(c);
    return group;
}

const svgCache = new Map();
async function svg(name) {
    if (!svgCache.has(name)) {
        svgCache.set(name, fetch(SVG_DIR + name + '.svg').then((r) => r.text()).then((text) => {
            const data = new SVGLoader().parse(text);
            const vb = data.xml.getAttribute('viewBox').split(/\s+/).map(Number);
            return { shapes: data.paths.flatMap((p) => p.toShapes()), view: { w: vb[2], h: vb[3] } };
        }));
    }
    return svgCache.get(name);
}

function roundedRect(x, y, w, h, r) {
    const s = new Shape();
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
}

/* ── Les objets ── */

async function cloud() {
    const { shapes, view } = await svg('nuage');
    const geo = fromSvg(cushion(shapes, { depth: 10, bevel: 30, size: 12, seg: 7, curve: 16 }), view, 0.9);
    return centered(furLayers(geo, { color: 0x93c6ec, layers: 22, length: 0.075 }));
}

async function folder() {
    const { shapes, view } = await svg('dossier');
    const back = fromSvg(cushion(shapes, { depth: 6, bevel: 12, size: 6 }), view, 0.95);
    const front = fromSvg(cushion([roundedRect(0, 74, 320, 186, 24)], { depth: 6, bevel: 14, size: 6 }), view, 0.95);
    stackOn(front, back, 0.35);
    const g = new Group();
    g.add(new Mesh(back, lacquer(0x2f7fd3)), new Mesh(front, lacquer(0x8fd0f6)));
    return centered(g);
}

async function appIcon() {
    const tile = await svg('carreau');
    const letter = await svg('lettre-w');
    const base = fromSvg(cushion(tile.shapes, { depth: 24, bevel: 34, size: 10, seg: 10 }), tile.view, 0.85);
    const w = fromSvg(cushion(letter.shapes, { depth: 10, bevel: 9, size: 2.5, seg: 6 }), letter.view, 0.85);
    stackOn(w, base, 0.45);
    const g = new Group();
    g.add(new Mesh(base, lacquer(0xf6f6f8, { roughness: 0.3 })), new Mesh(w, lacquer(0x161bf2)));
    return centered(g);
}

async function swissFlag() {
    const tile = await svg('carreau');
    const cross = await svg('croix-suisse');
    const base = fromSvg(cushion(tile.shapes, { depth: 12, bevel: 14, size: 6, seg: 6 }), tile.view, 0.85);
    const plus = fromSvg(cushion(cross.shapes, { depth: 6, bevel: 7, size: 2, seg: 5 }), tile.view, 0.85, 20, 20);
    stackOn(plus, base, 0.4);
    const g = new Group();
    g.add(new Mesh(base, glitter('#c8101f', '#ffd6d9')), new Mesh(plus, glitter('#d9dbe2', '#ffffff')));
    return centered(g);
}

async function cursor() {
    const { shapes, view } = await svg('curseur');
    const rim = fromSvg(cushion(shapes, { depth: 6, bevel: 9, size: 10, seg: 6 }), view, 0.72);
    const ink = fromSvg(cushion(shapes, { depth: 6, bevel: 6, size: 0.5, seg: 5 }), view, 0.72);
    stackOn(ink, rim, 0.5);
    const g = new Group();
    g.add(new Mesh(rim, lacquer(0xf7f7f9)), new Mesh(ink, lacquer(0x111216)));
    return centered(g);
}

/* La reine : un profil tourné, la couronne festonnée de perles. */
function queen() {
    const profile = [
        [0, 0], [0.4, 0], [0.43, 0.025], [0.43, 0.075], [0.39, 0.105], [0.35, 0.115], [0.37, 0.15],
        [0.33, 0.19], [0.25, 0.235], [0.2, 0.28], [0.155, 0.42], [0.125, 0.62], [0.11, 0.82],
        [0.115, 0.9], [0.2, 0.93], [0.215, 0.96], [0.16, 0.99], [0.19, 1.02], [0.2, 1.05],
        [0.135, 1.085], [0.15, 1.15], [0.23, 1.27], [0.27, 1.31], [0.255, 1.33], [0.17, 1.3],
        [0.08, 1.3], [0.075, 1.36], [0.11, 1.4], [0.06, 1.44], [0, 1.45],
    ].map(([x, y]) => new Vector2(x, y));
    const mat = lacquer(0xff3d9e, { roughness: 0.16 });
    const g = new Group();
    g.add(new Mesh(new LatheGeometry(profile, 72), mat));
    const pearl = new SphereGeometry(0.034, 16, 12);
    for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const p = new Mesh(pearl, mat);
        p.position.set(Math.cos(a) * 0.262, 1.335, Math.sin(a) * 0.262);
        g.add(p);
    }
    const top = new Mesh(new SphereGeometry(0.07, 24, 16), mat);
    top.position.y = 1.5;
    g.add(top);
    g.scale.setScalar(1.05);
    const wrap = new Group();
    wrap.add(g);
    return centered(wrap);
}

/* Le téléphone : cadre vert métallisé, écran de verrouillage WAB. */
function lockScreen() {
    const W = 600;
    const H = 1250;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#2b34ff');
    grad.addColorStop(1, '#0a0f96');
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#ffffff';
    g.textAlign = 'center';
    g.font = '500 40px "Instrument Sans", system-ui, sans-serif';
    g.fillText('lundi 5 octobre', W / 2, 220);
    g.font = '600 200px "Instrument Sans", system-ui, sans-serif';
    g.fillText('18:18', W / 2, 410);
    g.font = '600 110px "Instrument Sans", system-ui, sans-serif';
    g.fillText('WAB.', W / 2, 1030);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
}

function phone() {
    const w = 0.7;
    const h = 1.44;
    const body = smooth(new ExtrudeGeometry([roundedRect(-w / 2, -h / 2, w, h, 0.12)], {
        depth: 0.05, bevelEnabled: true, bevelThickness: 0.022, bevelSize: 0.012, bevelSegments: 5, curveSegments: 16,
    }));
    body.computeBoundingBox();
    const front = body.boundingBox.max.z;
    const sw = w - 0.05;
    const sh = h - 0.05;
    const screenGeo = new ShapeGeometry(roundedRect(-sw / 2, -sh / 2, sw, sh, 0.1), 16);
    const uv = screenGeo.attributes.uv;
    const pos = screenGeo.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / sw + 0.5, pos.getY(i) / sh + 0.5);
    const wallpaper = lockScreen();
    const screen = new Mesh(screenGeo, new MeshPhysicalMaterial({
        map: wallpaper,
        emissive: 0xffffff,
        emissiveMap: wallpaper,
        emissiveIntensity: 0.35,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
    }));
    screen.position.z = front + 0.001;
    const island = new Mesh(new ShapeGeometry(roundedRect(-0.1, -0.026, 0.2, 0.052, 0.026), 8), new MeshStandardMaterial({ color: 0x050505, roughness: 0.3 }));
    island.position.set(0, h / 2 - 0.085, front + 0.002);
    const g = new Group();
    g.add(new Mesh(body, lacquer(0x6fbf3c, { metalness: 0.55, roughness: 0.3, clearcoat: 0.6 })), screen, island);
    return centered(g);
}

/* n : exemplaires dans l'orbite sur grand écran. */
export const MODELS = [
    { build: cloud, n: 4 },
    { build: folder, n: 3 },
    { build: appIcon, n: 3 },
    { build: swissFlag, n: 3 },
    { build: cursor, n: 3 },
    { build: queen, n: 3 },
    { build: phone, n: 3 },
];
