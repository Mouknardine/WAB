// @ts-check
/**
 * WAB OS — 404 : le chemin demandé, dans la barre de la fenêtre
 * Comme un vrai message d'erreur, la fenêtre nomme l'adresse qui n'a
 * rien donné. Écrit en textContent (jamais en HTML) : une adresse
 * forgée ne peut rien injecter. Tronquée au milieu si elle est longue.
 * Sans script, la barre garde « page-introuvable ».
 */

const MAX = 42;

/** @param {string} raw */
function readable(raw) {
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

/** @param {string} text */
function shorten(text) {
    if (text.length <= MAX) return text;
    const half = Math.floor((MAX - 1) / 2);
    return `${text.slice(0, half)}…${text.slice(-half)}`;
}

export function initPath() {
    const slot = document.querySelector('[data-lost-path]');
    const path = readable(window.location.pathname);
    if (!slot || path === '/' || path === '/404.html') return;
    slot.textContent = shorten(path);
}
