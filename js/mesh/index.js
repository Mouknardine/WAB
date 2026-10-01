// @ts-check
/**
 * WAB. — Fond animé « Mesh drift »
 * Quatre taches de couleur dérivent lentement derrière tout le site :
 * deux roses vifs, un pêche et une crème, avec un léger grain. Le
 * calque est fixe, sous les oiseaux et sous le contenu.
 *
 * L'animation s'arrête quand l'onglet est caché, se fige sur une
 * seule image si le visiteur a demandé moins d'animations, et cède
 * la place au dégradé CSS d'origine si WebGL n'est pas disponible.
 */

import { SHADER_LIB } from './shader-lib.js?v=1';
import { SHADER_MAIN } from './shader-main.js?v=1';
import { createProgram } from './gl.js?v=1';

/* Du plus sombre au plus clair. Les deux bleus de la recette
   d'origine (#3DAFDB, #6ED3DE) deviennent des roses de même éclat,
   dans la teinte du rose de la marque. */
const COLORS = ['#e8418f', '#f27bb4', '#f8d8c9', '#fbf0d0'];

/* Les réglages du Shader Builder, déjà convertis. */
const SHAPE = [1.16, 0.34, 0.5, 0.0];
const SURFACE = [2.4, 1.16, 0.0, 1.0];
const FINISH = [0.0, 0.0, 0.0, 0.09];
const TRANSFORM = [1453.0, 0.0, 0.0, 0.0];
const SPACE = [0.0, 0.0, 0.0, 0.0];
const CURSOR_OFF = [0.0, 2.0, 0.65, 0.46];
const TIME_SCALE = 0.73;
const MAX_PIXEL_RATIO = 2;

/**
 * @param {string} hex
 * @returns {number[]}
 */
function hexToRgb(hex) {
    const value = parseInt(hex.slice(1), 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((c) => c / 255);
}

/** Huit couleurs attendues par le shader ; les cases vides sont noires. */
function packedColors() {
    const flat = new Float32Array(8 * 3);
    COLORS.forEach((hex, i) => flat.set(hexToRgb(hex), i * 3));
    return flat;
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 */
function setStaticUniforms(gl, program) {
    const at = (/** @type {string} */ name) => gl.getUniformLocation(program, name);
    gl.uniform3fv(at('u_colors'), packedColors());
    gl.uniform4fv(at('u_shape'), SHAPE);
    gl.uniform4fv(at('u_surface'), SURFACE);
    gl.uniform4fv(at('u_finish'), FINISH);
    gl.uniform4fv(at('u_transform'), TRANSFORM);
    gl.uniform4fv(at('u_space'), SPACE);
    gl.uniform4fv(at('u_cursor'), CURSOR_OFF);
}

function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'meshCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    return canvas;
}

function initMesh() {
    const canvas = createCanvas();
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false });
    if (!gl) {
        canvas.remove();
        return;
    }

    /** Programme compilé et réglé ; renvoie l'emplacement de u_scene. */
    const setup = () => {
        const program = createProgram(gl, SHADER_LIB + SHADER_MAIN);
        if (!program) return null;
        setStaticUniforms(gl, program);
        return gl.getUniformLocation(program, 'u_scene');
    };

    let sceneLocation = setup();
    if (!sceneLocation) {
        canvas.remove();
        return;
    }
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = performance.now();
    let frame = 0;

    function resize() {
        const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
        const width = Math.round(canvas.clientWidth * ratio);
        const height = Math.round(canvas.clientHeight * ratio);
        if (canvas.width === width && canvas.height === height) return;
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
    }

    function draw() {
        resize();
        const seconds = (performance.now() - start) / 1000;
        gl.uniform4f(sceneLocation, canvas.width, canvas.height, seconds * TIME_SCALE, COLORS.length);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function loop() {
        draw();
        frame = requestAnimationFrame(loop);
    }

    function stop() {
        cancelAnimationFrame(frame);
        frame = 0;
    }

    /* Tourne seulement si l'onglet est visible et que le visiteur
       accepte les animations ; sinon une image fixe suffit. */
    function sync() {
        stop();
        if (document.hidden || gl.isContextLost()) return;
        if (motionQuery.matches) draw();
        else loop();
    }

    canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        stop();
        document.documentElement.classList.remove('has-mesh');
    });
    canvas.addEventListener('webglcontextrestored', () => {
        sceneLocation = setup();
        if (!sceneLocation) return;
        canvas.width = 0;
        document.documentElement.classList.add('has-mesh');
        sync();
    });

    document.addEventListener('visibilitychange', sync);
    motionQuery.addEventListener('change', sync);
    window.addEventListener('resize', () => {
        if (!frame) draw();
    });

    document.documentElement.classList.add('has-mesh');
    sync();
}

initMesh();
