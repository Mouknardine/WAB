// @ts-check
/**
 * WAB OS — la notification
 * Une ligne en bas de l'écran (« Email copié »), annoncée aux
 * lecteurs d'écran par une région polie. Elle part seule.
 */

const VISIBLE_MS = 2600;

/** @type {HTMLElement | null} */
let region = null;
let timer = 0;

function getRegion() {
    if (region) return region;
    region = document.createElement('p');
    region.className = 'os-toast';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
    return region;
}

/** @param {string} message */
export function toast(message) {
    const el = getRegion();
    el.textContent = message;
    el.classList.add('is-shown');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => el.classList.remove('is-shown'), VISIBLE_MS);
}
