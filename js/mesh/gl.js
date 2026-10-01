// @ts-check
/**
 * WAB. — Fond animé : la mise en route de WebGL
 * Compiler les deux shaders, les lier, et poser le triangle qui
 * couvre tout l'écran. Chaque étape qui échoue renvoie null : le fond
 * CSS d'origine reste alors visible, sans erreur pour le visiteur.
 */

/* Un seul triangle, plus grand que l'écran : il en couvre chaque
   pixel sans la diagonale qu'auraient deux triangles. */
const VERTEX_SOURCE = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FULLSCREEN_TRIANGLE = new Float32Array([-1, -1, 3, -1, -1, 3]);

/**
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 * @returns {WebGLShader | null}
 */
function compile(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
}

/**
 * Prépare le programme et le triangle ; renvoie null si le
 * navigateur ou la carte graphique refuse l'une des étapes.
 * @param {WebGLRenderingContext} gl
 * @param {string} fragmentSource
 * @returns {WebGLProgram | null}
 */
export function createProgram(gl, fragmentSource) {
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SOURCE);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    if (!buffer) return null;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLE, gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    return program;
}
