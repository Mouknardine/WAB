// @ts-check
/**
 * WAB. — « WAB. » en pixels, au pied de la page
 * Donne à chaque pixel son retard d'arrivée (--d, en millisecondes),
 * de gauche à droite avec une pointe de haut en bas : le nom se
 * construit comme une ligne qu'on tape. L'arrivée elle-même est en
 * CSS (os-footer.css), déclenchée par watch.js.
 */

/** Taille d'une case dans le dessin SVG. */
const CELL = 10;
const PER_COLUMN_MS = 28;
const PER_ROW_MS = 14;

export function initPixels() {
    // Le script est là : les pixels peuvent attendre leur arrivée.
    document.querySelectorAll('.pixel-name').forEach((name) => name.classList.add('is-armed'));
    document.querySelectorAll('.pixel-name .px').forEach((pixel) => {
        if (!(pixel instanceof SVGElement)) return;
        const column = Number(pixel.getAttribute('x')) / CELL || 0;
        const row = Number(pixel.getAttribute('y')) / CELL || 0;
        pixel.style.setProperty('--d', String(Math.round(column * PER_COLUMN_MS + row * PER_ROW_MS)));
    });
}
