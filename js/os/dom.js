// @ts-check
/**
 * WAB OS — fabrique d'éléments
 * Tout le texte passe par textContent : rien de ce qui est lu ou
 * tapé n'est jamais interprété comme du HTML.
 */

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

/**
 * Un symbole au trait (sym.css), peint dans la couleur du texte.
 * @param {string} name  sym-<name>.svg
 * @returns {HTMLSpanElement}
 */
export function symIcon(name) {
    const icon = el('span', `sym sym--${name}`);
    icon.setAttribute('aria-hidden', 'true');
    return icon;
}

/**
 * Une icône d'app (carré aux coins à peine arrondis).
 * @param {string} name  app-<name>.svg
 * @param {number} size
 * @returns {HTMLImageElement}
 */
export function appIcon(name, size) {
    const img = el('img', 'app-icon');
    img.src = new URL(`../../assets/icons/app-${name}.svg?v=3`, import.meta.url).href;
    img.alt = '';
    img.width = size;
    img.height = size;
    return img;
}

/**
 * L'état d'attente ou d'erreur d'une fenêtre : une ligne, et si
 * besoin une issue (réessayer, ou la page qui contient la même chose).
 * @param {HTMLElement} body
 * @param {string} message
 * @param {Array<HTMLElement>} [actions]
 */
export function showState(body, message, actions = []) {
    const box = el('div', 'os-state');
    box.append(el('p', 'os-state__text', message));
    if (actions.length) {
        const row = el('div', 'os-state__actions');
        row.append(...actions);
        box.append(row);
    }
    body.replaceChildren(box);
}

/**
 * @param {string} label
 * @param {string} href
 * @param {string} [modifier]
 */
export function keyLink(label, href, modifier = '') {
    const link = el('a', `glass-btn glass-btn--sm ${modifier}`.trim(), label);
    link.href = href;
    return link;
}
