/* ============================================
   Hero 3D (essai) — « Wearebrothers » en relief au milieu d'un nuage
   d'objets, à la manière d'agentcard.sh.
   Le décor est fixe : c'est la caméra qui tourne autour du titre, d'elle-
   même, puis avec le défilement et la souris. Les objets sont des images
   à plat (objects.js) ; vus de profil, ils deviennent des traits.
   Le titre : Instrument Sans 600, lettres posées une à une pour serrer
   l'approche, en relief profond (face blanche, flancs bleus).
   Sans WebGL : le titre s'affiche en HTML. « Réduire les animations » :
   une image fixe.
   ============================================ */

import {
    Box3,
    Color,
    DirectionalLight,
    ExtrudeGeometry,
    Fog,
    FontLoader,
    Group,
    HemisphereLight,
    MathUtils,
    Mesh,
    MeshPhysicalMaterial,
    NeutralToneMapping,
    PMREMGenerator,
    PerspectiveCamera,
    RoomEnvironment,
    SRGBColorSpace,
    Scene,
    Timer,
    Vector3,
    WebGLRenderer,
} from '../vendor/three-hero.js';
import { loadSprites } from './objects.js';

const stage = document.querySelector('[data-hero3d]');
const canvas = stage?.querySelector('canvas');
const track = document.querySelector('[data-hero3d-track]');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Le titre : pas d'espace, pas de capitales hors la première lettre.
   Sur un écran en hauteur, il passe sur deux lignes, toujours collé. */
const WORD = 'Wearebrothers';
const TRACKING = -0.05;

/* Un hasard à graine fixe : la même composition à chaque visite. */
function seeded(seed) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

init().catch((err) => {
    console.error(err);
    stage?.classList.add('is-fallback');
});

async function init() {
    if (!stage || !canvas) return;

    let renderer;
    try {
        renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
        stage.classList.add('is-fallback');
        return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    /* Le tone mapping neutre garde le bleu Klein bleu (ACES le fait virer au violet). */
    renderer.toneMapping = NeutralToneMapping;

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    const sun = new DirectionalLight(0xffffff, 2.2);
    sun.position.set(2, 7, 6);
    scene.add(sun, new HemisphereLight(0xeef0ff, 0x1820c8, 0.8));

    const camera = new PerspectiveCamera(34, 1, 0.1, 400);

    /* ── Le titre ── */
    const fontData = await fetch('assets/hero-lab/instrument-600.typeface.json').then((r) => r.json());
    const font = new FontLoader().parse(fontData);
    const face = new MeshPhysicalMaterial({ color: 0xf3f4ff, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1 });
    const side = new MeshPhysicalMaterial({ color: 0x2c39ff, roughness: 0.34, clearcoat: 0.5, clearcoatRoughness: 0.25, envMapIntensity: 0.8 });
    const glyphCache = new Map();
    function glyph(ch) {
        if (!glyphCache.has(ch)) {
            glyphCache.set(ch, new ExtrudeGeometry(font.generateShapes(ch, 1), {
                depth: 0.55,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.035,
                bevelSize: 0.02,
                bevelSegments: 4,
            }));
        }
        return glyphCache.get(ch);
    }
    function line(text) {
        const group = new Group();
        let pen = 0;
        for (const ch of text) {
            const g = fontData.glyphs[ch];
            if (!g) continue;
            const mesh = new Mesh(glyph(ch), [face, side]);
            mesh.position.x = pen;
            group.add(mesh);
            pen += g.ha / fontData.resolution + TRACKING;
        }
        return group;
    }
    const title = new Group();
    const portrait = innerWidth / innerHeight < 0.8;
    const rows = portrait ? ['Weare', 'brothers'] : [WORD];
    rows.forEach((text, i) => {
        const row = line(text);
        const box = new Box3().setFromObject(row);
        row.position.x = -(box.min.x + box.max.x) / 2;
        row.position.y = -i * 1.02;
        title.add(row);
    });
    const tb = new Box3().setFromObject(title);
    const tc = tb.getCenter(new Vector3());
    for (const row of title.children) row.position.sub(tc);
    const textW = tb.max.x - tb.min.x;
    const textH = tb.max.y - tb.min.y;
    scene.add(title);

    /* ── Cadrage : de face, le titre occupe une part fixe de la largeur ── */
    let dist = 10;
    function fit() {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const tan = Math.tan(MathUtils.degToRad(camera.fov / 2));
        const share = camera.aspect < 0.8 ? 0.86 : camera.aspect < 1.3 ? 0.78 : 0.66;
        return Math.max(textW / share / (2 * tan * camera.aspect), textH / 0.3 / (2 * tan));
    }
    dist = fit();
    const dist0 = dist;
    scene.fog = new Fog(new Color(0x161bd8), dist * 1.1, dist * 3.4);

    /* ── Le nuage d'objets ──
       Deux zones : à l'intérieur du cercle de la caméra (de 0 à 0,78 fois
       sa distance), et une couronne lointaine qui sert de fond quand la
       caméra passe de l'autre côté. */
    const kinds = await loadSprites(renderer);
    const small = Math.min(innerWidth, innerHeight) < 640;
    const COUNT = small ? 150 : 200;
    const rand = seeded(23);
    const bag = kinds.flatMap((k) => Array(k.def.w).fill(k));
    const field = new Group();
    scene.add(field);
    const items = [];
    /* Le bloc du titre et le couloir devant lui restent libres : à
       l'arrivée, le titre se lit ; en tournant, les objets le croisent. */
    const inTitle = (p) => Math.abs(p.x) < textW / 2 + 0.5 && Math.abs(p.y) < textH / 2 + 0.6 && p.z > -1.2;
    /* Le nuage épouse l'écran : large sur un ordinateur, haut et étroit
       sur un téléphone. */
    const squash = portrait ? new Vector3(0.4, 1, 0.7) : new Vector3(1, 0.62, 1);
    for (let i = 0; i < COUNT; i++) {
        const kind = bag[Math.floor(rand() * bag.length)];
        const near = rand() < (portrait ? 0.82 : 0.66);
        const p = new Vector3();
        for (let tries = 0; tries < 40; tries++) {
            if (near) {
                do p.set(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1); while (p.lengthSq() > 1);
                p.multiply(squash).multiplyScalar(dist * 0.78);
            } else {
                const a = rand() * Math.PI * 2;
                const rad = dist * MathUtils.lerp(1.35, 2.3, rand());
                p.set(Math.sin(a) * rad, (rand() * 2 - 1) * dist * (portrait ? 1.2 : 0.7), Math.cos(a) * rad);
            }
            if (!inTitle(p)) break;
        }
        const mesh = new Mesh(kind.geometry, kind.material);
        const size = kind.def.h * (near ? MathUtils.lerp(0.75, 1.3, rand()) : MathUtils.lerp(1.7, 2.6, rand()));
        mesh.position.copy(p);
        mesh.rotation.set((rand() - 0.5) * 0.9, (rand() - 0.5) * 2, (rand() - 0.5) * 1.1);
        mesh.scale.setScalar(0.0001);
        field.add(mesh);
        items.push({
            mesh,
            base: p.clone(),
            rot: mesh.rotation.clone(),
            size,
            phase: rand() * Math.PI * 2,
            delay: 0.15 + rand() * 0.9,
        });
    }

    function layout() {
        dist = fit();
        /* Le décor suit le cadrage : tout s'éloigne ou se rapproche ensemble. */
        field.scale.setScalar(dist / dist0);
    }
    new ResizeObserver(layout).observe(stage);

    /* ── Souris et défilement ── */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    if (!still) {
        window.addEventListener('pointermove', (e) => {
            pointer.tx = (e.clientX / innerWidth) * 2 - 1;
            pointer.ty = (e.clientY / innerHeight) * 2 - 1;
        }, { passive: true });
    }
    let progress = 0;
    function readScroll() {
        if (!track) return 0;
        const span = track.offsetHeight - innerHeight;
        return span > 0 ? MathUtils.clamp(-track.getBoundingClientRect().top / span, 0, 1) : 0;
    }

    /* ── Boucle ── */
    const timer = new Timer();
    let running = false;
    let raf = 0;

    function frame(now) {
        timer.update(now);
        const t = still ? 6 : timer.getElapsed();

        progress = MathUtils.lerp(progress, readScroll(), still ? 1 : 0.1);
        const p = easeInOut(progress);
        pointer.x = MathUtils.lerp(pointer.x, pointer.tx, 0.04);
        pointer.y = MathUtils.lerp(pointer.y, pointer.ty, 0.04);

        /* L'arrivée : la caméra plonge vers le titre en tournant. */
        const intro = still ? 1 : easeOut(MathUtils.clamp(t / 2.4, 0, 1));

        /* La caméra : un balancement lent d'un côté à l'autre du titre,
           que le défilement pousse jusqu'au profil. */
        const az = -0.34 + Math.sin(t * 0.075) * 0.62 + p * 1.45 + pointer.x * 0.2 + (1 - intro) * 0.9;
        const el = 0.1 + Math.sin(t * 0.05 + 1.2) * 0.13 - p * 0.22 - pointer.y * 0.08 + (1 - intro) * 0.25;
        const d = dist * MathUtils.lerp(1, 0.86, p) * MathUtils.lerp(1.7, 1, intro);
        camera.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
        camera.lookAt(0, 0, 0);

        for (const it of items) {
            const life = still ? 1 : easeOut(MathUtils.clamp((t - it.delay) / 0.9, 0, 1));
            it.mesh.scale.setScalar(it.size * Math.max(life, 0.0001));
            it.mesh.position.y = it.base.y + Math.sin(t * 0.5 + it.phase) * 0.05;
            it.mesh.rotation.z = it.rot.z + Math.sin(t * 0.3 + it.phase) * 0.04;
        }

        renderer.render(scene, camera);
        stage.classList.add('is-ready');
        raf = still ? 0 : requestAnimationFrame(frame);
    }

    function start() {
        if (running || still) return;
        running = true;
        raf = requestAnimationFrame(frame);
    }
    function stop() {
        running = false;
        cancelAnimationFrame(raf);
    }

    if (still) {
        frame(performance.now());
        new ResizeObserver(() => frame(performance.now())).observe(stage);
        return;
    }
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(stage);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    start();
}
