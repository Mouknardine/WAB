// @ts-check
/**
 * WAB. — Fenêtre de contact : accès au DOM
 * La fenêtre est construite par nos soins : un élément absent est
 * une erreur de code, pas un cas à contourner. On le dit tout de
 * suite plutôt que de laisser un bouton muet.
 */

/**
 * @template {Element} T
 * @param {ParentNode} root
 * @param {string} selector
 * @param {{ new (): T }} type
 * @returns {T}
 */
export function requireElement(root, selector, type) {
    const element = root.querySelector(selector);
    if (element instanceof type) return element;
    throw new Error(`Fenêtre de contact : élément « ${selector} » introuvable.`);
}
