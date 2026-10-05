/* ============================================
   Hero 3D (essai) — « WE ARE BROTHERS » en relief, les objets en orbite.
   Le texte est une vraie géométrie extrudée (Instrument Sans 600, convertie
   en assets/hero-lab/instrument-600.typeface.json). Les objets tournent
   autour, chacun sur son ellipse ; la souris incline la scène, le défilement
   la bascule (comme agentcard.sh) et donne un coup d'accélérateur.
   Sans WebGL : le texte s'affiche en HTML. « Réduire les animations » :
   une image fixe, sans orbite ni bascule.
   ============================================ */

import {
    DirectionalLight,
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
    TextGeometry,
    Timer,
    WebGLRenderer,
} from '../vendor/three-hero.js';
import { SPRITES, WINDOWS, makeSprite, makeWindow } from './objects.js';
import { MODELS } from './models.js';

const stage = document.querySelector('[data-hero3d]');
const canvas = stage?.querySelector('canvas');
const track = document.querySelector('[data-hero3d-track]');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
const easeOutBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
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
    renderer.toneMappingExposure = 1;

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const camera = new PerspectiveCamera(30, 1, 0.1, 200);
    const root = new Group();
    scene.add(root);

    /* Une seule lumière d'en haut, comme les touches du site. */
    const sun = new DirectionalLight(0xffffff, 2.4);
    sun.position.set(1.5, 6, 6);
    scene.add(sun, new HemisphereLight(0xe8ecff, 0x1820c8, 0.9));

    /* Sligoil doit être prête avant de dessiner les barres de fenêtres. */
    await document.fonts?.load('500 20px Sligoil').catch(() => {});

    /* ── Le texte ── */
    const fontData = await fetch('assets/hero-lab/instrument-600.typeface.json').then((r) => r.json());
    const font = new FontLoader().parse(fontData);
    const faceMat = new MeshPhysicalMaterial({ color: 0xf6f7ff, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12 });
    const sideMat = new MeshPhysicalMaterial({ color: 0x161bf2, roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.3, envMapIntensity: 0.7 });
    const title = new Group();
    const LINE_GAP = 0.53;
    let textW = 0;
    ['WE ARE', 'BROTHERS'].forEach((str, i) => {
        const geo = new TextGeometry(str, {
            font,
            size: 1,
            depth: 0.46,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: 0.04,
            bevelSize: 0.026,
            bevelSegments: 5,
        });
        geo.computeBoundingBox();
        const bb = geo.boundingBox;
        geo.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -(bb.min.z + bb.max.z) / 2);
        textW = Math.max(textW, bb.max.x - bb.min.x);
        const mesh = new Mesh(geo, [faceMat, sideMat]);
        mesh.position.y = i === 0 ? LINE_GAP : -LINE_GAP;
        title.add(mesh);
    });
    const textH = LINE_GAP * 2 + 0.75;
    const TITLE_REST = { x: 0.05, y: -0.2, z: 0.09 };
    title.rotation.set(TITLE_REST.x, TITLE_REST.y, TITLE_REST.z);
    root.add(title);

    /* ── Les objets ── */
    const small = Math.min(innerWidth, innerHeight) < 640;
    const dose = small ? 0.6 : 1;
    const [sprites, windows, models] = await Promise.all([
        Promise.all(SPRITES.map(async (def) => ({ make: await makeSprite(def, renderer), n: def.n, flat: true }))),
        Promise.all(WINDOWS.map(async (def) => ({ make: await makeWindow(def, renderer), n: 2, flat: false }))),
        Promise.all(MODELS.map(async (def) => {
            const model = await Promise.resolve().then(def.build).catch((err) => (console.error(err), null));
            return { make: model && ((count) => Array.from({ length: count }, () => model.clone())), n: def.n, flat: false };
        })),
    ]);

    const rand = seeded(11);
    const objects = [];
    for (const kind of [...sprites, ...windows, ...models]) {
        if (!kind.make) continue;
        const count = Math.max(1, Math.round(kind.n * dose));
        for (const obj of kind.make(count)) objects.push({ obj, flat: kind.flat });
    }
    /* Hauteurs et angles répartis en tranches égales puis mélangés :
       l'écran se remplit partout, sans trou ni paquet. */
    const shuffled = (n) => {
        const a = Array.from({ length: n }, (_, i) => i);
        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };
    const rows = shuffled(objects.length);
    const turns = shuffled(objects.length);
    const items = [];
    objects.forEach(({ obj, flat }, i) => {
        const n = objects.length;
        const item = {
            obj,
            flat,
            rN: Math.pow(rand(), 0.85),
            yN: ((rows[i] + 0.15 + rand() * 0.7) / n) * 2 - 1,
            zr: MathUtils.lerp(0.35, 0.6, rand()),
            ang: ((turns[i] + rand()) / n) * Math.PI * 2,
            speed: MathUtils.lerp(0.05, 0.11, rand()),
            bob: rand() * Math.PI * 2,
            wob: MathUtils.lerp(0.25, 0.6, rand()),
            amp: flat ? MathUtils.lerp(0.35, 1.25, rand()) : MathUtils.lerp(0.6, 1.6, rand()),
            rot: { x: (rand() - 0.5) * 0.7, y: (rand() - 0.5) * 0.8, z: (rand() - 0.5) * 0.9 },
            scale: MathUtils.lerp(0.75, 1.2, rand()),
            delay: rand() * 0.9,
            rx: 0,
            rz: 0,
            y: 0,
            materials: [],
        };
        obj.traverse((o) => { if (o.material) item.materials.push(o.material); });
        obj.scale.setScalar(item.scale);
        root.add(obj);
        items.push(item);
    });

    /* ── Cadrage : le texte occupe une part fixe de la largeur ── */
    let halfW = 1;
    let halfH = 1;
    let baseDist = 10;
    let clearX = 1;
    let clearY = 1;
    function layout() {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const tan = Math.tan(MathUtils.degToRad(camera.fov / 2));
        const share = camera.aspect < 0.8 ? 0.9 : camera.aspect < 1.3 ? 0.74 : 0.6;
        baseDist = Math.max(textW / share / (2 * tan * camera.aspect), textH / 0.42 / (2 * tan));
        halfH = tan * baseDist;
        halfW = halfH * camera.aspect;
        camera.updateProjectionMatrix();

        clearX = textW / 2 + 0.9;
        clearY = textH / 2 + 0.75;
        const outer = Math.max(halfW * 1.15, clearX + (camera.aspect < 1 ? 0.6 : 2.4));
        for (const it of items) {
            it.y = it.yN * halfH * 0.96;
            const inner = Math.abs(it.y) < clearY ? clearX : 0.5;
            it.rx = MathUtils.lerp(inner, outer, it.rN);
            it.rz = Math.min(it.rx * it.zr, baseDist * 0.32);
        }
    }
    layout();
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
    let lastScroll = scrollY;
    let boost = 0;
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
        const dt = still ? 0 : Math.min(timer.getDelta(), 0.05);
        const t = still ? 0 : timer.getElapsed();
        const born = t;

        const s = scrollY;
        boost = MathUtils.lerp(boost, Math.min(Math.abs(s - lastScroll) * 0.12, 6), 0.08);
        lastScroll = s;
        progress = MathUtils.lerp(progress, readScroll(), still ? 1 : 0.12);
        const p = easeInOut(progress);

        pointer.x = MathUtils.lerp(pointer.x, pointer.tx, 0.05);
        pointer.y = MathUtils.lerp(pointer.y, pointer.ty, 0.05);
        root.rotation.set(
            p * 0.9 + pointer.y * 0.1,
            p * 0.45 + pointer.x * 0.22,
            -p * 0.42,
        );
        camera.position.set(0, 0, baseDist * MathUtils.lerp(1, 0.9, p));
        camera.lookAt(0, 0, 0);

        const intro = still ? 1 : easeOutBack(MathUtils.clamp(born / 1.3, 0, 1));
        title.scale.setScalar(MathUtils.lerp(0.55, 1, intro));
        title.rotation.y = TITLE_REST.y + (1 - Math.min(intro, 1)) * -0.9;

        for (const it of items) {
            const life = still ? 1 : MathUtils.clamp((born - it.delay) / 1.4, 0, 1);
            const arrive = easeOut(life);
            it.ang += it.speed * dt * (1 + boost);
            const spread = MathUtils.lerp(2.4, 1, arrive);
            /* Devant le titre, l'objet monte au-dessus ou passe en dessous
               au lieu de le masquer ; derrière, il reprend sa hauteur. */
            const front = Math.max(0, Math.sin(it.ang));
            const gap = clearY + 0.35 - Math.abs(it.y);
            const lift = gap > 0 ? Math.sign(it.y || 1) * gap * front * front * (3 - 2 * front) : 0;
            it.obj.position.set(
                Math.cos(it.ang) * it.rx * spread,
                (it.y + lift) * MathUtils.lerp(1.6, 1, arrive) + Math.sin(t * it.wob + it.bob) * 0.12,
                Math.sin(it.ang) * it.rz * spread,
            );
            it.obj.scale.setScalar(it.scale * MathUtils.lerp(0.25, 1, arrive));
            it.obj.rotation.set(
                it.rot.x + Math.sin(t * it.wob * 0.7 + it.bob) * 0.25,
                it.rot.y + Math.sin(t * it.wob + it.bob * 2) * it.amp,
                it.rot.z + Math.cos(t * it.wob * 0.5 + it.bob) * 0.18,
            );
            if (it.materials[0]?.opacity < 1) {
                for (const m of it.materials) {
                    m.opacity = arrive;
                    if (arrive >= 1 && m.userData.solid) {
                        m.transparent = false;
                        m.needsUpdate = true;
                    }
                }
            }
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
        window.addEventListener('resize', () => frame(performance.now()));
        return;
    }
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(stage);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    start();
}
